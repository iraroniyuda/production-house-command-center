[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoPath = (
    Resolve-Path (
        Join-Path $PSScriptRoot "..\.."
    )
).Path

$E2EUsername = "phcc-e2e-browser-auth"
$FrontendUrl = "http://localhost:3000/"
$ApiHealthUrl = "http://localhost:8081/actuator/health"
$KeycloakReadyUrl = "http://localhost:9000/health/ready"
$KeycloakDiscoveryUrl = (
    "http://localhost:8080/realms/phcc/" +
    ".well-known/openid-configuration"
)

$RunId = [Guid]::NewGuid().ToString("N")
$TemporaryDirectory = Join-Path `
    ([System.IO.Path]::GetTempPath()) `
    "phcc-browser-auth-e2e-$RunId"

$ApiStandardOutputPath = Join-Path `
    $TemporaryDirectory `
    "api.stdout.log"

$ApiStandardErrorPath = Join-Path `
    $TemporaryDirectory `
    "api.stderr.log"

$WebStandardOutputPath = Join-Path `
    $TemporaryDirectory `
    "web.stdout.log"

$WebStandardErrorPath = Join-Path `
    $TemporaryDirectory `
    "web.stderr.log"

$LocalKeycloakScriptPath = Join-Path `
    $TemporaryDirectory `
    "keycloak-user-lifecycle.sh"

$ContainerKeycloakScriptPath = (
    "/tmp/phcc-e2e-user-$RunId.sh"
)

$ApiProcess = $null
$WebProcess = $null
$KeycloakContainerId = $null
$KeycloakScriptCopied = $false
$E2EPassword = $null
$PasswordBytes = $null
$RandomGenerator = $null
$PrimaryError = $null

$CleanupFailures = New-Object `
    "System.Collections.Generic.List[string]"

$OriginalE2EUsername = $env:PHCC_E2E_USERNAME
$OriginalE2EPassword = $env:PHCC_E2E_PASSWORD
$OriginalE2EBaseUrl = $env:PHCC_E2E_BASE_URL
$OriginalE2EOutputDirectory = $env:PHCC_E2E_OUTPUT_DIR

function Assert-NativeSuccess {
    param(
        [Parameter(Mandatory = $true)]
        [int]$ExitCode,

        [Parameter(Mandatory = $true)]
        [string]$Operation
    )

    if ($ExitCode -ne 0) {
        throw "$Operation failed with exit code $ExitCode."
    }
}

function Assert-PortAvailable {
    param(
        [Parameter(Mandatory = $true)]
        [int]$Port,

        [Parameter(Mandatory = $true)]
        [string]$ServiceName
    )

    $Listeners = @(
        Get-NetTCPConnection `
            -LocalPort $Port `
            -State Listen `
            -ErrorAction SilentlyContinue
    )

    if ($Listeners.Count -gt 0) {
        throw (
            "$ServiceName cannot start because port " +
            "$Port is already listening."
        )
    }
}

function Wait-HttpEndpoint {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Uri,

        [Parameter(Mandatory = $true)]
        [string]$Name,

        [Parameter(Mandatory = $true)]
        [int]$TimeoutSeconds,

        $Process = $null
    )

    $Stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $LastErrorMessage = "No response received."

    while ($Stopwatch.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
        if ($null -ne $Process) {
            $Process.Refresh()

            if ($Process.HasExited) {
                throw (
                    "$Name process exited before readiness " +
                    "with code $($Process.ExitCode)."
                )
            }
        }

        try {
            $Response = Invoke-WebRequest `
                -Uri $Uri `
                -UseBasicParsing `
                -TimeoutSec 5

            if ([int]$Response.StatusCode -eq 200) {
                Write-Host "$Name is ready."
                return
            }

            $LastErrorMessage = (
                "HTTP " +
                [int]$Response.StatusCode
            )
        }
        catch {
            $LastErrorMessage = $_.Exception.Message
        }

        Start-Sleep -Milliseconds 1000
    }

    throw (
        "$Name did not become ready within " +
        "$TimeoutSeconds seconds. Last error: " +
        $LastErrorMessage
    )
}

function Wait-PortClosed {
    param(
        [Parameter(Mandatory = $true)]
        [int]$Port,

        [Parameter(Mandatory = $true)]
        [string]$Name,

        [int]$TimeoutSeconds = 15
    )

    $Stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

    while ($Stopwatch.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
        $Listeners = @(
            Get-NetTCPConnection `
                -LocalPort $Port `
                -State Listen `
                -ErrorAction SilentlyContinue
        )

        if ($Listeners.Count -eq 0) {
            return
        }

        Start-Sleep -Milliseconds 500
    }

    throw "$Name still owns port $Port after cleanup."
}

function Start-LoggedCommand {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,

        [Parameter(Mandatory = $true)]
        [string]$CommandLine,

        [Parameter(Mandatory = $true)]
        [string]$StandardOutputPath,

        [Parameter(Mandatory = $true)]
        [string]$StandardErrorPath
    )

    Write-Host "Starting $Name..."

    return Start-Process `
        -FilePath $env:ComSpec `
        -ArgumentList @(
            "/d"
            "/s"
            "/c"
            $CommandLine
        ) `
        -WorkingDirectory $RepoPath `
        -RedirectStandardOutput $StandardOutputPath `
        -RedirectStandardError $StandardErrorPath `
        -WindowStyle Hidden `
        -PassThru
}

function Stop-ProcessTree {
    param(
        $Process,

        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    if ($null -eq $Process) {
        return
    }

    try {
        $Process.Refresh()

        if (-not $Process.HasExited) {
            & taskkill.exe `
                /PID $Process.Id `
                /T `
                /F `
                2>$null |
                Out-Null
        }
    }
    catch {
        throw "Unable to stop $Name process tree: $($_.Exception.Message)"
    }
}

function Show-LogTail {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Label,

        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if (-not (Test-Path $Path)) {
        return
    }

    Write-Host ""
    Write-Host "--- $Label ---"

    Get-Content `
        $Path `
        -Tail 80 `
        -ErrorAction SilentlyContinue
}

function Write-KeycloakLifecycleScript {
    $ShellLines = @(
        '#!/bin/sh'
        'set -eu'
        ''
        'MODE="$1"'
        'E2E_USERNAME="$2"'
        'KCADM="/opt/keycloak/bin/kcadm.sh"'
        ''
        'export KC_CLI_PASSWORD="$KC_BOOTSTRAP_ADMIN_PASSWORD"'
        ''
        'kc() {'
        '  "$KCADM" "$@" \'
        '    --no-config \'
        '    --server http://localhost:8080 \'
        '    --realm master \'
        '    --user "$KC_BOOTSTRAP_ADMIN_USERNAME"'
        '}'
        ''
        'find_user_ids() {'
        '  kc get users \'
        '    -r phcc \'
        '    -q "username=$E2E_USERNAME" \'
        '    -q exact=true \'
        '    --fields id \'
        '    --format csv \'
        '    --noquotes \'
        '    | tr -d "\r" \'
        '    | while IFS= read -r LINE'
        '      do'
        '        case "$LINE" in'
        '          ""|"id")'
        '            ;;'
        '          *)'
        '            printf "%s\n" "$LINE"'
        '            ;;'
        '        esac'
        '      done'
        '}'
        ''
        'find_role_names() {'
        '  TARGET_USER_ID="$1"'
        ''
        '  kc get "users/$TARGET_USER_ID/role-mappings/realm/composite" \'
        '    -r phcc \'
        '    --fields name \'
        '    --format csv \'
        '    --noquotes \'
        '    | tr -d "\r" \'
        '    | while IFS= read -r LINE'
        '      do'
        '        case "$LINE" in'
        '          ""|"name")'
        '            ;;'
        '          *)'
        '            printf "%s\n" "$LINE"'
        '            ;;'
        '        esac'
        '      done'
        '}'
        ''
        'cleanup_user() {'
        '  USER_IDS="$(find_user_ids || true)"'
        ''
        '  if [ -n "$USER_IDS" ]; then'
        '    for TARGET_USER_ID in $USER_IDS'
        '    do'
        '      kc delete "users/$TARGET_USER_ID" \'
        '        -r phcc \'
        '        >/dev/null'
        '    done'
        '  fi'
        '}'
        ''
        'verify_user_absent() {'
        '  REMAINING_IDS="$(find_user_ids || true)"'
        ''
        '  if [ -n "$REMAINING_IDS" ]; then'
        '    echo "Runtime user cleanup verification failed." >&2'
        '    exit 1'
        '  fi'
        '}'
        ''
        'case "$MODE" in'
        '  provision)'
        '    IFS= read -r E2E_PASSWORD'
        ''
        '    if [ -z "$E2E_PASSWORD" ]; then'
        '      echo "Runtime password was not supplied." >&2'
        '      exit 1'
        '    fi'
        ''
        '    if [ "${#E2E_PASSWORD}" -ne 48 ]; then'
        '      echo "Runtime password length validation failed." >&2'
        '      exit 1'
        '    fi'
        ''
        '    cleanup_user'
        '    verify_user_absent'
        '    echo "Stale runtime user cleanup complete."'
        ''
        '    USER_ID="$(kc create users \'
        '      -r phcc \'
        '      -s "username=$E2E_USERNAME" \'
        '      -s "email=$E2E_USERNAME@example.invalid" \'
        '      -s emailVerified=true \'
        '      -s firstName=PHCC \'
        '      -s lastName=BrowserE2E \'
        '      -s ''requiredActions=[]'' \'
        '      -s enabled=true \'
        '      -i)"'
        ''
        '    if [ -z "$USER_ID" ]; then'
        '      echo "Runtime user creation returned no ID." >&2'
        '      exit 1'
        '    fi'
        ''
        '    kc set-password \'
        '      -r phcc \'
        '      --userid "$USER_ID" \'
        '      --new-password "$E2E_PASSWORD" \'
        '      >/dev/null'
        ''
        '    kc add-roles \'
        '      -r phcc \'
        '      --uid "$USER_ID" \'
        '      --rolename producer \'
        '      >/dev/null'
        ''
        '    FOUND_IDS="$(find_user_ids)"'
        '    set -- $FOUND_IDS'
        '    FOUND_COUNT=$#'
        ''
        '    if [ "$FOUND_COUNT" -ne 1 ]; then'
        '      echo "Expected one exact runtime user, found $FOUND_COUNT." >&2'
        '      exit 1'
        '    fi'
        ''
        '    FOUND_ID="$1"'
        ''
        '    if [ "$FOUND_ID" != "$USER_ID" ]; then'
        '      echo "Exact user lookup returned an unexpected ID." >&2'
        '      exit 1'
        '    fi'
        ''
        '    ROLE_NAMES="$(find_role_names "$USER_ID")"'
        '    HAS_PRODUCER=false'
        ''
        '    for ROLE_NAME in $ROLE_NAMES'
        '    do'
        '      if [ "$ROLE_NAME" = "producer" ]; then'
        '        HAS_PRODUCER=true'
        '      fi'
        '    done'
        ''
        '    if [ "$HAS_PRODUCER" != "true" ]; then'
        '      echo "Runtime user does not have producer role." >&2'
        '      exit 1'
        '    fi'
        ''
        '    echo "Runtime user provisioned and verified."'
        '    ;;'
        ''
        '  cleanup)'
        '    cleanup_user'
        '    verify_user_absent'
        '    echo "Runtime user cleanup verified."'
        '    ;;'
        ''
        '  *)'
        '    echo "Unsupported lifecycle mode: $MODE" >&2'
        '    exit 1'
        '    ;;'
        'esac'
    )

    $ShellContent = (
        [string]::Join("`n", $ShellLines)
    ) + "`n"

    $Utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)

    [System.IO.File]::WriteAllText(
        $LocalKeycloakScriptPath,
        $ShellContent,
        $Utf8WithoutBom
    )

    $ScriptBytes = [System.IO.File]::ReadAllBytes(
        $LocalKeycloakScriptPath
    )

    $HasUtf8Bom = (
        $ScriptBytes.Length -ge 3 -and
        $ScriptBytes[0] -eq 239 -and
        $ScriptBytes[1] -eq 187 -and
        $ScriptBytes[2] -eq 191
    )

    if ($HasUtf8Bom) {
        throw "Temporary Keycloak script contains a UTF-8 BOM."
    }

    if ($ScriptBytes -contains 13) {
        throw "Temporary Keycloak script contains CR characters."
    }
}

function Invoke-KeycloakLifecycle {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet("provision", "cleanup")]
        [string]$Mode
    )

    if ([string]::IsNullOrWhiteSpace($KeycloakContainerId)) {
        throw "Keycloak container ID is unavailable."
    }

    if (-not $KeycloakScriptCopied) {
        throw "Keycloak lifecycle script is unavailable."
    }

    if ($Mode -eq "provision") {
        if ([string]::IsNullOrWhiteSpace($E2EPassword)) {
            throw "Runtime E2E password is unavailable."
        }

        $DockerStartInfo = New-Object `
            System.Diagnostics.ProcessStartInfo

        $DockerStartInfo.FileName = "docker.exe"
        $DockerStartInfo.Arguments = [string]::Join(
            " ",
            @(
                "exec"
                "-i"
                $KeycloakContainerId
                "sh"
                $ContainerKeycloakScriptPath
                "provision"
                $E2EUsername
            )
        )

        $DockerStartInfo.WorkingDirectory = $RepoPath
        $DockerStartInfo.UseShellExecute = $false
        $DockerStartInfo.RedirectStandardInput = $true
        $DockerStartInfo.RedirectStandardOutput = $false
        $DockerStartInfo.RedirectStandardError = $false
        $DockerStartInfo.CreateNoWindow = $true

        $DockerProcess = New-Object `
            System.Diagnostics.Process

        $DockerProcess.StartInfo = $DockerStartInfo
        $PasswordPayload = $null
        $DockerExitCode = $null

        try {
            $ProcessStarted = $DockerProcess.Start()

            if (-not $ProcessStarted) {
                throw "Unable to start docker.exe."
            }

            $PasswordPayload = (
                [System.Text.Encoding]::ASCII.GetBytes(
                    $E2EPassword + "`n"
                )
            )

            $DockerProcess.StandardInput.BaseStream.Write(
                $PasswordPayload,
                0,
                $PasswordPayload.Length
            )

            $DockerProcess.StandardInput.BaseStream.Flush()
            $DockerProcess.StandardInput.Close()
            $DockerProcess.WaitForExit()

            $DockerExitCode = $DockerProcess.ExitCode
        }
        finally {
            if ($null -ne $PasswordPayload) {
                [Array]::Clear(
                    $PasswordPayload,
                    0,
                    $PasswordPayload.Length
                )
            }

            $DockerProcess.Dispose()
        }

        Assert-NativeSuccess `
            -ExitCode $DockerExitCode `
            -Operation "Runtime-user provisioning"

        return
    }

    docker exec `
        $KeycloakContainerId `
        sh `
        $ContainerKeycloakScriptPath `
        cleanup `
        $E2EUsername

    Assert-NativeSuccess `
        -ExitCode $LASTEXITCODE `
        -Operation "Runtime-user cleanup"
}

Set-Location $RepoPath

New-Item `
    -ItemType Directory `
    -Path $TemporaryDirectory `
    -Force |
    Out-Null

try {
    try {
        Write-Host ""
        Write-Host "============================================================"
        Write-Host "PHCC BROWSER AUTHENTICATION E2E"
        Write-Host "============================================================"

        $InfraEnvironmentPath = Join-Path `
            $RepoPath `
            "infra\.env"

        if (-not (Test-Path $InfraEnvironmentPath)) {
            throw (
                "Missing infra/.env. Copy infra/.env.example " +
                "and configure local values first."
            )
        }

        Assert-PortAvailable `
            -Port 3000 `
            -ServiceName "Frontend"

        Assert-PortAvailable `
            -Port 8081 `
            -ServiceName "API"

        Write-Host ""
        Write-Host "--- Ensuring local infrastructure ---"

        docker compose `
            --env-file infra/.env `
            -f infra/compose.yaml `
            up -d

        Assert-NativeSuccess `
            -ExitCode $LASTEXITCODE `
            -Operation "Docker Compose startup"

        Write-Host ""
        Write-Host "--- Waiting for Keycloak ---"

        Wait-HttpEndpoint `
            -Uri $KeycloakReadyUrl `
            -Name "Keycloak readiness" `
            -TimeoutSeconds 120

        Wait-HttpEndpoint `
            -Uri $KeycloakDiscoveryUrl `
            -Name "Keycloak discovery" `
            -TimeoutSeconds 30

        $KeycloakContainerId = docker compose `
            --env-file infra/.env `
            -f infra/compose.yaml `
            ps -q keycloak

        Assert-NativeSuccess `
            -ExitCode $LASTEXITCODE `
            -Operation "Keycloak container lookup"

        if ([string]::IsNullOrWhiteSpace($KeycloakContainerId)) {
            throw "Keycloak container is not running."
        }

        Write-Host ""
        Write-Host "--- Preparing runtime user lifecycle ---"

        docker exec `
            --user 0 `
            $KeycloakContainerId `
            sh -c 'rm -f /tmp/phcc-e2e-user-*.sh'

        Assert-NativeSuccess `
            -ExitCode $LASTEXITCODE `
            -Operation "Stale temporary-script cleanup"

        Write-KeycloakLifecycleScript

        docker cp `
            $LocalKeycloakScriptPath `
            "$($KeycloakContainerId):$ContainerKeycloakScriptPath"

        Assert-NativeSuccess `
            -ExitCode $LASTEXITCODE `
            -Operation "Keycloak lifecycle-script copy"

        $KeycloakScriptCopied = $true

        docker exec `
            $KeycloakContainerId `
            sh -n `
            $ContainerKeycloakScriptPath

        Assert-NativeSuccess `
            -ExitCode $LASTEXITCODE `
            -Operation "Keycloak lifecycle-script syntax validation"

        Write-Host ""
        Write-Host "--- Generating runtime-only credentials ---"

        $PasswordBytes = New-Object byte[] 24
        $RandomGenerator = (
            [System.Security.Cryptography.RandomNumberGenerator]::Create()
        )

        $RandomGenerator.GetBytes($PasswordBytes)

        $E2EPassword = -join (
            $PasswordBytes |
                ForEach-Object {
                    $_.ToString("x2")
                }
        )

        Write-Host "Runtime password generated in memory."

        Write-Host ""
        Write-Host "--- Provisioning runtime user ---"

        Invoke-KeycloakLifecycle -Mode provision

        Write-Host ""
        Write-Host "--- Starting PHCC API ---"

        $ApiProcess = Start-LoggedCommand `
            -Name "PHCC API" `
            -CommandLine (
                "apps\api\gradlew.bat " +
                "-p apps\api " +
                "bootRun " +
                "--args=--spring.profiles.active=local " +
                "--console=plain"
            ) `
            -StandardOutputPath $ApiStandardOutputPath `
            -StandardErrorPath $ApiStandardErrorPath

        Wait-HttpEndpoint `
            -Uri $ApiHealthUrl `
            -Name "PHCC API" `
            -TimeoutSeconds 180 `
            -Process $ApiProcess

        Write-Host ""
        Write-Host "--- Starting PHCC frontend ---"

        $WebProcess = Start-LoggedCommand `
            -Name "PHCC frontend" `
            -CommandLine "pnpm web:dev" `
            -StandardOutputPath $WebStandardOutputPath `
            -StandardErrorPath $WebStandardErrorPath

        Wait-HttpEndpoint `
            -Uri $FrontendUrl `
            -Name "PHCC frontend" `
            -TimeoutSeconds 120 `
            -Process $WebProcess

        Write-Host ""
        Write-Host "--- Running Playwright authentication lifecycle ---"

        $env:PHCC_E2E_USERNAME = $E2EUsername
        $env:PHCC_E2E_PASSWORD = $E2EPassword
        $env:PHCC_E2E_BASE_URL = $FrontendUrl.TrimEnd("/")
        $env:PHCC_E2E_OUTPUT_DIR = Join-Path `
            $TemporaryDirectory `
            "playwright-output"

        & pnpm --filter web test:e2e

        Assert-NativeSuccess `
            -ExitCode $LASTEXITCODE `
            -Operation "Playwright authentication test"

        Write-Host ""
        Write-Host "Browser authentication E2E passed."
    }
    catch {
        $PrimaryError = $_

        Write-Host ""
        Write-Host "E2E execution failed: $($_.Exception.Message)"

        Show-LogTail `
            -Label "API standard output" `
            -Path $ApiStandardOutputPath

        Show-LogTail `
            -Label "API standard error" `
            -Path $ApiStandardErrorPath

        Show-LogTail `
            -Label "Frontend standard output" `
            -Path $WebStandardOutputPath

        Show-LogTail `
            -Label "Frontend standard error" `
            -Path $WebStandardErrorPath
    }
}
finally {
    $env:PHCC_E2E_USERNAME = $OriginalE2EUsername
    $env:PHCC_E2E_PASSWORD = $OriginalE2EPassword
    $env:PHCC_E2E_BASE_URL = $OriginalE2EBaseUrl
    $env:PHCC_E2E_OUTPUT_DIR = `
        $OriginalE2EOutputDirectory

    if ($KeycloakScriptCopied) {
        try {
            Invoke-KeycloakLifecycle -Mode cleanup
        }
        catch {
            $CleanupFailures.Add(
                "Runtime-user cleanup: $($_.Exception.Message)"
            )
        }
    }

    try {
        Stop-ProcessTree `
            -Process $WebProcess `
            -Name "frontend"

        Wait-PortClosed `
            -Port 3000 `
            -Name "Frontend"
    }
    catch {
        $CleanupFailures.Add(
            "Frontend cleanup: $($_.Exception.Message)"
        )
    }

    try {
        Stop-ProcessTree `
            -Process $ApiProcess `
            -Name "API"

        Wait-PortClosed `
            -Port 8081 `
            -Name "API"
    }
    catch {
        $CleanupFailures.Add(
            "API cleanup: $($_.Exception.Message)"
        )
    }

    if (
        $KeycloakScriptCopied -and
        -not [string]::IsNullOrWhiteSpace($KeycloakContainerId)
    ) {
        try {
            docker exec `
                --user 0 `
                $KeycloakContainerId `
                sh -c 'rm -f "$1"' `
                sh `
                $ContainerKeycloakScriptPath `
                2>$null |
                Out-Null

            if ($LASTEXITCODE -ne 0) {
                throw (
                    "Container temporary-script removal " +
                    "returned exit code $LASTEXITCODE."
                )
            }
        }
        catch {
            $CleanupFailures.Add(
                "Container temporary-script cleanup: " +
                $_.Exception.Message
            )
        }
    }

    $E2EPassword = $null

    if ($null -ne $RandomGenerator) {
        $RandomGenerator.Dispose()
    }

    if ($null -ne $PasswordBytes) {
        [Array]::Clear(
            $PasswordBytes,
            0,
            $PasswordBytes.Length
        )
    }

    if (Test-Path $TemporaryDirectory) {
        try {
            Remove-Item `
                $TemporaryDirectory `
                -Recurse `
                -Force
        }
        catch {
            $CleanupFailures.Add(
                "Host temporary-file cleanup: " +
                $_.Exception.Message
            )
        }
    }
}

if ($null -ne $PrimaryError) {
    if ($CleanupFailures.Count -gt 0) {
        Write-Warning (
            "Cleanup also reported: " +
            [string]::Join(
                " | ",
                $CleanupFailures
            )
        )
    }

    throw $PrimaryError
}

if ($CleanupFailures.Count -gt 0) {
    throw (
        "E2E completed, but cleanup failed: " +
        [string]::Join(
            " | ",
            $CleanupFailures
        )
    )
}

Write-Host ""
Write-Host "PHCC browser authentication E2E completed cleanly."

import { expect, test, type Page } from "@playwright/test";

type CurrentUserResponse = Readonly<{
  subject: string;
  username: string;
  email: string | null;
  authorities: string[];
}>;

function readRequiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `${name} must be provided by the E2E orchestrator.`,
    );
  }

  return value;
}

function isCurrentUserResponse(
  value: unknown,
): value is CurrentUserResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.subject === "string" &&
    candidate.subject.length > 0 &&
    typeof candidate.username === "string" &&
    candidate.username.length > 0 &&
    (candidate.email === null ||
      typeof candidate.email === "string") &&
    Array.isArray(candidate.authorities) &&
    candidate.authorities.every(
      (authority) => typeof authority === "string",
    )
  );
}

async function requestCurrentUser(
  page: Page,
  expectedUsername: string,
): Promise<CurrentUserResponse> {
  const responsePromise = page.waitForResponse((response) => {
    const responseUrl = new URL(response.url());

    return (
      responseUrl.origin === "http://localhost:8081" &&
      responseUrl.pathname === "/api/v1/me" &&
      response.request().method() === "GET"
    );
  });

  await page
    .getByRole("button", {
      name: "Panggil /api/v1/me",
      exact: true,
    })
    .click();

  const response = await responsePromise;

  expect(response.status()).toBe(200);

  const responseBody: unknown = await response.json();

  expect(isCurrentUserResponse(responseBody)).toBe(true);

  if (!isCurrentUserResponse(responseBody)) {
    throw new Error(
      "The PHCC API returned an invalid current-user response.",
    );
  }

  expect(responseBody.username).toBe(expectedUsername);

  const roleAuthorities = responseBody.authorities.filter(
    (authority) => authority.startsWith("ROLE_"),
  );

  expect(roleAuthorities).toEqual(["ROLE_producer"]);

  await expect(page.locator("pre")).toContainText(
    `"username": "${expectedUsername}"`,
  );

  await expect(page.locator("pre")).toContainText(
    '"ROLE_producer"',
  );

  return responseBody;
}

async function expectAuthenticatedWorkspace(
  page: Page,
  expectedUsername: string,
): Promise<void> {
  await expect(page).toHaveURL(
    "http://localhost:3000/workspace",
  );

  await expect(
    page.getByRole("heading", {
      name: "Workspace Production House",
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    page.getByText("Authenticated application shell", {
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    page.getByText(expectedUsername, { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", {
      name: "Beranda publik",
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", {
      name: "Keluar",
      exact: true,
    }),
  ).toBeVisible();
}

test.describe.configure({ mode: "serial" });

test(
  "completes the protected workspace authentication lifecycle",
  async ({ page }) => {
    const username = readRequiredEnvironment(
      "PHCC_E2E_USERNAME",
    );

    const password = readRequiredEnvironment(
      "PHCC_E2E_PASSWORD",
    );

    await page.goto("/workspace");

    await expect(page).toHaveURL(
      "http://localhost:3000/workspace",
    );

    await expect(
      page.getByRole("heading", {
        name: "Autentikasi diperlukan",
        exact: true,
      }),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name: "Masuk ke workspace",
        exact: true,
      })
      .click();

    await expect(page.locator("#kc-form-login")).toBeVisible();

    await page.locator("#username").fill(username);
    await page.locator("#password").fill(password);
    await page.locator("#kc-login").click();

    try {
      await page.waitForURL(
        (url) =>
          url.origin === "http://localhost:3000" &&
          url.pathname === "/workspace",
        { timeout: 15_000 },
      );
    } catch {
      const currentUrl = new URL(page.url());
      const visibleText = (
        await page.locator("body").innerText()
      ).slice(0, 2_000);

      throw new Error(
        [
          "Login did not return to the protected PHCC workspace.",
          `Current location: ${currentUrl.origin}${currentUrl.pathname}`,
          `Visible page text: ${visibleText}`,
        ].join("\n"),
      );
    }

    try {
      await expectAuthenticatedWorkspace(page, username);
    } catch {
      const currentUrl = new URL(page.url());
      const visibleText = (
        await page.locator("body").innerText()
      ).slice(0, 2_000);

      throw new Error(
        [
          "The authenticated workspace shell was not visible.",
          `Current location: ${currentUrl.origin}${currentUrl.pathname}`,
          `Visible page text: ${visibleText}`,
        ].join("\n"),
      );
    }

    await page.reload();

    await expectAuthenticatedWorkspace(page, username);

    await page
      .getByRole("link", {
        name: "Beranda publik",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL("http://localhost:3000/");

    await expect(
      page.getByText("Authenticated", { exact: true }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: username,
        exact: true,
      }),
    ).toBeVisible();

    const initialIdentity = await requestCurrentUser(
      page,
      username,
    );

    expect(initialIdentity.subject).not.toHaveLength(0);

    await page.reload();

    await expect(
      page.getByText("Authenticated", { exact: true }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: username,
        exact: true,
      }),
    ).toBeVisible();

    const recoveredIdentity = await requestCurrentUser(
      page,
      username,
    );

    expect(recoveredIdentity.subject).toBe(
      initialIdentity.subject,
    );

    await page
      .getByRole("link", {
        name: "Buka workspace",
        exact: true,
      })
      .click();

    await expectAuthenticatedWorkspace(page, username);

    await page
      .getByRole("button", {
        name: "Keluar",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL("http://localhost:3000/");

    await expect(
      page.getByRole("heading", {
        name: "Belum terautentikasi",
        exact: true,
      }),
    ).toBeVisible();

    await page.goto("/workspace");

    await expect(page).toHaveURL(
      "http://localhost:3000/workspace",
    );

    await expect(
      page.getByRole("heading", {
        name: "Autentikasi diperlukan",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Masuk ke workspace",
        exact: true,
      }),
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("heading", {
        name: "Autentikasi diperlukan",
        exact: true,
      }),
    ).toBeVisible();
  },
);

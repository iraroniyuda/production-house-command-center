package com.phcc.security;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

class KeycloakRealmRoleConverterTests {

    private final KeycloakRealmRoleConverter converter =
            new KeycloakRealmRoleConverter();

    @Test
    void convertsOnlySupportedPhccRealmRoles() {
        Jwt jwt = Jwt.withTokenValue("test-token")
                .header("alg", "none")
                .claim("sub", "user-123")
                .claim("realm_access", Map.of(
                        "roles",
                        List.of(
                                "default-roles-phcc",
                                "offline_access",
                                "producer",
                                "uma_authorization",
                                "viewer",
                                "producer")))
                .build();

        List<String> authorities = converter.convert(jwt)
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        assertEquals(
                List.of("ROLE_producer", "ROLE_viewer"),
                authorities);
    }

    @Test
    void returnsNoAuthoritiesWhenRealmAccessIsMissing() {
        Jwt jwt = Jwt.withTokenValue("test-token")
                .header("alg", "none")
                .claim("sub", "user-123")
                .build();

        assertEquals(List.of(), converter.convert(jwt));
    }

    @Test
    void ignoresUnknownRealmRoles() {
        Jwt jwt = Jwt.withTokenValue("test-token")
                .header("alg", "none")
                .claim("sub", "user-123")
                .claim("realm_access", Map.of(
                        "roles",
                        List.of("unknown-role")))
                .build();

        assertEquals(List.of(), converter.convert(jwt));
    }
}
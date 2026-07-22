package com.phcc.security;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtAudienceValidator;

class JwtAudienceValidatorTests {

    private final JwtAudienceValidator validator =
            new JwtAudienceValidator("phcc-api");

    @Test
    void acceptsExpectedAudience() {
        Jwt jwt = jwtWithAudience(List.of(
                "account",
                "phcc-api"));

        assertFalse(validator.validate(jwt).hasErrors());
    }

    @Test
    void rejectsMissingAudience() {
        Jwt jwt = Jwt.withTokenValue("test-token")
                .header("alg", "none")
                .subject("user-123")
                .build();

        assertTrue(validator.validate(jwt).hasErrors());
    }

    @Test
    void rejectsDifferentAudience() {
        Jwt jwt = jwtWithAudience(List.of(
                "some-other-api"));

        assertTrue(validator.validate(jwt).hasErrors());
    }

    private Jwt jwtWithAudience(List<String> audience) {
        return Jwt.withTokenValue("test-token")
                .header("alg", "none")
                .subject("user-123")
                .audience(audience)
                .build();
    }
}
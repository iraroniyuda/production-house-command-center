package com.phcc.identity;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class IdentityController {

    @GetMapping("/me")
    public CurrentUserResponse currentUser(
            @AuthenticationPrincipal Jwt jwt,
            Authentication authentication) {

        String username = jwt.getClaimAsString("preferred_username");

        if (username == null || username.isBlank()) {
            username = jwt.getSubject();
        }

        List<String> authorities = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .sorted()
                .toList();

        return new CurrentUserResponse(
                jwt.getSubject(),
                username,
                jwt.getClaimAsString("email"),
                authorities);
    }

    public record CurrentUserResponse(
            String subject,
            String username,
            String email,
            List<String> authorities) {
    }
}
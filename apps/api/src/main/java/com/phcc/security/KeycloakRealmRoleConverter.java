package com.phcc.security;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

public final class KeycloakRealmRoleConverter
        implements Converter<Jwt, Collection<GrantedAuthority>> {

    private static final String REALM_ACCESS_CLAIM = "realm_access";
    private static final String ROLES_KEY = "roles";
    private static final String ROLE_PREFIX = "ROLE_";

    private static final Set<String> SUPPORTED_REALM_ROLES = Set.of(
            "phcc-admin",
            "producer",
            "production-manager",
            "director",
            "department-head",
            "crew-member",
            "viewer");

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Object realmAccessClaim = jwt.getClaims().get(REALM_ACCESS_CLAIM);

        if (!(realmAccessClaim instanceof Map<?, ?> realmAccess)) {
            return List.of();
        }

        Object rolesClaim = realmAccess.get(ROLES_KEY);

        if (!(rolesClaim instanceof Collection<?> roles)) {
            return List.of();
        }

        return roles.stream()
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .map(String::trim)
                .filter(SUPPORTED_REALM_ROLES::contains)
                .distinct()
                .map(role -> (GrantedAuthority)
                        new SimpleGrantedAuthority(ROLE_PREFIX + role))
                .toList();
    }
}
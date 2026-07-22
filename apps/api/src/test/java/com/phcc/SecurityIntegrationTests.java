package com.phcc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@Import(TestcontainersConfiguration.class)
@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void healthEndpointAllowsAnonymousRequests() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void currentUserRejectsAnonymousRequests() throws Exception {
        mockMvc.perform(get("/api/v1/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void currentUserReturnsAuthenticatedIdentity() throws Exception {
        mockMvc.perform(get("/api/v1/me")
                        .with(jwt()
                                .jwt(token -> token
                                        .subject("user-123")
                                        .claim("preferred_username", "roni")
                                        .claim("email", "roni@example.test"))
                                .authorities(
                                        new SimpleGrantedAuthority(
                                                "ROLE_producer"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subject").value("user-123"))
                .andExpect(jsonPath("$.username").value("roni"))
                .andExpect(jsonPath("$.email").value("roni@example.test"))
                .andExpect(jsonPath("$.authorities[0]")
                        .value("ROLE_producer"));
    }

    @Test
    void allowsCorsPreflightFromLocalWebApplication() throws Exception {
        mockMvc.perform(options("/api/v1/me")
                        .header(
                                HttpHeaders.ORIGIN,
                                "http://localhost:3000")
                        .header(
                                HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD,
                                "GET")
                        .header(
                                HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS,
                                "authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string(
                        HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN,
                        "http://localhost:3000"))
                .andExpect(header().string(
                        HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS,
                        containsString("GET")))
                .andExpect(header().string(
                        HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS,
                        containsString("authorization")));
    }
}
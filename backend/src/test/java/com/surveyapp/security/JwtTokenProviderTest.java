package com.surveyapp.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SecurityException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    private static final String TEST_SECRET =
            "dGVzdFNlY3JldEtleUZvclRlc3RpbmdQdXJwb3Nlc09ubHlOb3RGb3JQcm9k";
    private static final long EXPIRATION_MS = 3_600_000L;

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationMs", EXPIRATION_MS);
    }

    @Test
    void generateTokenFromUsername_shouldReturnNonNullToken() {
        String token = jwtTokenProvider.generateTokenFromUsername("testuser");
        assertThat(token).isNotNull().isNotEmpty();
    }

    @Test
    void generateToken_shouldReturnTokenForAuthentication() {
        UserDetails userDetails = new User("testuser", "password",
                List.of(new SimpleGrantedAuthority("ROLE_USER")));
        Authentication auth = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());

        String token = jwtTokenProvider.generateToken(auth);
        assertThat(token).isNotNull().isNotEmpty();
    }

    @Test
    void getUsernameFromToken_shouldReturnCorrectUsername() {
        String username = "testuser";
        String token = jwtTokenProvider.generateTokenFromUsername(username);

        String extracted = jwtTokenProvider.getUsernameFromToken(token);
        assertThat(extracted).isEqualTo(username);
    }

    @Test
    void validateToken_shouldReturnTrueForValidToken() {
        String token = jwtTokenProvider.generateTokenFromUsername("testuser");
        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
    }

    @Test
    void validateToken_shouldReturnFalseForMalformedToken() {
        assertThat(jwtTokenProvider.validateToken("this.is.not.a.jwt")).isFalse();
    }

    @Test
    void validateToken_shouldReturnFalseForTamperedToken() {
        String token = jwtTokenProvider.generateTokenFromUsername("testuser");
        String tampered = token.substring(0, token.lastIndexOf('.') + 1) + "invalidsignature";
        assertThat(jwtTokenProvider.validateToken(tampered)).isFalse();
    }

    @Test
    void validateToken_shouldReturnFalseForEmptyToken() {
        assertThat(jwtTokenProvider.validateToken("")).isFalse();
    }

    @Test
    void validateToken_shouldReturnFalseForExpiredToken() {
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationMs", -1000L);
        String expiredToken = jwtTokenProvider.generateTokenFromUsername("testuser");
        assertThat(jwtTokenProvider.validateToken(expiredToken)).isFalse();
    }
}

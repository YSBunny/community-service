package io.github.ysbunny.community.auth.service;

import io.github.ysbunny.community.auth.dto.request.LoginRequest;
import io.github.ysbunny.community.auth.dto.response.LoginResponse;
import io.github.ysbunny.community.global.security.TokenProvider;
import io.github.ysbunny.community.user.domain.Role;
import io.github.ysbunny.community.user.domain.User;
import io.github.ysbunny.community.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    void 로그인_성공() {
        // given
        LoginRequest request = new LoginRequest(
                "selina.yang@ktb.com",
                "password123!"
        );

        User user = new User(
                "selina.yang@ktb.com",
                "password123!",
                "selina",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo3sBLwV1edeVrDb7Kbq_XnkoPg-HwlKrhRvq5eEywaULeq8w670UEC7gG&s=10",
                Role.USER
        );

        ReflectionTestUtils.setField(user, "id", 1L);

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
        );

        UsernamePasswordAuthenticationToken returnToken = new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        when(userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(token)).thenReturn(returnToken);
        when(tokenProvider.createToken(returnToken)).thenReturn("jZMqqjm97WTcxk6czWBrj3H6owO+PzshRUHgQF9uNWA=");

        // when
        LoginResponse response = authService.login(request);

        // then
        assertNotNull(response);
        assertEquals(1L, response.getUserId());
        assertEquals("jZMqqjm97WTcxk6czWBrj3H6owO+PzshRUHgQF9uNWA=", response.getToken());

        verify(userRepository, times(1)).findByEmailAndDeletedAtIsNull(request.getEmail());
        verify(authenticationManager, times(1)).authenticate(token);
        verify(tokenProvider, times(1)).createToken(returnToken);
    }

    @Test
    void 존재하지_않는_이메일_로그인_실패() {
        // given
        LoginRequest request = new LoginRequest(
                "selina.yang@ktb.com",
                "password123!"
        );

        when(userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())).thenReturn(Optional.empty());

        // when & then
        assertThrows(IllegalArgumentException.class, () -> authService.login(request));

        verify(userRepository, times(1)).findByEmailAndDeletedAtIsNull(request.getEmail());
    }

    @Test
    void 비밀번호_불일치_로그인_실패() {
        // given
        LoginRequest request = new LoginRequest(
                "selina.yang@ktb.com",
                "password123!"
        );

        User user = new User(
                "selina.yang@ktb.com",
                "password123!",
                "selina",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo3sBLwV1edeVrDb7Kbq_XnkoPg-HwlKrhRvq5eEywaULeq8w670UEC7gG&s=10",
                Role.USER
        );

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
        );

        when(userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(token)).thenThrow(new BadCredentialsException("Bad credentials"));

        // when & then
        assertThrows(BadCredentialsException.class, () -> authService.login(request));

        verify(userRepository, times(1)).findByEmailAndDeletedAtIsNull(request.getEmail());
        verify(authenticationManager, times(1)).authenticate(token);
    }
}
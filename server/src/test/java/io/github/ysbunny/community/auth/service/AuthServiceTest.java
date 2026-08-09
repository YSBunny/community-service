package io.github.ysbunny.community.auth.service;

import io.github.ysbunny.community.auth.dto.request.LoginRequest;
import io.github.ysbunny.community.auth.dto.response.LoginResponse;
import io.github.ysbunny.community.auth.exception.LoginErrorCode;
import io.github.ysbunny.community.auth.exception.LoginException;
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
                "unknown@example.com",
                "password123!"
        );

        // findByEmailAndDeletedAtIsNull는 미가입 회원과 탈퇴 회원 모두 Optional.empty()를 반환한다.
        when(userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())).thenReturn(Optional.empty());

        // when
        LoginException exception = assertThrows(LoginException.class, () -> authService.login(request));

        // then
        assertEquals(LoginErrorCode.INVALID_CREDENTIALS, exception.getErrorCode());

        assertEquals("이메일 또는 비밀번호가 일치하지 않습니다.", exception.getMessage());

        verify(userRepository).findByEmailAndDeletedAtIsNull(request.getEmail());

        // 회원을 찾지 못하면 인증과 JWT 생성은 실행되지 않아야 한다.
        verifyNoInteractions(authenticationManager, tokenProvider);
    }

    @Test
    void 비밀번호_불일치_로그인_실패() {
        // given
        LoginRequest request = new LoginRequest("user@example.com", "wrong-password");

        User user = new User(
                "user@example.com",
                "encoded-password",
                "사용자",
                null,
                Role.USER
        );

        UsernamePasswordAuthenticationToken loginToken =
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());

        when(userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())).thenReturn(Optional.of(user));

        when(authenticationManager.authenticate(loginToken)).thenThrow(new BadCredentialsException("Bad credentials"));

        // when
        LoginException exception = assertThrows(LoginException.class, () -> authService.login(request));

        // then
        assertEquals(LoginErrorCode.INVALID_CREDENTIALS, exception.getErrorCode());

        assertEquals("이메일 또는 비밀번호가 일치하지 않습니다.", exception.getMessage());

        verify(userRepository).findByEmailAndDeletedAtIsNull(request.getEmail());

        verify(authenticationManager).authenticate(loginToken);

        // 인증 실패 시 JWT가 생성되면 안 된다.
        verify(tokenProvider, never()).createToken(org.mockito.ArgumentMatchers.any());
    }
}
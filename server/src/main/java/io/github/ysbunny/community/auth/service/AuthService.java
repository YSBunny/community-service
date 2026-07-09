package io.github.ysbunny.community.auth.service;

import io.github.ysbunny.community.auth.dto.request.LoginRequest;
import io.github.ysbunny.community.auth.dto.response.LoginResponse;
import io.github.ysbunny.community.global.security.TokenProvider;
import io.github.ysbunny.community.user.domain.User;
import io.github.ysbunny.community.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("email does not exist"));

        // 생성된 토큰을 AuthenticationManager에게 전달
        Authentication authentication = authenticationManager.authenticate(
                // 이메일, 비밀번호로 UsernamePasswordAuthenticationToken 생성
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Authentication 객체를 TokenProvider에 전달하고 JWT 반환 받음
        String accessToken = tokenProvider.createToken(authentication);

        return new LoginResponse(user.getId(), accessToken);
    }
}

package io.github.ysbunny.community.auth.controller;

import io.github.ysbunny.community.auth.dto.request.LoginRequest;
import io.github.ysbunny.community.auth.dto.response.LoginResponse;
import io.github.ysbunny.community.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}

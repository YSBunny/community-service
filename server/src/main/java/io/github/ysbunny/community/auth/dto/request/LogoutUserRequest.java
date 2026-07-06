package io.github.ysbunny.community.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class LogoutUserRequest {

    @NotBlank
    private String token;
}

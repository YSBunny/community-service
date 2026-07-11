package io.github.ysbunny.community.user.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdateUserRequest {

    @Size(min = 8, max = 20)
    private String password;

    @Size(max = 10)
    private String nickname;

    private String profileImage;
}

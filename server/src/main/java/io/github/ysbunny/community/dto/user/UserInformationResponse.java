package io.github.ysbunny.community.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserInformationResponse {
    private String email;
    private String nickname;
    private String profileImage;
}

package io.github.ysbunny.community.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PostDetailResponse {
    private Long postId;
    private String title;
    private String content;
    private String postImage;

    private String authorNickname;
    private String authorProfileImage;

    private Long commentCount;

    private LocalDateTime createdAt;
}

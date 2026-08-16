package io.github.ysbunny.community.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PostListItemResponse {
    private Long postId;
    private String title;

    private String authorNickname;
    private String authorProfileImage;

    private Long commentCount;
    private long likeCount;

    private LocalDateTime createdAt;
}

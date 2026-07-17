package io.github.ysbunny.community.comment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CommentListItemResponse {
    private Long commentId;
    private String commentContent;

    private String authorNickname;
    private String authorProfileImage;

    private LocalDateTime createdAt;
}

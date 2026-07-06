package io.github.ysbunny.community.comment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommentListItemResponse {
    private Long commentId;
    private String commentContent;
}

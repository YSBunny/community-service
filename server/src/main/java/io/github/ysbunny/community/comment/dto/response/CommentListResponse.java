package io.github.ysbunny.community.comment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CommentListResponse {
    private List<CommentListItemResponse> comments;
}

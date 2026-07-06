package io.github.ysbunny.community.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostListItemResponse {
    private Long postId;
    private String title;
}

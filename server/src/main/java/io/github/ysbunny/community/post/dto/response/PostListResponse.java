package io.github.ysbunny.community.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PostListResponse {
    private List<PostListItemResponse> popularPosts;
    private List<PostListItemResponse> posts;
}

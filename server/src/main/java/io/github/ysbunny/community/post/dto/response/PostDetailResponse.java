package io.github.ysbunny.community.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostDetailResponse {
    private String title;
    private String content;
    private String postImage;
}

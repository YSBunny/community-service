package io.github.ysbunny.community.post.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@AllArgsConstructor
public class CreatePostRequest {

    @NotBlank
    @Size(max = 26)
    private String title;

    @NotBlank
    private String content;

    private MultipartFile postImage;
}

package io.github.ysbunny.community.post.controller;

import io.github.ysbunny.community.post.dto.request.CreatePostRequest;
import io.github.ysbunny.community.post.dto.request.UpdatePostRequest;
import io.github.ysbunny.community.post.dto.response.*;
import io.github.ysbunny.community.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public CreatePostResponse createPost(
            Authentication authentication,
            @Valid @ModelAttribute CreatePostRequest request
    ) {
        String email = authentication.getName();

        Long postId = postService.createPost(email, request);

        return new CreatePostResponse(postId);
    }

    @GetMapping
    public PostListResponse getPostList() {
        return postService.getPostList();
    }

    @GetMapping("/{postId}")
    public PostDetailResponse getPost(@PathVariable Long postId) {
        return postService.getPost(postId);
    }

    @PatchMapping("/{postId}")
    public UpdatePostResponse updatePost(
            Authentication authentication,
            @PathVariable Long postId,
            @Valid @ModelAttribute UpdatePostRequest request
    ) {
        String email = authentication.getName();

        return postService.updatePost(email, postId, request);
    }

    @DeleteMapping("/{postId}")
    public DeletePostResponse deletePost(
            Authentication authentication,
            @PathVariable Long postId
    ) {
        String email = authentication.getName();

        return postService.deletePost(email, postId);
    }
}

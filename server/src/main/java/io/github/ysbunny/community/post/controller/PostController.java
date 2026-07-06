package io.github.ysbunny.community.post.controller;

import io.github.ysbunny.community.post.dto.request.CreatePostRequest;
import io.github.ysbunny.community.post.dto.request.UpdatePostRequest;
import io.github.ysbunny.community.post.dto.response.*;
import io.github.ysbunny.community.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public CreatePostResponse createPost(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody CreatePostRequest request
    ) {
        String loginToken = authorizationHeader.replace("Bearer ", "");

        Long postId = postService.createPost(loginToken, request);

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
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long postId,
            @Valid @RequestBody UpdatePostRequest request
    ) {
        String loginToken = authorizationHeader.replace("Bearer ", "");

        return postService.updatePost(loginToken, postId, request);
    }

    @DeleteMapping("/{postId}")
    public DeletePostResponse deletePost(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long postId
    ) {
        String loginToken = authorizationHeader.replace("Bearer ", "");

        return postService.deletePost(loginToken, postId);
    }
}

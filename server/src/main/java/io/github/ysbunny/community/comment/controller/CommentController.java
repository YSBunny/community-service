package io.github.ysbunny.community.comment.controller;

import io.github.ysbunny.community.comment.dto.request.CreateCommentRequest;
import io.github.ysbunny.community.comment.dto.request.UpdateCommentRequest;
import io.github.ysbunny.community.comment.dto.response.CommentListResponse;
import io.github.ysbunny.community.comment.dto.response.CreateCommentResponse;
import io.github.ysbunny.community.comment.dto.response.DeleteCommentResponse;
import io.github.ysbunny.community.comment.dto.response.UpdateCommentResponse;
import io.github.ysbunny.community.comment.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public CreateCommentResponse createComment(
            Authentication authentication,
            @PathVariable Long postId,
            @Valid @RequestBody CreateCommentRequest request
    ) {
        String email = authentication.getName();

        return commentService.createComment(email, postId, request);
    }

    @GetMapping
    public CommentListResponse getCommentList(@PathVariable Long postId) {
        return commentService.getCommentList(postId);
    }

    @PatchMapping("/{commentId}")
    public UpdateCommentResponse updateComment(
            Authentication authentication,
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @Valid @RequestBody UpdateCommentRequest request
    ) {
        String email = authentication.getName();

        return  commentService.updateComment(email, postId, commentId, request);
    }

    @DeleteMapping("/{commentId}")
    public DeleteCommentResponse deleteComment(
            Authentication authentication,
            @PathVariable Long postId,
            @PathVariable Long commentId
    ) {
        String email = authentication.getName();

        return commentService.deleteComment(email, postId, commentId);
    }
}

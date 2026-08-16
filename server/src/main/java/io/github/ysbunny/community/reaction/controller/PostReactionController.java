package io.github.ysbunny.community.reaction.controller;

import io.github.ysbunny.community.reaction.dto.request.UpdateReactionRequest;
import io.github.ysbunny.community.reaction.dto.response.ReactionResponse;
import io.github.ysbunny.community.reaction.service.PostReactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/reaction")
@RequiredArgsConstructor
public class PostReactionController {

    private final PostReactionService postReactionService;

    @PutMapping
    public ReactionResponse setReaction(
            Authentication authentication,
            @PathVariable Long postId,
            @Valid @RequestBody UpdateReactionRequest request
    ) {
        String email = authentication.getName();

        return postReactionService.setReaction(email, postId, request.getType());
    }

    @DeleteMapping
    public ReactionResponse deleteReaction(
            Authentication authentication,
            @PathVariable Long postId
    ) {
        String email = authentication.getName();

        return postReactionService.deleteReaction(email, postId);
    }
}

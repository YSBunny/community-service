package io.github.ysbunny.community.reaction.service;

import io.github.ysbunny.community.post.domain.Post;
import io.github.ysbunny.community.post.repository.PostRepository;
import io.github.ysbunny.community.reaction.domain.ReactionType;
import io.github.ysbunny.community.reaction.dto.response.ReactionResponse;
import io.github.ysbunny.community.reaction.repository.PostReactionRepository;
import io.github.ysbunny.community.user.domain.User;
import io.github.ysbunny.community.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostReactionService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostReactionRepository postReactionRepository;

    @Transactional
    public ReactionResponse setReaction(
            String loginEmail,
            Long postId,
            ReactionType type
    ) {
        User user = getUser(loginEmail);
        Post post = getPost(postId);

        postReactionRepository.upsertReaction(post.getId(), user.getId(), type.name());

        return createResponse(postId, type);
    }

    @Transactional
    public ReactionResponse deleteReaction(String loginEmail, Long postId) {
        User user = getUser(loginEmail);
        getPost(postId);

        postReactionRepository.findByPostIdAndUserId(postId, user.getId())
                .ifPresent(postReactionRepository::delete);

        return createResponse(postId, null);
    }

    private User getUser(String loginEmail) {
        return userRepository.findByEmailAndDeletedAtIsNull(loginEmail)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));
    }

    private Post getPost(Long postId) {
        return postRepository.findByIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));
    }

    private ReactionResponse createResponse(
            Long postId,
            ReactionType myReaction
    ) {
        long likeCount = postReactionRepository.countByPostIdAndType(
                postId,
                ReactionType.LIKE
        );
        long dislikeCount = postReactionRepository.countByPostIdAndType(
                postId,
                ReactionType.DISLIKE
        );

        return new ReactionResponse(likeCount, dislikeCount, myReaction);
    }
}

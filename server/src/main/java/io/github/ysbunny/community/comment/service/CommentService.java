package io.github.ysbunny.community.comment.service;

import io.github.ysbunny.community.comment.dto.request.CreateCommentRequest;
import io.github.ysbunny.community.comment.dto.request.UpdateCommentRequest;
import io.github.ysbunny.community.comment.dto.response.*;
import io.github.ysbunny.community.comment.domain.Comment;
import io.github.ysbunny.community.post.domain.Post;
import io.github.ysbunny.community.user.domain.User;
import io.github.ysbunny.community.comment.repository.CommentRepository;
import io.github.ysbunny.community.post.repository.PostRepository;
import io.github.ysbunny.community.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Validated
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public CreateCommentResponse createComment(
            String loginEmail,
            Long postId,
            CreateCommentRequest request
    ) {
        User author = userRepository.findByEmailAndDeletedAtIsNull(loginEmail)
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        Post post = postRepository.findByIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new IllegalArgumentException("post does not exist"));

        Comment comment = new Comment(
                request.getComment(),
                author,
                post
        );

        Comment savedComment = commentRepository.save(comment);

        return new CreateCommentResponse(savedComment.getId());
    }

    public CommentListResponse getCommentList(Long postId) {
        postRepository.findByIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new IllegalArgumentException("post does not exist"));

        List<Comment> comments = commentRepository.findAllByPostIdAndDeletedAtIsNull(postId);

        List<CommentListItemResponse> commentListItemResponses = new ArrayList<>();

        for (Comment comment : comments) {
            Long commentId = comment.getId();
            String commentContent = comment.getComment();
            String authorNickname = comment.getAuthor().getNickname();
            String authorProfileImage = comment.getAuthor().getProfileImage();
            LocalDateTime createdAt = comment.getCreatedAt();

            CommentListItemResponse item = new CommentListItemResponse(
                    commentId,
                    commentContent,
                    authorNickname,
                    authorProfileImage,
                    createdAt
            );
            commentListItemResponses.add(item);
        }
        return new CommentListResponse(commentListItemResponses);
    }

    @Transactional
    public UpdateCommentResponse updateComment(
            String loginEmail,
            Long postId,
            Long commentId,
            UpdateCommentRequest request
    ) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(loginEmail)
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        postRepository.findByIdAndDeletedAtIsNull(postId).orElseThrow(() -> new IllegalArgumentException("post does not exist"));

        Comment comment = commentRepository.findByIdAndDeletedAtIsNull(commentId)
                .orElseThrow(() -> new IllegalArgumentException("comment does not exist"));

        if (user != comment.getAuthor()) {
            throw new IllegalArgumentException("unauthorized user");
        }

        comment.changeComment(request.getComment());

        return new UpdateCommentResponse(comment.getId());
    }

    @Transactional
    public DeleteCommentResponse deleteComment(String loginEmail, Long postId, Long commentId) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(loginEmail)
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        postRepository.findByIdAndDeletedAtIsNull(postId).orElseThrow(() -> new IllegalArgumentException("post does not exist"));

        Comment comment = commentRepository.findByIdAndDeletedAtIsNull(commentId)
                .orElseThrow(() -> new IllegalArgumentException("comment does not exist"));

        if (user != comment.getAuthor()) {
            throw new IllegalArgumentException("unauthorized user");
        }

        comment.delete();

        return new DeleteCommentResponse("delete_success");
    }
}

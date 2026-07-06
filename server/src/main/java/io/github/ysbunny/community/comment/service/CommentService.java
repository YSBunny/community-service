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
            String loginToken,
            Long postId,
            CreateCommentRequest request
    ) {
        User author = userRepository.findByLoginToken(loginToken)
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        Post post = postRepository.findById(postId)
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
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("post does not exist"));

        List<Comment> comments = post.getComments();

        List<CommentListItemResponse> commentListItemResponses = new ArrayList<>();

        for (Comment comment : comments) {
            Long commentId = comment.getId();
            String commentContent = comment.getComment();

            CommentListItemResponse item = new CommentListItemResponse(commentId, commentContent);
            commentListItemResponses.add(item);
        }
        return new CommentListResponse(commentListItemResponses);
    }

    @Transactional
    public UpdateCommentResponse updateComment(
            String loginToken,
            Long postId,
            Long commentId,
            UpdateCommentRequest request
    ) {
        User user = userRepository.findByLoginToken(loginToken)
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("post does not exist"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("comment does not exist"));

        if (user != comment.getAuthor()) {
            throw new IllegalArgumentException("unauthorized user");
        }

        comment.changeComment(request.getComment());

        return new UpdateCommentResponse(comment.getId());
    }

    @Transactional
    public DeleteCommentResponse deleteComment(String loginToken, Long postId, Long commentId) {
        User user = userRepository.findByLoginToken(loginToken)
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("post does not exist"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("comment does not exist"));

        if (user != comment.getAuthor()) {
            throw new IllegalArgumentException("unauthorized user");
        }

        commentRepository.deleteById(commentId);

        return new DeleteCommentResponse("delete_success");
    }
}

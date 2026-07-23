package io.github.ysbunny.community.post.service;

import io.github.ysbunny.community.comment.repository.CommentRepository;
import io.github.ysbunny.community.global.file.FileService;
import io.github.ysbunny.community.post.domain.Post;
import io.github.ysbunny.community.post.dto.request.CreatePostRequest;
import io.github.ysbunny.community.post.dto.request.UpdatePostRequest;
import io.github.ysbunny.community.post.dto.response.*;
import io.github.ysbunny.community.user.domain.User;
import io.github.ysbunny.community.post.repository.PostRepository;
import io.github.ysbunny.community.user.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Validated
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final FileService fileService;

    @Transactional
    public Long createPost(String loginEmail, CreatePostRequest request) {
        User author = userRepository.findByEmailAndDeletedAtIsNull(loginEmail)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        MultipartFile postImage = request.getPostImage();

        Post post = new Post(
                request.getTitle(),
                request.getContent(),
                fileService.saveImage(postImage, "posts"),
                author
        );

        Post savedPost = postRepository.save(post);

        return savedPost.getId();
    }

    public PostListResponse getPostList() {
        List<Post> posts = postRepository.findAllByDeletedAtIsNull();

        List<PostListItemResponse> postListItemResponses = new ArrayList<>();

        for (Post post : posts) {
            Long postId = post.getId();
            String postTitle = post.getTitle();
            String authorNickname = post.getAuthor().getNickname();
            String authorProfileImage = post.getAuthor().getProfileImage();
            Long commentCount = commentRepository.countByPostIdAndDeletedAtIsNull(postId);
            LocalDateTime createdAt = post.getCreatedAt();

            PostListItemResponse item = new PostListItemResponse(
                    postId,
                    postTitle,
                    authorNickname,
                    authorProfileImage,
                    commentCount,
                    createdAt
            );
            postListItemResponses.add(item);
        }
        return new PostListResponse(postListItemResponses);
    }

    public PostDetailResponse getPost(Long postId) {
        Post post = postRepository.findByIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        return new PostDetailResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getPostImage(),
                post.getAuthor().getId(),
                post.getAuthor().getNickname(),
                post.getAuthor().getProfileImage(),
                commentRepository.countByPostIdAndDeletedAtIsNull(postId),
                post.getCreatedAt()
        );
    }

    @Transactional
    public UpdatePostResponse updatePost(
            String loginEmail,
            @Positive Long postId,
            @Valid UpdatePostRequest request
    ) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(loginEmail)
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        Post post = postRepository.findByIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new IllegalArgumentException("post does not exist"));

        if (user != post.getAuthor()) {
            throw new IllegalArgumentException("unauthorized user");
        }

        post.changeTitle(request.getTitle());
        post.changeContent(request.getContent());

        if (request.getPostImage() != null) {
            post.changePostImage(fileService.saveImage(request.getPostImage(), "posts"));
        }

        return new UpdatePostResponse("update success");
    }

    @Transactional
    public DeletePostResponse deletePost(String loginEmail, Long postId) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(loginEmail)
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        Post post = postRepository.findByIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new IllegalArgumentException("post does not exist"));

        if (user != post.getAuthor()) {
            throw new IllegalArgumentException("unauthorized user");
        }

        post.delete();

        return new DeletePostResponse("delete_success");
    }
}

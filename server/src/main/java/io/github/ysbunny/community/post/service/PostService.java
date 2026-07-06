package io.github.ysbunny.community.post.service;

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

import java.util.ArrayList;
import java.util.List;

@Service
@Validated
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Transactional
    public Long createPost(String loginToken, CreatePostRequest request) {
        User author = userRepository.findByLoginToken(loginToken)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        Post post = new Post(
                request.getTitle(),
                request.getContent(),
                request.getPostImage(),
                author
        );

        Post savedPost = postRepository.save(post);

        return savedPost.getId();
    }

    public PostListResponse getPostList() {
        List<Post> posts = postRepository.findAll();

        List<PostListItemResponse> postListItemResponses = new ArrayList<>();

        for (Post post : posts) {
            Long postId = post.getId();
            String postTitle = post.getTitle();

            PostListItemResponse item = new PostListItemResponse(postId, postTitle);
            postListItemResponses.add(item);
        }
        return new PostListResponse(postListItemResponses);
    }

    public PostDetailResponse getPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        return new PostDetailResponse(
                post.getTitle(),
                post.getContent(),
                post.getPostImage()
        );
    }

    @Transactional
    public UpdatePostResponse updatePost(
            String loginToken,
            @Positive Long postId,
            @Valid UpdatePostRequest request
    ) {
        User user = userRepository.findByLoginToken(loginToken)
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("post does not exist"));

        if (user != post.getAuthor()) {
            throw new IllegalArgumentException("unauthorized user");
        }

        post.changeTitle(request.getTitle());
        post.changeContent(request.getContent());

        if (request.getPostImage() != null) {
            post.changePostImage(request.getPostImage());
        }

        return new UpdatePostResponse("update success");
    }

    @Transactional
    public DeletePostResponse deletePost(String loginToken, Long postId) {
        User user = userRepository.findByLoginToken(loginToken)
                .orElseThrow(() -> new IllegalArgumentException("unauthenticated user"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("post does not exist"));

        if (user != post.getAuthor()) {
            throw new IllegalArgumentException("unauthorized user");
        }

        postRepository.deleteById(postId);

        return new DeletePostResponse("delete_success");
    }
}

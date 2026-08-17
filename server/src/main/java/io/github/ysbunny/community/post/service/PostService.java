package io.github.ysbunny.community.post.service;

import io.github.ysbunny.community.comment.repository.CommentRepository;
import io.github.ysbunny.community.global.file.FileService;
import io.github.ysbunny.community.post.domain.Post;
import io.github.ysbunny.community.post.dto.request.CreatePostRequest;
import io.github.ysbunny.community.post.dto.request.UpdatePostRequest;
import io.github.ysbunny.community.post.dto.response.*;
import io.github.ysbunny.community.reaction.domain.PostReaction;
import io.github.ysbunny.community.reaction.domain.ReactionType;
import io.github.ysbunny.community.reaction.repository.PostReactionRepository;
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

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Validated
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PostReactionRepository postReactionRepository;
    private final FileService fileService;

    private static final int POPULAR_POST_LIMIT = 2;

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
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime twentyFourHoursAgo = now.minusHours(24);

        // 1. 전체 게시글을 최신순으로 가져온다.
        List<Post> allPosts = postRepository.findAllByDeletedAtIsNullOrderByCreatedAtDesc();

        // 2. 최근 24시간 게시글과 점수를 저장할 공간을 만든다.
        List<Post> recentPosts = new ArrayList<>();
        Map<Long, Double> popularityScores = new HashMap<>();

        // 3. 전체 게시글 중 최근 24시간 글만 골라 점수를 계산한다.
        for (Post post : allPosts) {
            boolean createdWithin24Hours = !post.getCreatedAt().isBefore(twentyFourHoursAgo);

            if (!createdWithin24Hours) {
                continue;
            }

            long likeCount = postReactionRepository.countByPostIdAndType(post.getId(), ReactionType.LIKE);

            double score = calculatePopularityScore(post, likeCount, now);

            recentPosts.add(post);
            popularityScores.put(post.getId(), score);
        }

        // 4. 인기 점수가 높은 순으로 정렬한다.
        recentPosts.sort((firstPost, secondPost) -> {
            double firstScore = popularityScores.get(firstPost.getId());
            double secondScore = popularityScores.get(secondPost.getId());

            int scoreComparison = Double.compare(secondScore, firstScore);

            // 점수가 다르면 점수가 높은 글을 앞으로 보낸다.
            if (scoreComparison != 0) {
                return scoreComparison;
            }

            // 점수가 같으면 최근 작성 글을 앞으로 보낸다.
            return secondPost.getCreatedAt().compareTo(firstPost.getCreatedAt());
        });

        // 5. 최대 2개까지만 인기글로 선정한다.
        int popularPostCount = Math.min(POPULAR_POST_LIMIT, recentPosts.size());

        List<PostListItemResponse> popularPosts = new ArrayList<>();

        Set<Long> popularPostIds = new HashSet<>();

        for (int index = 0; index < popularPostCount; index++) {
            Post popularPost = recentPosts.get(index);

            popularPosts.add(createListItem(popularPost));
            popularPostIds.add(popularPost.getId());
        }

        // 6. 인기글을 제외한 나머지를 일반 게시글로 만든다.
        List<PostListItemResponse> normalPosts = new ArrayList<>();

        for (Post post : allPosts) {
            if (popularPostIds.contains(post.getId())) {
                continue;
            }

            normalPosts.add(createListItem(post));
        }

        // 7. 인기글과 일반 게시글을 나누어 반환한다.
        return new PostListResponse(popularPosts, normalPosts);
    }

    @Transactional
    public PostDetailResponse getPost(String loginEmail, Long postId) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(loginEmail)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        int updatedCount = postRepository.incrementViewCount(postId);

        if (updatedCount == 0) {
            throw new IllegalArgumentException("post not found");
        }

        Post post = postRepository.findByIdAndDeletedAtIsNull(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        Optional<PostReaction> optionalPostReaction =
                postReactionRepository.findByPostIdAndUserId(post.getId(), user.getId());

        ReactionType myReaction;

        if (optionalPostReaction.isPresent()) {
            PostReaction postReaction = optionalPostReaction.get();

            myReaction = postReaction.getType();
        } else {
            myReaction = null;
        }

        return new PostDetailResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getPostImage(),
                post.getAuthor().getId(),
                post.getAuthor().getNickname(),
                post.getAuthor().getProfileImage(),
                commentRepository.countByPostIdAndDeletedAtIsNull(postId),
                postReactionRepository.countByPostIdAndType(postId, ReactionType.LIKE),
                postReactionRepository.countByPostIdAndType(postId, ReactionType.DISLIKE),
                myReaction,
                post.getViewCount(),
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

    private double calculatePopularityScore(Post post, long likeCount, LocalDateTime now) {
        long elapsedMinutes = Duration.between(post.getCreatedAt(), now).toMinutes();

        // 작성 직후에는 0으로 나누지 않도록 최소 60분으로 처리
        elapsedMinutes = Math.max(elapsedMinutes, 60);

        double elapsedDays = elapsedMinutes / 1440.0;

        double activityScore = (likeCount * 2.0) + post.getViewCount();

        return activityScore / elapsedDays;
    }

    private PostListItemResponse createListItem(Post post) {
        Long postId = post.getId();

        return new PostListItemResponse(
                postId,
                post.getTitle(),
                post.getAuthor().getNickname(),
                post.getAuthor().getProfileImage(),
                commentRepository.countByPostIdAndDeletedAtIsNull(postId),
                post.getViewCount(),
                post.getCreatedAt()
        );
    }
}

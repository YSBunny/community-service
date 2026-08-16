package io.github.ysbunny.community.post.dto.response;

import io.github.ysbunny.community.reaction.domain.ReactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PostDetailResponse {
    private Long postId;
    private String title;
    private String content;
    private String postImage;

    private Long authorId;
    private String authorNickname;
    private String authorProfileImage;

    private Long commentCount;
    private long likeCount;
    private long dislikeCount;
    private ReactionType myReaction;

    private LocalDateTime createdAt;
}

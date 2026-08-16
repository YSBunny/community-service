package io.github.ysbunny.community.reaction.dto.response;

import io.github.ysbunny.community.reaction.domain.ReactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReactionResponse {
    private long likeCount;
    private long dislikeCount;
    private ReactionType myReaction;
}

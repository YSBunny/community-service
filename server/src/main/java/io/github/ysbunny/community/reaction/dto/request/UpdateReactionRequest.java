package io.github.ysbunny.community.reaction.dto.request;

import io.github.ysbunny.community.reaction.domain.ReactionType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class UpdateReactionRequest {

    @NotNull
    private ReactionType type;
}

package io.github.ysbunny.community.reaction.repository;

import io.github.ysbunny.community.reaction.domain.PostReaction;
import io.github.ysbunny.community.reaction.domain.ReactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostReactionRepository extends JpaRepository<PostReaction, Long> {

    Optional<PostReaction> findByPostIdAndUserId(Long postId, Long userId);

    long countByPostIdAndType(Long postId, ReactionType type);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = """
        INSERT INTO PostReactions (
            post_id,
            user_id,
            reaction_type,
            created_at,
            updated_at
        )
        VALUES (
            :postId,
            :userId,
            :reactionType,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
        ON DUPLICATE KEY UPDATE
            reaction_type = VALUES(reaction_type),
            updated_at = CURRENT_TIMESTAMP
        """, nativeQuery = true)
    int upsertReaction(
            @Param("postId") Long postId,
            @Param("userId") Long userId,
            @Param("reactionType") String reactionType
    );
}

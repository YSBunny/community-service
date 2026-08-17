package io.github.ysbunny.community.post.repository;

import io.github.ysbunny.community.post.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findByIdAndDeletedAtIsNull(Long id);
    List<Post> findAllByDeletedAtIsNullOrderByCreatedAtDesc();

    @Modifying(clearAutomatically = true)
    @Query("""
    update Post p
       set p.viewCount = p.viewCount + 1
     where p.id = :postId
       and p.deletedAt is null
    """)
    int incrementViewCount(@Param("postId") Long postId);
}

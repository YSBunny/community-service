package io.github.ysbunny.community.post.repository;

import io.github.ysbunny.community.post.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findByIdAndDeletedAtIsNull(Long id);
}

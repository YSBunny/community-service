package io.github.ysbunny.community.comment.repository;

import io.github.ysbunny.community.comment.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Optional<Comment> findByIdAndDeletedAtIsNull(Long Id);
    Long countByPostIdAndDeletedAtIsNull(Long postId);
    List<Comment> findAllByPostIdAndDeletedAtIsNull(Long postId);
}

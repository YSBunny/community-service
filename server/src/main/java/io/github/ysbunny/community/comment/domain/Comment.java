package io.github.ysbunny.community.comment.domain;

import io.github.ysbunny.community.post.domain.Post;
import io.github.ysbunny.community.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Entity @Table(name = "Comments")
@Getter @RequiredArgsConstructor
public class Comment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;

    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    public Comment(String comment, User author, Post post) {
        this.comment = comment;
        this.author = author;
        this.post = post;
    }

    public void changeComment(String comment) {
        this.comment = comment;
    }
}

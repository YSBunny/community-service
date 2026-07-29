import { Link } from "react-router";

import defaultProfileImage from "../assets/images/defaultProfile.png";
import "../styles/PostListPage.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function getProfileImageUrl(filename) {
  if (!filename) {
    return defaultProfileImage;
  }

  return `${SERVER_URL}/uploads/profiles/${encodeURIComponent(filename)}`;
}

function PostCard({ post }) {
  function handleImageError(event) {
    const image = event.currentTarget;

    // 기본 이미지까지 실패했을 때 무한 반복 방지
    if (image.dataset.fallbackApplied === "true") {
      return;
    }

    image.dataset.fallbackApplied = "true";
    image.src = defaultProfileImage;
  }

  return (
    <Link
      to={`/posts/${post.postId}`}
      className="post-card__link"
    >
      <article className="post-card">
        <div className="post-card__content">
          <div className="post-card__top">
            <div>
              <h2 className="post-card__title">
                {post.title}
              </h2>

              <div className="post-card__meta">
                <span>
                  댓글수 {post.commentCount ?? 0}
                </span>
              </div>
            </div>

            <time
              className="post-card__date"
              dateTime={post.createdAt}
            >
              {post.createdAt}
            </time>
          </div>
        </div>

        <div className="post-card__author">
          <img
            className="author-profile"
            src={getProfileImageUrl(
              post.authorProfileImage
            )}
            alt={`${post.authorNickname}의 프로필 이미지`}
            onError={handleImageError}
          />

          <span className="author-name">
            {post.authorNickname}
          </span>
        </div>
      </article>
    </Link>
  );
}

export default PostCard;

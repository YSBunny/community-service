import { Link } from "react-router";

import { formatDate } from "../utils/formatDate.js";
import { getProfileImageUrl, useDefaultProfileImage } from "../utils/imageUrl.js";
import "../styles/PostListPage.css";

function PostCard({ post }) {
  return (
    <Link to={`/posts/${post.postId}`} className="post-card__link">
      <article className="post-card">
        <div className="post-card__content">
          <div className="post-card__top">
            <div>
              <h2 className="post-card__title">{post.title}</h2>
              <div className="post-card__meta">
                <span>댓글수 {post.commentCount ?? 0}</span>
                <span>조회수 {post.viewCount ?? 0}</span>
              </div>
            </div>

            <time className="post-card__date" dateTime={post.createdAt}>
              {formatDate(post.createdAt)}
            </time>
          </div>
        </div>

        <div className="post-card__author">
          <img
            className="author-profile"
            src={getProfileImageUrl(post.authorProfileImage)}
            alt={`${post.authorNickname}의 프로필`}
            onError={useDefaultProfileImage}
          />
          <span className="author-name">{post.authorNickname}</span>
        </div>
      </article>
    </Link>
  );
}

export default PostCard;

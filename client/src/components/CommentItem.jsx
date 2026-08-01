import { formatDate } from "../utils/formatDate.js";
import { getProfileImageUrl, useDefaultProfileImage } from "../utils/imageUrl.js";

function CommentItem({ comment, currentUserId, onEdit, onDelete }) {
  const authorId = comment.authorId || comment.userId;
  const isMyComment = String(authorId) === String(currentUserId);

  return (
    <li className="comment-item">
      <div className="comment-item__author">
        <img
          src={getProfileImageUrl(comment.authorProfileImage)}
          alt={`${comment.authorNickname}의 프로필`}
          className="author-profile"
          onError={useDefaultProfileImage}
        />

        <div>
          <strong className="author-name">{comment.authorNickname}</strong>
          <time className="comment-item__date" dateTime={comment.createdAt}>
            {formatDate(comment.createdAt)}
          </time>
        </div>
      </div>

      <p className="comment-item__content">{comment.commentContent}</p>

      {isMyComment && (
        <div className="comment-item__actions">
          <button type="button" onClick={() => onEdit(comment)}>
            수정
          </button>
          <button type="button" onClick={() => onDelete(comment.commentId)}>
            삭제
          </button>
        </div>
      )}
    </li>
  );
}

export default CommentItem;

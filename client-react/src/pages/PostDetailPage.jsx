import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { createComment, deleteComment, getComments, updateComment } from "../api/commentApi.js";
import { deletePost, getPost } from "../api/postApi.js";
import CommentItem from "../components/CommentItem.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import Header from "../components/Header.jsx";
import { formatDate } from "../utils/formatDate.js";
import { getPostImageUrl, getProfileImageUrl, useDefaultProfileImage } from "../utils/imageUrl.js";
import "../styles/PostDetailPage.css";

function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadPage() {
      try {
        const [postResponse, commentResponse] = await Promise.all([
          getPost(postId),
          getComments(postId)
        ]);

        const loadedPost = postResponse?.post || postResponse;
        const loadedComments = commentResponse?.comments || commentResponse;

        if (!loadedPost?.postId || !Array.isArray(loadedComments)) {
          throw new Error("게시글 상세 응답을 확인해주세요.");
        }

        if (!isCancelled) {
          setPost(loadedPost);
          setComments(loadedComments);
        }
      } catch (error) {
        if (!isCancelled) {
          setLoadError(error.message || "게시글을 불러오지 못했습니다.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPage();
    return () => { isCancelled = true; };
  }, [postId]);

  async function reloadComments() {
    const response = await getComments(postId);
    const loadedComments = response?.comments || response;

    if (!Array.isArray(loadedComments)) {
      throw new Error("댓글 목록 응답을 확인해주세요.");
    }

    setComments(loadedComments);
  }

  function startCommentEdit(comment) {
    setEditingCommentId(comment.commentId);
    setCommentText(comment.commentContent);
    setActionError("");
  }

  function cancelCommentEdit() {
    setEditingCommentId(null);
    setCommentText("");
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();
    const content = commentText.trim();

    if (!content || isCommentSubmitting) {
      return;
    }

    try {
      setIsCommentSubmitting(true);
      setActionError("");

      if (editingCommentId) {
        await updateComment(postId, editingCommentId, content);
      } else {
        await createComment(postId, content);
      }

      await reloadComments();
      setCommentText("");
      setEditingCommentId(null);
    } catch (error) {
      setActionError(error.message || "댓글을 저장하지 못했습니다.");
    } finally {
      setIsCommentSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) {
      return;
    }

    try {
      setIsDeleting(true);
      setActionError("");

      if (deleteTarget.type === "post") {
        await deletePost(postId);
        navigate("/posts", { replace: true });
        return;
      }

      await deleteComment(postId, deleteTarget.id);
      await reloadComments();
      setDeleteTarget(null);
    } catch (error) {
      setActionError(error.message || "삭제에 실패했습니다.");
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <><Header showBackButton /><main className="main"><p className="page-status">게시글을 불러오는 중입니다...</p></main></>;
  }

  if (loadError || !post) {
    return <><Header showBackButton /><main className="main"><p className="page-error">{loadError}</p></main></>;
  }

  const postAuthorId = post.authorId || post.userId;
  const isMyPost = String(postAuthorId) === String(currentUserId);

  return (
    <>
      <Header showBackButton showProfileMenu />

      <main className="main post-detail-main">
        <article className="post-detail">
          <header className="post-detail__header">
            <div className="post-detail__heading">
              <h1 className="post-detail__title">{post.title}</h1>
              {isMyPost && (
                <div className="post-detail__actions">
                  <Link to={`/posts/${postId}/edit`} className="post-action-button">수정</Link>
                  <button type="button" className="post-action-button post-action-button--danger"
                    onClick={() => setDeleteTarget({ type: "post", id: postId })}>
                    삭제
                  </button>
                </div>
              )}
            </div>

            <div className="post-detail__author">
              <img src={getProfileImageUrl(post.authorProfileImage)}
                alt={`${post.authorNickname}의 프로필`} className="author-profile"
                onError={useDefaultProfileImage} />
              <span className="author-name">{post.authorNickname}</span>
              <time className="post-detail__date" dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </div>
          </header>

          <div className="post-detail__body">
            {post.postImage && (
              <img src={getPostImageUrl(post.postImage)} alt={`${post.title} 첨부`}
                className="post-detail__image" onError={(event) => { event.currentTarget.hidden = true; }} />
            )}
            <p className="post-detail__content">{post.content}</p>
          </div>
        </article>

        <section className="comment-section">
          <div className="comment-section__heading">
            <h2>댓글</h2><span>{comments.length}</span>
          </div>

          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea placeholder="댓글을 입력하세요" value={commentText}
              onChange={(event) => setCommentText(event.target.value)} />
            <div className="comment-form__actions">
              {editingCommentId && (
                <button type="button" className="comment-cancel-button" onClick={cancelCommentEdit}>
                  수정 취소
                </button>
              )}
              <button type="submit" className="comment-submit-button"
                disabled={!commentText.trim() || isCommentSubmitting}>
                {isCommentSubmitting ? "처리 중..." : editingCommentId ? "댓글 수정" : "댓글 등록"}
              </button>
            </div>
          </form>

          {actionError && <p className="action-error" role="alert">{actionError}</p>}

          {comments.length === 0 ? (
            <p className="comment-empty">아직 작성된 댓글이 없습니다.</p>
          ) : (
            <ul className="comment-list">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.commentId}
                  comment={comment}
                  currentUserId={currentUserId}
                  onEdit={startCommentEdit}
                  onDelete={(commentId) => setDeleteTarget({ type: "comment", id: commentId })}
                />
              ))}
            </ul>
          )}
        </section>
      </main>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title={deleteTarget?.type === "post" ? "게시글을 삭제할까요?" : "댓글을 삭제할까요?"}
        message="삭제된 내용은 복구할 수 없습니다."
        confirmText="삭제"
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}

export default PostDetailPage;

import { useEffect, useState} from "react";
import { Link, useNavigate, useParams} from "react-router";

import { deletePost, getPost} from "../api/postApi.js";
import { createComment, deleteComment, getComments, updateComment} from "../api/commentApi.js";

import ConfirmModal from "../components/ConfirmModal.jsx";
import Header from "../components/Header.jsx";

import defaultProfileImage from "../assets/images/defaultProfile.png";
import "../styles/PostDetailPage.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function getProfileImageUrl(filename) {
  if (!filename) {
    return defaultProfileImage;
  }

  return `${SERVER_URL}/uploads/profiles/${encodeURIComponent(filename)}`;
}

function getPostImageUrl(filename) {
  if (!filename) {
    return "";
  }

  return `${SERVER_URL}/uploads/posts/${encodeURIComponent(filename)}`;
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "ko-KR",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(new Date(dateString));
}

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
    const controller = new AbortController();

    let ignore = false;

    async function loadPage() {
      try {
        setIsLoading(true);
        setLoadError("");

        const [postResponse, commentResponse] = await Promise.all([
          getPost(postId, {
            signal: controller.signal
          }),
          getComments(postId, {
            signal: controller.signal
          })
        ]);

        const loadedPost = postResponse?.post ?? postResponse;

        const loadedComments = commentResponse?.comments ?? commentResponse;

        if (!loadedPost?.postId) {
          throw new Error("게시글 응답 형식이 올바르지 않습니다.");
        }

        if (!Array.isArray(loadedComments)) {
          throw new Error("댓글 목록 응답 형식이 올바르지 않습니다.");
        }

        if (!ignore) {
          setPost(loadedPost);
          setComments(loadedComments);
        }
      } catch (error) {
        if (error.name !== "AbortError" && !ignore) {
          console.error("게시글 상세 조회 실패:", error);

          setLoadError(error.message || "게시글을 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadPage();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [postId]);

  const isPostAuthor = post !== null && String(post.authorId) === String(currentUserId);

  async function reloadComments() {
    const responseData = await getComments(postId);

    const loadedComments = responseData?.comments ?? responseData;

    if (!Array.isArray(loadedComments)) {
      throw new Error("댓글 목록 응답 형식이 올바르지 않습니다.");
    }

    setComments(loadedComments);

    setPost((previousPost) => {
      if (!previousPost) {
        return previousPost;
      }

      return {
        ...previousPost,
        commentCount: loadedComments.length
      };
    });
  }

  function handleProfileImageError(event) {
    const image = event.currentTarget;

    if (image.dataset.fallbackApplied === "true") {
      return;
    }

    image.dataset.fallbackApplied = "true";

    image.src = defaultProfileImage;
  }

  function handlePostImageError(event) {
    event.currentTarget.hidden = true;
  }

  function handleCommentChange(event) {
    setCommentText(event.target.value);
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

    const trimmedContent = commentText.trim();

    if (trimmedContent === "" || isCommentSubmitting) {
      return;
    }

    try {
      setIsCommentSubmitting(true);
      setActionError("");

      if (editingCommentId !== null) {
        await updateComment(postId, editingCommentId, { comment: trimmedContent });
      } else {
        await createComment(postId, { comment: trimmedContent });
      }

      await reloadComments();

      setCommentText("");
      setEditingCommentId(null);
    } catch (error) {
      console.error("댓글 저장 실패:", error);

      setActionError(error.message || "댓글을 저장하지 못했습니다.");
    } finally {
      setIsCommentSubmitting(false);
    }
  }

  function openPostDeleteModal() {
    setDeleteTarget({
      type: "post",
      id: postId
    });

    setActionError("");
  }

  function openCommentDeleteModal(commentId) {
    setDeleteTarget({
      type: "comment",
      id: commentId
    });

    setActionError("");
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      setActionError("");

      if (deleteTarget.type === "post") {
        await deletePost(deleteTarget.id);

        navigate("/posts", {
          replace: true
        });

        return;
      }

      await deleteComment(postId, deleteTarget.id);

      await reloadComments();
      setDeleteTarget(null);
    } catch (error) {
      console.error("삭제 실패:", error);

      setActionError(error.message || "삭제에 실패했습니다.");

      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <>
        <Header showBackButton />

        <main className="main">
          <p className="page-status">
            게시글을 불러오는 중입니다...
          </p>
        </main>
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <Header showBackButton />

        <main className="main">
          <p className="page-error" role="alert">
            {loadError}
          </p>
        </main>
      </>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <Header showBackButton />

      <main className="main post-detail-main">
        <article className="post-detail">
          <header className="post-detail__header">
            <div className="post-detail__heading">
              <h1 className="post-detail__title">
                {post.title}
              </h1>

              {isPostAuthor && (
                <div className="post-detail__actions">
                  <Link
                    to={`/posts/${postId}/edit`}
                    className="post-action-button"
                  >
                    수정
                  </Link>

                  <button
                    type="button"
                    className="post-action-button post-action-button--danger"
                    onClick={openPostDeleteModal}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

            <div className="post-detail__author">
              <img
                src={getProfileImageUrl(post.authorProfileImage)}
                alt={`${post.authorNickname}의 프로필 이미지`}
                className="author-profile"
                onError={handleProfileImageError}
              />

              <span className="author-name">
                {post.authorNickname}
              </span>

              <time className="post-detail__date" dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </div>
          </header>

          <div className="post-detail__body">
            {post.postImage && (
              <img
                src={getPostImageUrl(post.postImage)}
                alt={`${post.title} 첨부 이미지`}
                className="post-detail__image"
                onError={handlePostImageError}
              />
            )}

            <p className="post-detail__content">
              {post.content}
            </p>
          </div>
        </article>

        <section className="comment-section" aria-labelledby="comment-section-title">
          <div className="comment-section__heading">
            <h2 id="comment-section-title">
              댓글
            </h2>

            <span>
              {comments.length}
            </span>
          </div>

          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              id="commentInput"
              name="comment"
              placeholder="댓글을 입력하세요"
              value={commentText}
              onChange={handleCommentChange}
            />

            <div className="comment-form__actions">
              {editingCommentId !== null && (
                <button
                  type="button"
                  className="comment-cancel-button"
                  onClick={cancelCommentEdit}
                >
                  수정 취소
                </button>
              )}

              <button
                type="submit"
                className="comment-submit-button"
                disabled={commentText.trim() === "" || isCommentSubmitting}
              >
                {isCommentSubmitting ? "처리 중..." : editingCommentId
                    !== null ? "댓글 수정" : "댓글 등록"}
              </button>
            </div>
          </form>

          {actionError && (
            <p className="action-error" role="alert">
              {actionError}
            </p>
          )}

          {comments.length === 0 ? (
            <p className="comment-empty">
              아직 작성된 댓글이 없습니다.
            </p>
          ) : (
            <ul className="comment-list">
              {comments.map((comment) => {
                  const isCommentAuthor = String(comment.authorId) === String(currentUserId);

                  return (
                    <li key={comment.commentId} className="comment-item">
                      <div className="comment-item__author">
                        <img src={getProfileImageUrl(comment.authorProfileImage)}
                          alt={`${comment.authorNickname}의 프로필 이미지`}
                          className="author-profile"
                          onError={handleProfileImageError}
                        />

                        <div>
                          <strong className="author-name">
                            {comment.authorNickname}
                          </strong>

                          <time className="comment-item__date" dateTime={comment.createdAt}>
                            {formatDate(comment.createdAt)}
                          </time>
                        </div>
                      </div>

                      <p className="comment-item__content">
                        {comment.commentContent}
                      </p>

                      {isCommentAuthor && (
                        <div className="comment-item__actions">
                          <button type="button" onClick={() => startCommentEdit(comment)}>
                            수정
                          </button>

                          <button type="button"
                            onClick={() => openCommentDeleteModal(comment.commentId)}>
                            삭제
                          </button>
                        </div>
                      )}
                    </li>
                  );
                }
              )}
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
        onClose={closeDeleteModal}
      />
    </>
  );
}

export default PostDetailPage;

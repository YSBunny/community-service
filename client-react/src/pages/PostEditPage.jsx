import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { getPost, updatePost } from "../api/postApi.js";
import Header from "../components/Header.jsx";
import PostForm from "../components/PostForm.jsx";
import "../styles/PostFormPage.css";

function PostEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadPost() {
      try {
        const response = await getPost(postId);
        const loadedPost = response?.post || response;

        if (!loadedPost?.postId) {
          throw new Error("게시글 응답을 확인해주세요.");
        }

        if (!isCancelled) {
          setPost(loadedPost);
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

    loadPost();
    return () => { isCancelled = true; };
  }, [postId]);

  async function handleUpdate(postData) {
    try {
      setIsSubmitting(true);
      setSubmitError("");
      await updatePost(postId, postData);
      navigate(`/posts/${postId}`, { replace: true });
    } catch (error) {
      setSubmitError(error.message || "게시글 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header showBackButton />
      <main className="main post-form-main">
        <section className="post-form-section">
          <h1 className="page-title">게시글 수정</h1>
          {isLoading && <p className="page-status">게시글을 불러오는 중입니다...</p>}
          {!isLoading && loadError && <p className="page-error">{loadError}</p>}
          {!isLoading && post && (
            <PostForm
              initialTitle={post.title}
              initialContent={post.content}
              existingImageName={post.postImage || ""}
              submitLabel="수정 완료"
              isSubmitting={isSubmitting}
              submitError={submitError}
              onSubmit={handleUpdate}
            />
          )}
        </section>
      </main>
    </>
  );
}

export default PostEditPage;

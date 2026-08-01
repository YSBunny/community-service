import { useState } from "react";
import { useNavigate } from "react-router";

import { createPost } from "../api/postApi.js";
import Header from "../components/Header.jsx";
import PostForm from "../components/PostForm.jsx";
import "../styles/PostFormPage.css";

function PostCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleCreate(postData) {
    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await createPost(postData);
      const postId = response?.postId || response?.post?.postId;

      navigate(postId ? `/posts/${postId}` : "/posts", { replace: true });
    } catch (error) {
      setSubmitError(error.message || "게시글 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header showBackButton />
      <main className="main post-form-main">
        <section className="post-form-section">
          <h1 className="page-title">게시글 작성</h1>
          <p className="page-description">최애에 관한 이야기를 들려주세요.</p>
          <PostForm
            submitLabel="작성 완료"
            isSubmitting={isSubmitting}
            submitError={submitError}
            onSubmit={handleCreate}
          />
        </section>
      </main>
    </>
  );
}

export default PostCreatePage;

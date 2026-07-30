import { useState } from "react";
import { useNavigate } from "react-router";

import { createPost } from "../api/postApi.js";
import Header from "../components/Header.jsx";
import PostForm from "../components/PostForm.jsx";
import "../styles/PostFormPage.css";

function PostCreatePage() {
  const navigate = useNavigate();

  async function handleCreate(postData) {
    try {
      const responseData = await createPost(postData);

      const createdPostId = responseData?.postId;

      if (createdPostId) {
        navigate(`/posts/${createdPostId}`,
          { replace: true }
        );

        return;
      }

      navigate("/posts", {
        replace: true
      });
    } catch (error) {
      console.log("게시글 작성 실패:", error);
    }
  }

  return (
    <>
      <Header showBackButton />

      <main className="main post-form-main">
        <section className="post-form-section">
          <h1 className="page-title">
            게시글 작성
          </h1>

          <p className="page-description">
            최애에 관한 이야기를 들려주세요.
          </p>

          <PostForm
            submitLabel="작성 완료"
            onSubmit={handleCreate}
          />
        </section>
      </main>
    </>
  );
}

export default PostCreatePage;

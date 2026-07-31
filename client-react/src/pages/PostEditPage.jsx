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
    const controller =
      new AbortController();

    let ignore = false;

    async function loadPost() {
      try {
        setIsLoading(true);
        setLoadError("");

        const responseData = await getPost(postId, {
            signal: controller.signal
          });

        const loadedPost = responseData?.post ?? responseData;

        if (!loadedPost?.postId) {
          throw new Error("게시글 응답 형식이 올바르지 않습니다.");
        }

        if (!ignore) {
          setPost(loadedPost);
        }
      } catch (error) {
        if (error.name !== "AbortError" && !ignore) {
          console.error("게시글 조회 실패:", error);

          setLoadError(error.message || "게시글을 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadPost();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [postId]);

  async function handleUpdate(postData) {
    try {
      setIsSubmitting(true);
      setSubmitError("");

      await updatePost(postId, postData);

      navigate(`/posts/${postId}`, {
        replace: true
      });
    } catch (error) {
      console.error( "게시글 수정 실패:", error);

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
          <h1 className="page-title">
            게시글 수정
          </h1>

          {isLoading ? (
            <p className="page-status">
              게시글을 불러오는 중입니다...
            </p>
          ) : loadError ? (
            <p className="page-error" role="alert">
              {loadError}
            </p>
          ) : post ? (
            <PostForm
              key={post.postId}
              initialValues={{
                title: post.title,
                content: post.content
              }}
              existingImageName={
                post.postImage ?? ""
              }
              submitLabel="수정 완료"
              onSubmit={handleUpdate}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          ) : null}
        </section>
      </main>
    </>
  );
}

export default PostEditPage;

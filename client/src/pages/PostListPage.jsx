import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getPosts } from "../api/postApi.js";
import Header from "../components/Header.jsx";
import PostCard from "../components/PostCard.jsx";
import "../styles/PostListPage.css";

function PostListPage() {
  const [popularPosts, setPopularPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadPosts() {
      try {
        const response = await getPosts();

        const popularPostList = response?.popularPosts ?? [];
        const normalPostList = response?.posts ?? [];

        if (!Array.isArray(popularPostList) || !Array.isArray(normalPostList)) {
          throw new Error("게시글 목록 응답을 확인해주세요.");
        }

        if (!isCancelled) {
          setPopularPosts(popularPostList);
          setPosts(normalPostList);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message || "게시글을 불러오지 못했습니다.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      <Header showProfileMenu />

      <main className="main post-list-main">
        <section className="intro-section">
          <p>좋아하는 마음이 모이는 곳,<br />냐르륵 <strong>팬 라운지</strong>입니다.</p>
        </section>

        <section className="board-section">
          <div className="board-toolbar">
            <Link to="/posts/new" className="write-button">글쓰기</Link>
          </div>

          {isLoading && <p className="page-status">게시글을 불러오는 중입니다...</p>}
          {!isLoading && error && <p className="page-error" role="alert">{error}</p>}
          {!isLoading && !error && popularPosts.length === 0 && posts.length === 0 && (
            <p className="page-status">
              아직 작성된 게시글이 없습니다.
            </p>
          )}
          {!isLoading && !error && popularPosts.length > 0 && (
            <section className="popular-post-section" aria-labelledby="popular-post-title">
              <h2 id="popular-post-title" className="popular-post-section__title">
                실시간 인기글
              </h2>

              <ul className="post-list popular-post-list">
                {popularPosts.map((post) => (
                  <li key={post.postId} className="post-list__item">
                    <PostCard post={post} isPopular />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {!isLoading && !error && posts.length > 0 && (
            <section className="normal-post-section" aria-labelledby="normal-post-title">
              <h2 id="normal-post-title" className="normal-post-section__title">
                전체 게시글
              </h2>

              <ul className="post-list">
                {posts.map((post) => (
                  <li key={post.postId} className="post-list__item">
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
      </main>
    </>
  );
}

export default PostListPage;

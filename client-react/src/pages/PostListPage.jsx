import { useEffect, useState } from "react";
import { Link } from "react-router";

import Header from "../components/Header.jsx";
import PostCard from "../components/PostCard.jsx";
import "../styles/PostListPage.css";
import { getPosts } from "../api/postApi.js";

function PostListPage() {
  // 게시글 목록
  const [posts, setPosts] = useState([]);

  // 게시글 제목 리스트
  const titles = posts.map((post) => post.title);

  // 게시글 목록 불러오기
  useEffect(() => {
    async function loadPosts() {
      try {
        const responseData = await getPosts();
        setPosts(responseData.posts);
      } catch (error) {
        console.error("게시글 목록 조회 실패:", error);
      }
    } 

    loadPosts();
  }, []);

  return (
    <>
      <Header />

      <main className="main">
        <section className="intro-section">
          <p>
            좋아하는 마음이 모이는 곳,<br />
            냐르륵 <strong>팬 라운지</strong>입니다.
          </p>
        </section>

        <section className="board-section">
          <div className="board-toolbar">
            <button type="button" className="write-button" id="writePostButton">
              게시글 작성
            </button>
          </div>

          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.postId} className="post-list__item">
                {/* key는 map()이 바로 반환하는 가장 바깥 요소에 작성 */}
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

export default PostListPage;

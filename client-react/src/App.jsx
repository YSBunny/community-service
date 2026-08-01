import { Navigate, Outlet, Route, Routes } from "react-router";

import LoginPage from "./pages/LoginPage.jsx";
import PasswordEditPage from "./pages/PasswordEditPage.jsx";
import PostCreatePage from "./pages/PostCreatePage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import PostEditPage from "./pages/PostEditPage.jsx";
import PostListPage from "./pages/PostListPage.jsx";
import ProfileEditPage from "./pages/ProfileEditPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

import "./App.css";

function hasCompleteLoginInformation() {
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  return Boolean(accessToken && userId);
}

// accessToken과 userId가 모두 있는 사용자에게만 자식 Route를 보여줌
function ProtectedRoute() {
  if (!hasCompleteLoginInformation()) {
    // 둘 중 하나만 남아 있는 불완전한 로그인 정보도 함께 정리한다.
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  const isLoggedIn = hasCompleteLoginInformation();

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/posts" : "/login"} replace />}
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/new" element={<PostCreatePage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/posts/:postId/edit" element={<PostEditPage />} />
          <Route path="/users/:userId/edit" element={<ProfileEditPage />} />
          <Route path="/users/:userId/password" element={<PasswordEditPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

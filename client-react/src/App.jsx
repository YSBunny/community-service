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

// 로그인한 사용자만 자식 Route를 보여주는 컴포넌트
function ProtectedRoute() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  const accessToken = localStorage.getItem("accessToken");

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={<Navigate to={accessToken ? "/posts" : "/login"} replace />}
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

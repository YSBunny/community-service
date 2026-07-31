import { Navigate, Route, Routes } from "react-router";

import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import PostListPage from "./pages/PostListPage.jsx";
import PostEditPage from "./pages/PostEditPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import ProfileEditPage from "./pages/ProfileEditPage.jsx";

import "./App.css";
import PostCreatePage from "./pages/PostCreatePage.jsx";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/posts" replace />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />

        <Route
          path="/users/:userId/edit"
          element={<ProfileEditPage />}
        />
        
        <Route
          path="/posts"
          element={<PostListPage />}
        />

        <Route
          path="/posts/new"
          element={<PostCreatePage />}
        />

        <Route
          path="/posts/:postId"
          element={<PostDetailPage />}
        />

        <Route
          path="/posts/:postId/edit"
          element={<PostEditPage />}
        />
      </Routes>
    </div>
  );
}

export default App;

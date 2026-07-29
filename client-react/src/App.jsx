import { Navigate, Route, Routes } from "react-router";

import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import PostListPage from "./pages/PostListPage.jsx"

import "./App.css";

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
          path="/posts"
          element={<PostListPage />}
        />
      </Routes>
    </div>
  );
}

export default App;

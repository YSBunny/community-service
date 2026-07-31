import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../api/authApi.js";

import Header from "../components/Header.jsx";
import "../styles/LoginPage.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const trimmedEmail = email.trim();
  const isEmailValid = EMAIL_PATTERN.test(trimmedEmail);

  const isFormValid = isEmailValid && password !== "";

  let emailHelperText = "";
  let passwordHelperText = "";

  if (touched.email) {
    if (trimmedEmail === "") {
      emailHelperText = "* 이메일을 입력해주세요.";
    } else if (!isEmailValid) {
      emailHelperText = "* 올바른 이메일 형식을 입력해주세요.";
    }
  }

  if (touched.password && password === "") {
    passwordHelperText = "* 비밀번호를 입력해주세요.";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setTouched({
      email: true,
      password: true
    });

    if (!isFormValid || isSubmitting) {
      return;
    }

    const loginData = {
      email: trimmedEmail,
      password
    };

    try {
      setIsSubmitting(true);
      setServerError("");

      const responseData = await login(loginData);

      if (!responseData?.userId || !responseData?.token) {
        throw new Error("로그인 응답에 사용자 정보가 없습니다.");
      }

      localStorage.setItem("userId", String(responseData.userId));
      localStorage.setItem("accessToken", responseData.token);

      navigate("/posts", {
        replace: true
      });
    } catch (error) {
      setServerError(error.message || "로그인에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />

      <main className="main login-main">
        <section className="login-section">
          <h2 className="page-title">로그인</h2>

          <p className="auth-description">
            최애 이야기가 시작되는 팬 라운지에 입장하세요.
          </p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-fields">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  이메일
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  autoComplete="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setServerError("");
                  }}
                  onBlur={() => {
                    setTouched((previousTouched) => ({
                      ...previousTouched,
                      email: true
                    }));
                  }}
                />

                <p className="helper-text" id="emailHelperText">
                  {emailHelperText}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  비밀번호
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  autoComplete="current-password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setServerError("");
                  }}
                  onBlur={() => {
                    setTouched((previousTouched) => ({
                      ...previousTouched,
                      password: true
                    }));
                  }}
                />

                <p className="helper-text" id="passwordHelperText">
                  {passwordHelperText}
                </p>
              </div>
            </div>

            {serverError && (
              <p className="helper-text login-error" role="alert">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <p className="signup-guide">
            아직 계정이 없으신가요?{" "}
            <Link to="/signup" className="signup-link">
              회원가입
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}

export default LoginPage;

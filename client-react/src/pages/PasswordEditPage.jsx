import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { updateUser } from "../api/userApi.js";
import Header from "../components/Header.jsx";
import "../styles/PasswordEditPage.css";

const PASSWORD_PATTERN =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,20}$/;

function PasswordEditPage() {
  const { userId: routeUserId } = useParams();
  const userId = localStorage.getItem("userId") || routeUserId;

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isPasswordValid = PASSWORD_PATTERN.test(password);
  const isFormValid = isPasswordValid && password === passwordConfirm;

  let passwordError = "";

  if (passwordTouched && password === "") {
    passwordError = "* 비밀번호를 입력해주세요.";
  } else if (passwordTouched && !isPasswordValid) {
    passwordError = "* 8~20자의 영문자, 숫자, 특수문자를 포함해주세요.";
  }

  let confirmError = "";

  if (confirmTouched && passwordConfirm === "") {
    confirmError = "* 비밀번호 확인을 입력해주세요.";
  } else if (confirmTouched && password !== passwordConfirm) {
    confirmError = "* 비밀번호가 일치하지 않습니다.";
  }

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timerId = window.setTimeout(() => setShowToast(false), 2000);
    return () => window.clearTimeout(timerId);
  }, [showToast]);

  async function handleSubmit(event) {
    event.preventDefault();
    setPasswordTouched(true);
    setConfirmTouched(true);

    if (!isFormValid || isSubmitting) {
      return;
    }

    const formData = new FormData();
    formData.append("password", password);

    try {
      setIsSubmitting(true);
      setServerError("");
      await updateUser(userId, formData);
      setPassword("");
      setPasswordConfirm("");
      setPasswordTouched(false);
      setConfirmTouched(false);
      setShowToast(true);
    } catch (error) {
      setServerError(error.message || "비밀번호 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header showBackButton showProfileMenu />

      <main className="main">
        <section className="password-edit-section">
          <h1 className="page-title">비밀번호 수정</h1>
          <p className="section-description">
            팬 라운지를 안전하게 이용할 새 비밀번호를 설정하세요.
          </p>

          <form className="password-edit-form" onSubmit={handleSubmit} noValidate>
            <div className="form-fields">
              <div className="form-group">
                <label htmlFor="password" className="form-label">비밀번호</label>
                <input id="password" type="password" className="form-input"
                  value={password} onChange={(event) => setPassword(event.target.value)}
                  onBlur={() => setPasswordTouched(true)} autoComplete="new-password" />
                <p className="helper-text">{passwordError}</p>
              </div>

              <div className="form-group">
                <label htmlFor="passwordConfirm" className="form-label">비밀번호 확인</label>
                <input id="passwordConfirm" type="password" className="form-input"
                  value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)}
                  onBlur={() => setConfirmTouched(true)} autoComplete="new-password" />
                <p className="helper-text">{confirmError}</p>
              </div>
            </div>

            {serverError && <p className="password-edit-error" role="alert">{serverError}</p>}

            <button type="submit" className="submit-button" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "수정 중..." : "수정하기"}
            </button>
          </form>
        </section>
      </main>

      {showToast && <div className="toast" role="status">수정완료</div>}
    </>
  );
}

export default PasswordEditPage;

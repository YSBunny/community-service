import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { signup } from "../api/userApi.js";
import Header from "../components/Header.jsx";
import "../styles/SignupPage.css";

// 이메일 검증 규칙
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 비밀번호 검증 규칙
const PASSWORD_PATTERN =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,20}$/;

function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: ""
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
    nickname: false
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = form.email.trim();
  const nickname = form.nickname.trim();

  const isFormValid =
    EMAIL_PATTERN.test(email) &&
    PASSWORD_PATTERN.test(form.password) &&
    form.password === form.passwordConfirm &&
    nickname.length >= 1 &&
    nickname.length <= 10;

  function getFieldError(name) {
    if (!touched[name]) {
      return "";
    }

    if (name === "email") {
      if (email === "") return "* 이메일을 입력해주세요.";
      if (!EMAIL_PATTERN.test(email)) return "* 올바른 이메일 형식을 입력해주세요.";
    }

    if (name === "password") {
      if (form.password === "") return "* 비밀번호를 입력해주세요.";
      if (!PASSWORD_PATTERN.test(form.password)) {
        return "* 8~20자의 영문자, 숫자, 특수문자를 포함해주세요.";
      }
    }

    if (name === "passwordConfirm") {
      if (form.passwordConfirm === "") return "* 비밀번호를 한 번 더 입력해주세요.";
      if (form.password !== form.passwordConfirm) return "* 비밀번호가 일치하지 않습니다.";
    }

    if (name === "nickname") {
      if (nickname === "") return "* 닉네임을 입력해주세요.";
      if (nickname.length > 10) return "* 닉네임은 10자 이하로 입력해주세요.";
    }

    return "";
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }));
    setServerError("");
  }

  function handleBlur(event) {
    const { name } = event.target;

    setTouched((previousTouched) => ({
      ...previousTouched,
      [name]: true
    }));
  }

  function handleImageChange(event) {
    const selectedFile = event.target.files[0] || null;
    setImageError("");

    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      event.target.value = "";
      setProfileImage(null);
      setImageError("* 이미지 파일만 선택할 수 있습니다.");
      return;
    }

    setProfileImage(selectedFile);
  }

  // 선택한 파일을 브라우저에서 미리 볼 수 있는 임시 URL로 만듭니다.
  useEffect(() => {
    if (!profileImage) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(profileImage);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [profileImage]);

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched({ email: true, password: true, passwordConfirm: true, nickname: true });

    if (!isFormValid || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError("");
      await signup({ email, password: form.password, nickname, profileImage });
      navigate("/login", { replace: true });
    } catch (error) {
      setServerError(error.message || "회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />

      <main className="main signup-main">
        <section className="signup-section">
          <h1 className="page-title">회원가입</h1>
          <p className="auth-description">나만의 팬 프로필을 만들고 이야기를 나눠보세요.</p>

          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            <div className="profile-form-group">
              <p className="profile-label">프로필 사진</p>
              <input
                type="file"
                id="profileImage"
                className="profile-input"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label htmlFor="profileImage" className="profile-upload-button">
                {previewUrl
                  ? <img src={previewUrl} alt="프로필 미리보기" className="profile-preview" />
                  : <span className="profile-plus">+</span>}
              </label>
              <p className="helper-text">{imageError}</p>
            </div>

            <div className="form-fields">
              <div className="form-group">
                <label htmlFor="email" className="form-label">이메일</label>
                <input id="email" name="email" type="email" className="form-input"
                  value={form.email} onChange={handleChange} onBlur={handleBlur}
                  placeholder="이메일을 입력하세요" autoComplete="email" />
                <p className="helper-text">{getFieldError("email")}</p>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">비밀번호</label>
                <input id="password" name="password" type="password" className="form-input"
                  value={form.password} onChange={handleChange} onBlur={handleBlur}
                  placeholder="비밀번호를 입력하세요" autoComplete="new-password" />
                <p className="helper-text">{getFieldError("password")}</p>
              </div>

              <div className="form-group">
                <label htmlFor="passwordConfirm" className="form-label">비밀번호 확인</label>
                <input id="passwordConfirm" name="passwordConfirm" type="password" className="form-input"
                  value={form.passwordConfirm} onChange={handleChange} onBlur={handleBlur}
                  placeholder="비밀번호를 한 번 더 입력하세요" autoComplete="new-password" />
                <p className="helper-text">{getFieldError("passwordConfirm")}</p>
              </div>

              <div className="form-group">
                <label htmlFor="nickname" className="form-label">닉네임</label>
                <input id="nickname" name="nickname" type="text" className="form-input"
                  value={form.nickname} onChange={handleChange} onBlur={handleBlur}
                  placeholder="닉네임을 입력하세요" />
                <p className="helper-text">{getFieldError("nickname")}</p>
              </div>
            </div>

            {serverError && <p className="signup-error" role="alert">{serverError}</p>}

            <button type="submit" className="signup-button" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <p className="login-guide">
            이미 계정이 있으신가요? <Link to="/login" className="login-link">로그인</Link>
          </p>
        </section>
      </main>
    </>
  );
}

export default SignupPage;

import { useEffect, useState } from "react";
import { Link } from "react-router";

import Header from "../components/Header";
import "../styles/SignupPage.css";

// 이메일 검증 규칙
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 비밀번호 검증 규칙
const PASSWORD_PATTERN =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,20}$/;

function Signup() {
  // 폼 상태
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: ""
  });

  // 폼에 포커싱이 되었었는지
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
    nickname: false
  });

  // 프로필 이미지와 미리보기 상태
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // 각 필드 안내 문구
  let emailHelperText = "";
  let passwordHelperText = "";
  let passwordConfirmHelperText = "";
  let nicknameHelperText = "";
  
  // 이메일에 포커싱됐었을 때
  if (touched.email) {
    if (form.email.trim() === "") {
      emailHelperText = "* 이메일을 입력해주세요.";
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      emailHelperText = "* 올바른 이메일 형식을 입력해주세요.";
    }
  }

  // 비밀번호에 포커싱됐었을 때
  if (touched.password) {
    if (form.password === "") {
      passwordHelperText = "* 비밀번호를 입력해주세요.";
    } else if (!PASSWORD_PATTERN.test(form.password)) {
      passwordHelperText =
        "* 비밀번호는 8자 이상, 20자 이하이며, 영문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    }
  }

  // 비밀번호 확인에 포커싱됐었을 때
  if (touched.passwordConfirm) {
    if (form.passwordConfirm === "") {
      passwordConfirmHelperText = "* 비밀번호를 한 번 더 입력해주세요.";
    } else if (form.password !== form.passwordConfirm) {
      passwordConfirmHelperText = "* 비밀번호가 일치하지 않습니다.";
    }
  }

  // 닉네임에 포커싱됐었을 때
  if (touched.nickname) {
    if (form.nickname.trim() === "") {
      nicknameHelperText = "* 닉네임을 입력해주세요.";
    } else if (form.nickname.trim().length > 10) {
      nicknameHelperText = "* 닉네임은 10자 이하로 입력해주세요.";
    }
  }

  // 필드 값이 전부 입력되었는지
  const isFormFilled =
    form.email.trim() !== "" &&
    form.password !== "" &&
    form.passwordConfirm !== "" &&
    form.nickname.trim() !== "";

  // 입력 값이 모두 제출 가능 값인지
  const isFormValid =
    EMAIL_PATTERN.test(form.email.trim()) &&
    PASSWORD_PATTERN.test(form.password) &&
    form.password === form.passwordConfirm &&
    form.nickname.trim().length > 0 &&
    form.nickname.trim().length <= 10;

  // 필드 입력 인식
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }));
  }

  // 필드 포커스 인식
  function handleBlur(event) {
    const { name } = event.target;

    setTouched((previousTouched) => ({
      ...previousTouched,
      [name]: true
    }));
  }

  // 이미지 파일 선택 인식
  function handleImageChange(event) {
    const selectedFile = event.currentTarget.files?.[0] ?? null;

    setProfileImage(selectedFile);
  }

  // 폼 제출
  function handleSubmit(event) {
    event.preventDefault();

    // input을 거치지 않고 제출 시도 시
    setTouched({
      email: true,
      password: true,
      passwordConfirm: true,
      nickname: true
    });

    // 폼 값이 유효하지 않으면 종료
    if (!isFormValid) {
      return;
    }

    const signupRequest = {
      email: form.email.trim(),
      password: form.password,
      nickname: form.nickname.trim(),
      profileImage
    }

    console.log(signupRequest);
  }

  // 프로필 이미지 미리보기
  useEffect(() => {
    // profileImage가 변경된 뒤 실행
    if (!profileImage) {
      setPreviewUrl("");
      return;
    }

    // 임시 URL 생성
    const objectUrl = URL.createObjectURL(profileImage);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl); // 기존 미리보기 URL 정리
    };
  }, [profileImage]); // profileImage가 바뀔 때만 실행

  return (
    <>
      <Header />

      <main className="main signup-main">
        <section className="signup-section">
          <h2 className="page-title">회원가입</h2>
          <p className="auth-description">나만의 팬 프로필을 만들고 이야기를 나눠보세요.</p>

          <form
            className="signup-form"
            onSubmit={handleSubmit}
            noValidate
          > {/* noValidate: 브라우저 기본 검증 메시지 사용 안 함 */}
            <div className="profile-form-group">
              <p className="profile-label">프로필 사진</p>

              <input
                type="file"
                id="profileImage"
                name="profileImage"
                className="profile-input"
                accept="image/*"
                onChange={handleImageChange}
              />

              <label htmlFor="profileImage" className="profile-upload-button">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="선택한 프로필 이미지 미리보기"
                    className="profile-preview"
                    id="profilePreview"
                  />
                ) : (
                  <span className="profile-plus" id="profilePlus">+</span>
                )}
              </label>

              <p className="helper-text" id="profileHelperText"></p>
            </div>

            <div className="form-fields">
              <div className="form-group">
                <label htmlFor="email" className="form-label">이메일</label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="이메일을 입력하세요"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={emailHelperText !== ""}
                  aria-describedby="email-helper"
                />
                {/* aria-invalid: 해당 입력값이 유효한지 검증 결과를 알려줌 */}
                {/* aria-describedby: input과 설명 문구 연결 */}

                <p id="email-helper" className="helper-text">
                  {emailHelperText}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">비밀번호</label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="비밀번호를 입력하세요"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <p id="password-helper" className="helper-text">
                  {passwordHelperText}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="passwordConfirm" className="form-label">비밀번호 확인</label>

                <input
                  type="password"
                  id="passwordConfirm"
                  name="passwordConfirm"
                  className="form-input"
                  placeholder="비밀번호를 한번 더 입력하세요"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <p id="password-confirm-helper" className="helper-text">
                  {passwordConfirmHelperText}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="nickname" className="form-label">닉네임</label>

                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  className="form-input"
                  placeholder="닉네임을 입력하세요"
                  value={form.nickname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <p id="nickname-helper" className="helper-text">
                  {nicknameHelperText}
                </p>
              </div>
            </div>

            <button type="submit" className="signup-button" disabled={!isFormFilled}>
              회원가입
            </button>
          </form>

          <p className="login-guide">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="login-link">로그인</Link>
          </p>
        </section>
      </main>
    </>
  );
}

export default Signup;

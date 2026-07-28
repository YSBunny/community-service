import { useState } from "react";
import { Link } from "react-router";

import Header from "../components/Header.jsx";
import "../styles/login.css";

// 이메일 검증 규칙
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  // 폼 상태
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  // 폼에 포커싱이 되었었는지
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  // 이메일과 비밀번호 안내 문구
  let emailHelperText = "";
  let passwordHelperText = "";

  // 두 필드 모두 입력됐는지
  const isFormFilled = form.email.trim() !== "" && form.password !== "";

  // 이메일에 포커싱됐었을 때
  if (touched.email) {
    if (form.email.trim() === "") {
      emailHelperText = "* 이메일을 입력해주세요.";
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      emailHelperText = "* 올바른 이메일 형식을 입력해주세요.";
    }
  }

  // 비밀번호에 포커싱됐었을 때
  if (touched.password && form.password === "") {
    passwordHelperText = "* 비밀번호를 입력해주세요.";
  }
  
  // 필드 입력 인식
  function handleChange(event) {
    const { name, value } = event.target; // 이벤트 발생 한 곳의 이름과 값 구조 분해 할당

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value // 변수 값을 객체의 속성명으로 사용: 계산된 프로퍼티
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

  // 폼 제출
  function handleSubmit(event) {
    event.preventDefault();

    // input을 거치지 않고 제출 시도 시
    setTouched({
      email: true,
      password: true
    });

    // 폼 값이 유효하지 않으면 종료
    if (!isFormFilled) {
      return;
    }

    const loginRequest = {
      email: form.email.trim(),
      password: form.password.trim()
    };

    console.log(loginRequest);
  }

  return (
    <>
      <Header />
      
      <main className="main login-main">
        <section className="login-section">
          <h2 className="page-title">로그인</h2>
          <p className="auth-description">최애 이야기가 시작되는 팬 라운지에 입장하세요.</p>

          <form className="login-form" onSubmit={handleSubmit}>
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
                />
                <p className="helper-text" id="emailHelperText">{emailHelperText}</p>
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
                <p className="helper-text" id="passwordHelperText">{passwordHelperText}</p>
              </div>
            </div>

            <button type="submit" className="login-button" disabled={!isFormFilled}>
              로그인
            </button>
          </form>

          <Link to="/signup" className="signup-link">
            회원가입
          </Link>
        </section>
      </main>
    </>
  );
}

export default LoginPage;

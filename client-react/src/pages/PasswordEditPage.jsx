import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { getUser, updateUser } from "../api/userApi.js";

import Header from "../components/Header.jsx";

import "../styles/PasswordEditPage.css";

const PASSWORD_PATTERN =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,20}$/;

function PasswordEditPage() {
  const { userId: routeUserId } = useParams();

  const navigate = useNavigate();

  const storedUserId = localStorage.getItem("userId");

  const userId = routeUserId ?? storedUserId;

  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    password: "",
    passwordConfirm: ""
  });

  const [touched, setTouched] = useState({
      password: false,
      passwordConfirm: false
    });

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [serverError, setServerError] = useState("");

  const [showToast, setShowToast] = useState(false);

  let passwordHelperText = "";
  let passwordConfirmHelperText = "";

  if (touched.password) {
    if (form.password === "") {
      passwordHelperText = "* 비밀번호를 입력해주세요.";
    } else if (!PASSWORD_PATTERN.test(form.password)) {
      passwordHelperText =
        "* 비밀번호는 8자 이상, 20자 이하이며 영문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    }
  }

  if (touched.passwordConfirm) {
    if (form.passwordConfirm === "") {
      passwordConfirmHelperText = "* 비밀번호 확인을 입력해주세요.";
    } else if (form.password !== form.passwordConfirm) {
      passwordConfirmHelperText = "* 비밀번호가 일치하지 않습니다.";
    }
  }

  const isFormFilled = form.password !== "" && form.passwordConfirm !== "";

  const isFormValid = PASSWORD_PATTERN.test(form.password) &&
    form.password === form.passwordConfirm;

  useEffect(() => {
    if (!userId) {
      navigate("/login", {
        replace: true
      });

      return undefined;
    }

    const controller = new AbortController();

    let ignore = false;

    async function loadUser() {
      try {
        setIsLoading(true);
        setServerError("");

        const responseData = await getUser(userId, {
            signal: controller.signal
          });

        if (!ignore) {
          setUser(responseData);
        }
      } catch (error) {
        if (error.name !== "AbortError" && !ignore) {
          console.error("회원정보 조회 실패:", error);

          setServerError(error.message || "회원정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [navigate, userId]);

  useEffect(() => {
    if (!showToast) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
        setShowToast(false);
      }, 2000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [showToast]);

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

  async function handleSubmit(event) {
    event.preventDefault();

    setTouched({
      password: true,
      passwordConfirm: true
    });

    if (!isFormValid || isSubmitting) {
      return;
    }

    const userData = new FormData();

    userData.append("password", form.password);

    try {
      setIsSubmitting(true);
      setServerError("");

      await updateUser(userId, userData);

      setForm({
        password: "",
        passwordConfirm: ""
      });

      setTouched({
        password: false,
        passwordConfirm: false
      });

      setShowToast(true);
    } catch (error) {
      console.error("비밀번호 수정 실패:", error);

      setServerError(error.message || "비밀번호 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <>
        <Header showBackButton />

        <main className="main">
          <p className="page-status">
            회원정보를 불러오는 중입니다...
          </p>
        </main>
      </>
    );
  }

  if (serverError && !user) {
    return (
      <>
        <Header showBackButton />

        <main className="main">
          <p className="page-error" role="alert">
            {serverError}
          </p>
        </main>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header showBackButton showProfileMenu user={user} />

      <main className="main">
        <section className="password-edit-section">
          <h1 className="page-title">
            비밀번호 수정
          </h1>

          <p className="section-description">
            팬 라운지를 안전하게 이용할 새 비밀번호를 설정하세요.
          </p>

          <form className="password-edit-form" onSubmit={handleSubmit} noValidate>
            <div className="form-fields">
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
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={passwordHelperText !== ""}
                  aria-describedby="password-helper"
                  autoComplete="new-password"
                />

                <p id="password-helper" className="helper-text">
                  {passwordHelperText}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="passwordConfirm" className="form-label">
                  비밀번호 확인
                </label>

                <input
                  type="password"
                  id="passwordConfirm"
                  name="passwordConfirm"
                  className="form-input"
                  placeholder="비밀번호를 한 번 더 입력하세요"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={passwordConfirmHelperText !== ""}
                  aria-describedby="password-confirm-helper"
                  autoComplete="new-password"
                />

                <p id="password-confirm-helper" className="helper-text">
                  {passwordConfirmHelperText}
                </p>
              </div>
            </div>

            {serverError && (
              <p className="password-edit-error" role="alert">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={ !isFormFilled || !isFormValid || isSubmitting}
            >
              {isSubmitting ? "수정 중..." : "수정하기"}
            </button>
          </form>
        </section>
      </main>

      {showToast && (
        <div className="toast" role="status" aria-live="polite">
          수정완료
        </div>
      )}
    </>
  );
}

export default PasswordEditPage;

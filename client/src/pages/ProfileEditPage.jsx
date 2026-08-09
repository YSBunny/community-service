import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { deleteUser, getUser, updateUser } from "../api/userApi.js";
import ConfirmModal from "../components/ConfirmModal.jsx";
import Header from "../components/Header.jsx";
import useImagePreview from "../hooks/useImagePreview.js";
import { getProfileImageUrl, useDefaultProfileImage } from "../utils/imageUrl.js";
import "../styles/ProfileEditPage.css";

function ProfileEditPage() {
  const { userId: routeUserId } = useParams();
  const navigate = useNavigate();
  const imageInputRef = useRef(null);

  // URL이 바뀌어도 로그인한 본인의 ID를 우선 사용
  const userId = localStorage.getItem("userId") || routeUserId;

  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, updatePreview] = useImagePreview();
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [imageError, setImageError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const trimmedNickname = nickname.trim();
  const isNicknameValid = trimmedNickname.length >= 1 && trimmedNickname.length <= 10;
  const hasChanges = user && (
    trimmedNickname !== user.nickname || profileImage !== null
  );

  let nicknameError = "";

  if (nicknameTouched && trimmedNickname === "") {
    nicknameError = "* 닉네임을 입력해주세요.";
  } else if (nicknameTouched && trimmedNickname.length > 10) {
    nicknameError = "* 닉네임은 10자 이하로 입력해주세요.";
  }

  useEffect(() => {
    let isCancelled = false;

    async function loadUser() {
      try {
        const response = await getUser(userId);

        if (!isCancelled) {
          setUser(response);
          setNickname(response.nickname || "");
        }
      } catch (error) {
        if (!isCancelled) {
          setServerError(error.message || "회원정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadUser();
    return () => { isCancelled = true; };
  }, [userId]);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timerId = window.setTimeout(() => setShowToast(false), 2000);
    return () => window.clearTimeout(timerId);
  }, [showToast]);

  function handleImageChange(event) {
    const selectedFile = event.target.files[0] || null;
    setImageError("");

    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      event.target.value = "";
      setProfileImage(null);
      updatePreview(null);
      setImageError("* 이미지 파일만 선택할 수 있습니다.");
      return;
    }

    setProfileImage(selectedFile);
    updatePreview(selectedFile);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setNicknameTouched(true);

    if (!isNicknameValid || !hasChanges || isSubmitting) {
      return;
    }

    const formData = new FormData();
    formData.append("nickname", trimmedNickname);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      setIsSubmitting(true);
      setServerError("");
      await updateUser(userId, formData);

      // 서버의 최신 회원정보를 다시 조회해 화면과 서버 상태 맞춤
      const updatedUser = await getUser(userId);
      setUser(updatedUser);
      setNickname(updatedUser.nickname || "");
      setProfileImage(null);
      updatePreview(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      setShowToast(true);
    } catch (error) {
      setServerError(error.message || "회원정보 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleWithdraw() {
    try {
      setIsWithdrawing(true);
      await deleteUser(userId);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      navigate("/login", { replace: true });
    } catch (error) {
      setServerError(error.message || "회원 탈퇴에 실패했습니다.");
      setIsModalOpen(false);
    } finally {
      setIsWithdrawing(false);
    }
  }

  if (isLoading) {
    return <><Header showBackButton /><main className="main"><p className="page-status">회원정보를 불러오는 중입니다...</p></main></>;
  }

  if (!user) {
    return <><Header showBackButton /><main className="main"><p className="page-error">{serverError}</p></main></>;
  }

  return (
    <>
      <Header showBackButton showProfileMenu user={user} />

      <main className="main">
        <section className="profile-edit-section">
          <h1 className="page-title">회원정보수정</h1>
          <p className="section-description">팬들에게 보여질 프로필을 관리하세요.</p>

          <form className="profile-edit-form" onSubmit={handleSubmit} noValidate>
            <div className="profile-image-section">
              <p className="profile-image-label">프로필 사진</p>
              <div className="profile-image-wrapper">
                <img
                  src={previewUrl || getProfileImageUrl(user.profileImage)}
                  alt="현재 프로필"
                  className="profile-image"
                  onError={useDefaultProfileImage}
                />
                <input ref={imageInputRef} type="file" id="profileImage"
                  className="profile-image-input" accept="image/*"
                  onChange={handleImageChange} />
                <label htmlFor="profileImage" className="profile-change-button">변경</label>
              </div>
              <p className="image-helper-text">{imageError}</p>
            </div>

            <div className="form-fields">
              <div className="form-group form-group--email">
                <span className="form-label">이메일</span>
                <p className="email-text">{user.email}</p>
              </div>

              <div className="form-group">
                <label htmlFor="nickname" className="form-label">닉네임</label>
                <input id="nickname" type="text" className="form-input"
                  value={nickname}
                  onChange={(event) => {
                    setNickname(event.target.value);
                    setServerError("");
                  }}
                  onBlur={() => setNicknameTouched(true)} />
                <p className="helper-text">{nicknameError}</p>
              </div>

              {serverError && <p className="profile-edit-error" role="alert">{serverError}</p>}

              <button type="submit" className="submit-button"
                disabled={!isNicknameValid || !hasChanges || isSubmitting}>
                {isSubmitting ? "수정 중..." : "수정하기"}
              </button>
            </div>
          </form>

          <button type="button" className="withdraw-button" onClick={() => setIsModalOpen(true)}>
            회원 탈퇴
          </button>
        </section>
      </main>

      {showToast && <div className="toast" role="status">수정완료</div>}

      <ConfirmModal
        isOpen={isModalOpen}
        title="회원탈퇴 하시겠습니까?"
        message="작성된 게시글과 댓글은 삭제됩니다."
        isProcessing={isWithdrawing}
        onConfirm={handleWithdraw}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default ProfileEditPage;

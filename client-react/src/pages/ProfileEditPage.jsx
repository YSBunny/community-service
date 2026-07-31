import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { deleteUser, getUser, updateUser } from "../api/userApi.js";

import ConfirmModal from "../components/ConfirmModal.jsx";
import Header from "../components/Header.jsx";

import defaultProfileImage from "../assets/images/defaultProfile.png";
import "../styles/ProfileEditPage.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function getProfileImageUrl(filename) {
  if (!filename) {
    return defaultProfileImage;
  }

  return `${SERVER_URL}/uploads/profiles/${encodeURIComponent(filename)}`;
}

function ProfileEditPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const imageInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [isNicknameTouched, setIsNicknameTouched] = useState(false);

  const [imageError, setImageError] = useState("");

  const [serverError, setServerError] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const [showToast, setShowToast] = useState(false);

  let nicknameHelperText = "";

  if (isNicknameTouched) {
    if (nickname.trim() === "") {
      nicknameHelperText = "* 닉네임을 입력해주세요.";
    } else if (
      nickname.trim().length > 10
    ) {
      nicknameHelperText = "* 닉네임은 10자 이하로 입력해주세요.";
    }
  }

  const isNicknameValid = nickname.trim() !== "" && nickname.trim().length <= 10;

  const hasChanges = user !== null && (
      nickname.trim() !== user.nickname || selectedProfileImage !== null
    );

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

        if (!responseData?.email) {
          throw new Error("회원정보 응답 형식이 올바르지 않습니다.");
        }

        if (!ignore) {
          setUser(responseData);
          setNickname(responseData.nickname ?? "");
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
    if (!selectedProfileImage) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedProfileImage);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedProfileImage]);

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

  function handleNicknameChange(event) {
    setNickname(event.target.value);
    setIsNicknameTouched(true);
    setServerError("");
  }

  function handleNicknameBlur() {
    setIsNicknameTouched(true);
  }

  function handleImageChange(event) {
    const selectedFile = event.currentTarget.files?.[0] ?? null;

    setImageError("");
    setServerError("");

    if (!selectedFile) {
      setSelectedProfileImage(null);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      event.currentTarget.value = "";
      setSelectedProfileImage(null);

      setImageError("* 이미지 파일만 선택할 수 있습니다.");

      return;
    }

    setSelectedProfileImage(selectedFile);
  }

  function handlePreviewError(event) {
    const image = event.currentTarget;

    if (image.dataset.fallbackApplied === "true") {
      return;
    }

    image.dataset.fallbackApplied = "true";

    image.src = defaultProfileImage;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsNicknameTouched(true);

    if (!isNicknameValid || !hasChanges || isSubmitting) {
      return;
    }

    const userData = new FormData();

    userData.append("nickname", nickname.trim());

    if (selectedProfileImage) {
      userData.append("profileImage", selectedProfileImage);
    }

    try {
      setIsSubmitting(true);
      setServerError("");

      const responseData = await updateUser(userId, userData);

      /*
       * 수정 API가 수정된 회원정보를 반환하면
       * 기존 user와 병합합니다.
       *
       * 응답 본문이 없다면 다시 조회합니다.
       */
      const updatedUser = responseData ? {
              ...user,
              ...responseData
            } : await getUser(userId);

      setUser(updatedUser);

      setNickname(updatedUser.nickname ?? nickname.trim());

      setSelectedProfileImage(null);

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      setShowToast(true);
    } catch (error) {
      console.error("회원정보 수정 실패:", error);

      setServerError(error.message || "회원정보 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function openWithdrawModal() {
    setServerError("");
    setIsWithdrawModalOpen(true);
  }

  function closeWithdrawModal() {
    if (isWithdrawing) {
      return;
    }

    setIsWithdrawModalOpen(false);
  }

  async function handleWithdraw() {
    if (isWithdrawing) {
      return;
    }

    try {
      setIsWithdrawing(true);
      setServerError("");

      await deleteUser(userId);

      localStorage.removeItem("accessToken");

      localStorage.removeItem("userId");

      navigate("/login", {
        replace: true
      });
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);

      setServerError(error.message || "회원 탈퇴에 실패했습니다.");

      setIsWithdrawModalOpen(false);
    } finally {
      setIsWithdrawing(false);
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

  const displayedProfileImage = previewUrl || getProfileImageUrl(user.profileImage);

  return (
    <>
      <Header showBackButton showProfileMenu user={user}/>

      <main className="main">
        <section className="profile-edit-section">
          <h1 className="page-title">
            회원정보수정
          </h1>

          <p className="section-description">
            팬들에게 보여질 프로필을 관리하세요.
          </p>

          <form
            className="profile-edit-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="profile-image-section">
              <p className="profile-image-label">
                프로필 사진
              </p>

              <div className="profile-image-wrapper">
                <img
                  src={displayedProfileImage}
                  alt="현재 프로필 이미지"
                  className="profile-image"
                  onError={handlePreviewError}
                />

                <input
                  ref={imageInputRef}
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  className="profile-image-input"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <label htmlFor="profileImage" className="profile-change-button">
                  변경
                </label>
              </div>

              <p className="image-helper-text">
                {imageError}
              </p>
            </div>

            <div className="form-fields">
              <div className="form-group form-group--email">
                <span className="form-label">
                  이메일
                </span>

                <p className="email-text">
                  {user.email}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="nickname" className="form-label">
                  닉네임
                </label>

                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  className="form-input"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={handleNicknameChange}
                  onBlur={handleNicknameBlur}
                  aria-invalid={nicknameHelperText !== ""}
                  aria-describedby="nickname-helper"
                />

                <p id="nickname-helper" className="helper-text">
                  {nicknameHelperText}
                </p>
              </div>

              {serverError && (
                <p className="profile-edit-error" role="alert">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={!isNicknameValid || !hasChanges || isSubmitting}
              >
                {isSubmitting ? "수정 중..." : "수정하기"}
              </button>
            </div>
          </form>

          <button type="button" className="withdraw-button" onClick={openWithdrawModal}>
            회원 탈퇴
          </button>
        </section>
      </main>

      {showToast && (
        <div className="toast" role="status" aria-live="polite">
          수정완료
        </div>
      )}

      <ConfirmModal
        isOpen={isWithdrawModalOpen}
        title="회원탈퇴 하시겠습니까?"
        message="작성된 게시글과 댓글은 삭제됩니다."
        confirmText="확인"
        isProcessing={isWithdrawing}
        onConfirm={handleWithdraw}
        onClose={closeWithdrawModal}
      />
    </>
  );
}

export default ProfileEditPage;

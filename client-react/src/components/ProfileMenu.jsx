import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { logout } from "../api/authApi.js";

import defaultProfileImage from "../assets/images/defaultProfile.png";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function getProfileImageUrl(profileImage) {
  if (!profileImage) {
    return defaultProfileImage;
  }

  /*
   * 이미 완성된 URL 또는 public 경로라면
   * 그대로 사용합니다.
   */
  if (
    profileImage.startsWith("http://") ||
    profileImage.startsWith("https://") ||
    profileImage.startsWith("/")
  ) {
    return profileImage;
  }

  return `${SERVER_URL}/uploads/profiles/${encodeURIComponent(profileImage)}`;
}

function ProfileMenu({ user }) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userId = user?.userId ?? localStorage.getItem("userId");

  const profileImageUrl = getProfileImageUrl(user?.profileImage);

  function handleToggle() {
    setIsOpen((previousIsOpen) => !previousIsOpen);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleImageError(event) {
    const image = event.currentTarget;

    if (image.dataset.fallbackApplied === "true") {
      return;
    }

    image.dataset.fallbackApplied = "true";

    image.src = defaultProfileImage;
  }

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      await logout();
    } catch (error) {
      /*
       * 서버 요청이 실패해도 브라우저의 토큰을
       * 삭제하면 현재 브라우저에서는 로그아웃됩니다.
       */
      console.error("로그아웃 요청 실패:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");

      setIsOpen(false);

      navigate("/login", {
        replace: true
      });
    }
  }

  return (
    <div className="profile-menu-area">
      <button
        type="button"
        className="profile-button"
        onClick={handleToggle}
        aria-label={isOpen ? "프로필 메뉴 닫기" : "프로필 메뉴 열기"}
        aria-expanded={isOpen}
        aria-controls="profile-dropdown"
      >
        <img
          src={profileImageUrl}
          alt={`${user?.nickname ?? "사용자"} 프로필`}
          onError={handleImageError}
        />
      </button>

      {isOpen && (
        <nav id="profile-dropdown" className="profile-dropdown" aria-label="프로필 메뉴">
          {userId && (
            <>
              <Link
                to={`/users/${userId}/edit`}
                className="profile-dropdown__item"
                onClick={handleClose}
              >
                회원정보 수정
              </Link>

              <Link
                to={`/users/${userId}/password`}
                className="profile-dropdown__item"
                onClick={handleClose}
              >
                비밀번호 수정
              </Link>
            </>
          )}

          <button
            type="button"
            className="profile-dropdown__item"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
          </button>
        </nav>
      )}
    </div>
  );
}

export default ProfileMenu;

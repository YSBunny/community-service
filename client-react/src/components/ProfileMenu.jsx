import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

import { logout } from "../api/authApi.js";
import { getProfileImageUrl, useDefaultProfileImage } from "../utils/imageUrl.js";

function ProfileMenu({ user }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userId = user?.userId || localStorage.getItem("userId");

  // 메뉴 밖을 클릭하면 드롭다운 닫음
  useEffect(() => {
    function closeMenuWhenClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenuWhenClickOutside);

    return () => {
      document.removeEventListener("mousedown", closeMenuWhenClickOutside);
    };
  }, []);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      // 서버 로그아웃이 실패해도 현재 브라우저의 로그인 정보 제거
      console.error("로그아웃 요청 실패:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="profile-menu-area" ref={menuRef}>
      <button
        type="button"
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="프로필 메뉴 열기"
        aria-expanded={isOpen}
      >
        <img
          src={getProfileImageUrl(user?.profileImage)}
          alt="프로필"
          onError={useDefaultProfileImage}
        />
      </button>

      {isOpen && (
        <nav className="profile-dropdown" aria-label="프로필 메뉴">
          <Link
            to={`/users/${userId}/edit`}
            className="profile-dropdown__item"
            onClick={() => setIsOpen(false)}
          >
            회원정보 수정
          </Link>

          <Link
            to={`/users/${userId}/password`}
            className="profile-dropdown__item"
            onClick={() => setIsOpen(false)}
          >
            비밀번호 수정
          </Link>

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

import { useState } from "react";
import { Link } from "react-router";

function ProfileMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  const profileImageUrl = user?.profileImage || "/images/default-profile.png";

  function handleToggle() {
    setIsOpen((previousIsOpen) => !previousIsOpen);
  }

  return (
    <div className="profile-menu-area">
      <button
        type="button"
        className="profile-button"
        onClick={handleToggle}
        aria-label="프로필 메뉴 열고 닫기"
        aria-expanded={isOpen}  // 버튼이 제어하는 영역의 열림 상태
        aria-controls="profile-dropdown"  // 버튼이 제어하는 요소
      >
        <img src={profileImageUrl} alt={`${user?.nickname ?? "사용자"} 프로필`} />
      </button>

      {/* isOpen이 true면 메뉴 보이게 */
      isOpen && (
        <nav className="profile-dropdown" aria-label="프로필 메뉴">
          <Link to={`/users/${user.userId}/edit`} className="profile-dropdown__item">
            회원정보 수정
          </Link>

          <Link to={`/users/${user.userId}/password`} className="profile-dropdown__item">
            비밀번호 수정
          </Link>

          <button type="button" className="profile-dropdown__item">
            로그아웃
          </button>
        </nav>
      )}
    </div>
  );
}

export default ProfileMenu;

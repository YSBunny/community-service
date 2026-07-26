import { Link, useNavigate } from "react-router";
import ProfileMenu from "./ProfileMenu";

function Header({
  showBackButton = false,
  showProfileMenu = false,
  user
}) {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  return (
    <header className="header">
      <div className="header__inner">
        {/* showBackButton이 true면 버튼 렌더링 */
        showBackButton && (
          <button
            type="button"
            className="back-button"
            onClick={handleBack}
            aria-label="뒤로 가기"
          >
            ‹
          </button>
        )}

        <Link to="/posts" className="header__title">
          냐르륵
        </Link>

        {/* showProfileMenu이 true면 프로필 메뉴 렌더링 */
        showProfileMenu && (
          <ProfileMenu user={user} />
        )}
      </div>
    </header>
  );
}

export default Header;

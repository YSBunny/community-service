import { Link, useNavigate } from "react-router";

import ProfileMenu from "./ProfileMenu.jsx";

function Header({ showBackButton = false, showProfileMenu = false, user }) {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  return (
    <header className="header">
      <div className="header__inner">
        {showBackButton && (
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

        {showProfileMenu && <ProfileMenu user={user} />}
      </div>
    </header>
  );
}

export default Header;

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

        <Link to="/posts" className="header__title" aria-label="냐르륵 홈">
          <span className="logo-lockup" aria-hidden="true">
            <span className="logo-ear logo-ear--left" />
            <span className="logo-ear logo-ear--right" />
            <span className="logo-word">
              <span className="logo-letter">냐</span>
              <span className="logo-letter">르</span>
              <span className="logo-letter">륵</span>
            </span>
            <span className="logo-tail" aria-hidden="true">
              <svg viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4,36 C0,24 2,10 12,4 C20,-1 30,2 32,10 C34,17 28,20 22,16 C18,13 18,8 24,6 C16,7 10,12 10,20 C10,28 14,33 20,34 C14,38 6,39 4,36 Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </span>
        </Link>

        {showProfileMenu && <ProfileMenu user={user} />}
      </div>
    </header>
  );
}

export default Header;

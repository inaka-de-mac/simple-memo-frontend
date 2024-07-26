import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import HeaderMenu from "./HeaderMenu";
import HeaderModal from "./HeaderModal";

const Header: React.VFC = () => {
  const { isSignedIn } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // メニューを開く場所
  const userInfo = localStorage.getItem("userInfo");

  const handleIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <header className="header">
      <h1 className="header__title">
        <a href="/" className="header__title-link">
          Simpl
        </a>
      </h1>
      {isSignedIn && (
        <>
          <button className="header__user-name" onClick={handleIconClick}>
            {userInfo && JSON.parse(userInfo).userName}
          </button>
          <HeaderMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
          <HeaderModal />
        </>
      )}
    </header>
  );
};

export default Header;

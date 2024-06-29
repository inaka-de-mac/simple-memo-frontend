import { useAuthContext } from "../../context/AuthContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { HeaderMenuProps } from "../../Types";

const HeaderMenu: React.VFC<HeaderMenuProps> = ({
  anchorEl,
  setAnchorEl,
}) => {
  const { handleSignOut, setModalOpen } = useAuthContext();
  const menuOpen = Boolean(anchorEl); // メニューを開いているか否か
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <Menu
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: "bottom", // メニューの基準となる要素（anchorEl）の下部からの表示
        horizontal: "right", // メニューの基準となる要素（anchorEl）の右端からの表示
      }}
      transformOrigin={{
        vertical: "top", // メニュー自体の上部を基準として配置
        horizontal: "right", // メニュー自体の右端を基準として配置
      }}
    >
      <MenuItem className="header__menu-item" onClick={handleMenuClose}>
        <ListItemIcon>
          <LogoutIcon fontSize="large" />
        </ListItemIcon>
        <ListItemText className="header__menu-text" onClick={handleSignOut}>
          サインアウト
        </ListItemText>
      </MenuItem>
      <MenuItem className="header__menu-item" onClick={handleMenuClose}>
        <ListItemIcon>
          <DeleteForeverIcon fontSize="large" className="header__menu-img-red" />
        </ListItemIcon>
        <ListItemText
          className="header__menu-text header__menu-text-red"
          onClick={() => setModalOpen(true)}
        >
          アカウントを削除
        </ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default HeaderMenu;
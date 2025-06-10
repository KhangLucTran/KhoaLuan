import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "../../styles/ProfileSideBar.css";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import HomeIcon from "@mui/icons-material/Home";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import PropTypes from "prop-types";
import Footer from "../../components/Footer/Footer";

const menuItems = [
  { text: "Quay lại Levents", icon: <KeyboardBackspaceIcon />, link: "/" },
  {
    text: "Thông báo",
    icon: <NotificationsNoneOutlinedIcon />,
    link: "/levents/notification",
  },
  {
    text: "Tài khoản",
    icon: <PersonOutlineOutlinedIcon />,
    subItems: [
      { text: "Hồ sơ", icon: <PermContactCalendarIcon />, link: "view" },
      { text: "Địa chỉ", icon: <HomeIcon />, link: "address" },
      {
        text: "Đổi mật khẩu",
        icon: <LockOutlinedIcon />,
        link: "change-password",
      },
    ],
  },
  {
    text: "Đơn mua",
    icon: <ShoppingCartOutlinedIcon />,
    link: "/levents/invoice",
  },
  { text: "Kho Voucher", icon: <LocalOfferOutlinedIcon />, link: "vouchers" },
];

const Sidebar = ({ toggleDrawer }) => {
  const [openSubMenu, setOpenSubMenu] = useState(false);

  const handleToggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu);
  };

  return (
    <List>
      {/* Logo Levents */}
      <div className="sidebar-logo-profile">
        <h2 className="sidebar-logo-profile-h2">Levents</h2>
      </div>

      {menuItems.map((item, index) => (
        <div key={index}>
          <ListItem disablePadding>
            {item.subItems ? (
              <ListItemButton onClick={handleToggleSubMenu}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {openSubMenu ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            ) : (
              <ListItemButton
                component={Link}
                to={item.link}
                onClick={() => toggleDrawer(false)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            )}
          </ListItem>

          {/* Menu con */}
          {item.subItems && (
            <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
              <List sx={{ pl: 4 }}>
                {item.subItems.map((sub, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={sub.link}
                      onClick={() => toggleDrawer(false)}
                    >
                      {sub.icon && <ListItemIcon>{sub.icon}</ListItemIcon>}
                      <ListItemText primary={sub.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          )}

          {index === 0 || index === 1 || index === 3 ? (
            <Divider sx={{ my: 1 }} />
          ) : null}
        </div>
      ))}
    </List>
  );
};

const Profile = () => {
  return (
    <>
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="profile-container">
        <div className="profile-content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

Sidebar.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
};

export default Profile;

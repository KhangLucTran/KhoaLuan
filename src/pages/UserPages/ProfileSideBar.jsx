import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "../../styles/ProfileSideBar.css";
import {
  Drawer,
  Button,
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
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import PropTypes from "prop-types";
import Footer from "../../components/Footer/Footer";

const menuItems = [
  { text: "Quay lại Levents", icon: <KeyboardBackspaceIcon />, link: "/" },
  {
    text: "Thông báo",
    icon: <NotificationsNoneOutlinedIcon />,
    link: "notifications",
  },
  {
    text: "Tài khoản của tôi",
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
  { text: "Đơn mua", icon: <ShoppingCartOutlinedIcon />, link: "orders" },
  { text: "Kho Voucher", icon: <LocalOfferOutlinedIcon />, link: "vouchers" },
  { text: "Xu", icon: <MonetizationOnOutlinedIcon />, link: "coins" },
];

const Sidebar = ({ toggleDrawer }) => {
  const [openSubMenu, setOpenSubMenu] = useState(false);

  const handleToggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu);
  };

  return (
    <List>
      {/* Logo Levents */}
      <div className="sidebar-logo">
        <h3>Levents</h3>
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
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <>
      <Button
        className="menu-button"
        onClick={() => toggleDrawer(true)}
        sx={{ position: "absolute", top: 20, left: 10 }}
      >
        <MenuIcon />
      </Button>
      <Drawer anchor="left" open={open} onClose={() => toggleDrawer(false)}>
        <Sidebar toggleDrawer={toggleDrawer} />
      </Drawer>
      <div className="profile-container">
        <div className="profile-content">
          <Outlet />
        </div>
      </div>
      <Footer className="footer" />
    </>
  );
};

Sidebar.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
};

export default Profile;

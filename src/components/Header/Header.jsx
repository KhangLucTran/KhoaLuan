import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthenticationContext,
  SessionContext,
} from "@toolpad/core/AppProvider";
import CustomTooltip from "../CustomTooltip/CustomTooltip";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

import { Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/user/userSlice";
import DetailedDialog from "../../components/Toast/Dialog";
import useProtectedDialog from "../../hooks/protectedDialogHook";
import { Account } from "@toolpad/core/Account";
import { Login, Logout } from "@mui/icons-material";

import "../../styles/Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  // Sử dụng hook bảo vệ các hành động cần đăng nhập
  const { open, setOpen, handleProtectedAction } = useProtectedDialog();

  // Xây dựng AuthenticationContext để signIn/signOut
  const authContext = useMemo(
    () => ({
      signIn: () => {
        // Bạn có thể chọn chuyển hướng trực tiếp hoặc mở dialog
        navigate("/levents/login");
      },
      signOut: () => {
        dispatch(logoutUser());
        navigate("/");
      },
    }),
    [dispatch, navigate]
  );

  // Xây dựng session dựa trên dữ liệu user từ Redux
  const session = user
    ? {
        user: {
          name: user.data.profileId?.username || "Khách",
          email: user.data.email,
          image:
            user.data.profileId?.avatar || "https://via.placeholder.com/150",
        },
      }
    : null;

  // Xử lí Header khi scroll xuống 100px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        document.querySelector(".header-container").classList.add("scrolled");
      } else {
        document
          .querySelector(".header-container")
          .classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AuthenticationContext.Provider value={authContext}>
      <SessionContext.Provider value={session}>
        <header className="header-container">
          {/* Header Logo */}
          <div className="header-logo">
            <CustomTooltip title="Trang chủ">
              <a href="/">Levents</a>
            </CustomTooltip>
          </div>

          {/* Header Nav */}
          <nav className="header-nav">
            <ul>
              <li className="header-li">
                <a href="/">Trang chủ</a>
              </li>
              <li className="header-li">
                <a href="/levents/about">Thông tin</a>
              </li>
              <li className="header-li">
                <a href="#services">Dịch vụ</a>
              </li>
              <li className="header-li">
                <a href="#contact">Liên hệ</a>
              </li>
            </ul>
          </nav>

          {/* Header Icon */}
          <div className="header-nav-icon">
            <CustomTooltip title="Giỏ hàng">
              <Badge color="info" badgeContent={0}>
                <ShoppingCartOutlinedIcon
                  fontSize="medium"
                  onClick={() => handleProtectedAction("/levents/cart")}
                  style={{ cursor: "pointer" }}
                />
              </Badge>
            </CustomTooltip>

            <CustomTooltip title="Sản phẩm yêu thích">
              <Badge color="info" badgeContent={0}>
                <FavoriteBorderOutlinedIcon
                  fontSize="medium"
                  onClick={() => handleProtectedAction("/levents/wishlist")}
                  style={{ cursor: "pointer" }}
                />
              </Badge>
            </CustomTooltip>
            {/* Account */}
            <Account
              slotProps={{
                signInButton: {
                  color: "black",
                  startIcon: <Login />,
                },
                signOutButton: {
                  color: "black",
                  startIcon: <Logout />,
                },
                preview: {
                  variant: "expanded",
                  slotProps: {
                    avatarIconButton: {
                      sx: {
                        width: "fit-content",
                        margin: "auto",
                      },
                    },
                    avatar: {
                      variant: "rounded",
                    },
                  },
                },
              }}
            />
          </div>
        </header>

        {/* DetailedDialog */}
        <DetailedDialog
          open={open}
          onClose={() => setOpen(false)}
          onLogin={() => navigate("/levents/login")}
        />
      </SessionContext.Provider>
    </AuthenticationContext.Provider>
  );
};

export default Header;

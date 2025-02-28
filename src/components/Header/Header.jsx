import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthenticationContext,
  SessionContext,
} from "@toolpad/core/AppProvider";
import CustomTooltip from "../CustomTooltip/CustomTooltip";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo, logoutUser } from "../../features/user/userSlice";
import DetailedDialog from "../../components/Toast/Dialog";
import useProtectedDialog from "../../hooks/protectedDialogHook";
import { Account } from "@toolpad/core/Account";
import { Login, Logout } from "@mui/icons-material";
import "../../styles/Header.css";
import PropTypes from "prop-types";
import { logout } from "../../features/auth/authSlice";
import { getAuthTokens, saveAuthTokens } from "../../utils/token";
import { getTotalQuantityApi } from "../../features/cart/cartApi";
import { useCart } from "../../pages/OrderPages/cartContext";

const Header = ({ hideNav }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const token = getAuthTokens().accessToken;
  const [total, setTotal] = useState(0);
  const { open, setOpen, handleProtectedAction } = useProtectedDialog();
  const isFetched = useRef(false);
  const prevCartItems = useRef([]);
  const { cartItems, lineItems, totalQuantity, fetchCartData } = useCart();

  // ✅ Gọi API lấy số lượng khi đăng nhập
  useEffect(() => {
    if (token && !isFetched.current) {
      dispatch(fetchUserInfo());
      fetchCartQuantity();
      isFetched.current = true; // Đánh dấu đã gọi API
    }
  }, [token, dispatch]);

  // ✅ Theo dõi sự thay đổi của giỏ hàng
  useEffect(() => {
    if (JSON.stringify(prevCartItems.current) !== JSON.stringify(cartItems)) {
      fetchCartQuantity();
      prevCartItems.current = cartItems;
    }
  }, [cartItems, lineItems]);

  // ✅ Ưu tiên lấy total từ CartContext
  useEffect(() => {
    setTotal(totalQuantity || 0);
  }, [totalQuantity]);

  // ✅ Gọi API nếu cần thiết
  const fetchCartQuantity = async () => {
    try {
      if (totalQuantity > 0) return; // Tránh gọi API khi đã có dữ liệu
      const data = await getTotalQuantityApi();
      console.log("Dữ liệu API trả về:", data);

      const quantity =
        typeof data === "number" ? { totalQuantity: data } : data;

      if (quantity && typeof quantity.totalQuantity === "number") {
        setTotal(quantity.totalQuantity);
      } else {
        console.warn("Dữ liệu không đúng định dạng:", quantity);
      }
    } catch (error) {
      console.error("Lỗi khi lấy số lượng sản phẩm:", error.message);
    }
  };

  // State cho thông báo
  const [anchorEl, setAnchorEl] = useState(null);
  const openNotif = Boolean(anchorEl);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const notifications = [
    { id: 1, message: "Đơn hàng của bạn đã được xác nhận!" },
    { id: 2, message: "Sản phẩm yêu thích của bạn đang giảm giá!" },
    { id: 3, message: "Bạn có tin nhắn mới từ Admin." },
  ];

  const authContext = useMemo(
    () => ({
      signIn: async (tokens) => {
        saveAuthTokens(tokens);
        navigate("/levents/login");
        fetchCartData();
        fetchCartQuantity();
      },
      signOut: () => {
        dispatch(logout());
        dispatch(logoutUser());
        setTotal(0);
        navigate("/");
      },
    }),
    [dispatch, navigate, fetchCartData]
  );

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

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".header-container");
      if (header) {
        header.classList.toggle("scrolled", window.scrollY > 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AuthenticationContext.Provider value={authContext}>
      <SessionContext.Provider value={session}>
        <header className="header-container">
          <div className="header-logo">
            <CustomTooltip title="Trang chủ">
              <a href="/">Levents</a>
            </CustomTooltip>
          </div>

          {!hideNav && (
            <nav className="header-nav">
              <ul>
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <a href="/levents/about">Thông tin</a>
                </li>
                <li>
                  <a href="#services">Dịch vụ</a>
                </li>
                <li>
                  <a href="#contact">Liên hệ</a>
                </li>
              </ul>
            </nav>
          )}

          <div className="header-nav-icon">
            <CustomTooltip title="Thông báo">
              <IconButton color="inherit" onClick={handleNotificationClick}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsOutlinedIcon fontSize="medium" />
                </Badge>
              </IconButton>
            </CustomTooltip>
            <Menu
              anchorEl={anchorEl}
              open={openNotif}
              onClose={handleClose}
              PaperProps={{ style: { width: "250px", maxHeight: "300px" } }}
            >
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <MenuItem key={notif.id} onClick={handleClose}>
                    {notif.message}
                  </MenuItem>
                ))
              ) : (
                <MenuItem onClick={handleClose}>Không có thông báo</MenuItem>
              )}
            </Menu>

            <CustomTooltip title="Giỏ hàng">
              <Badge color="info" badgeContent={total}>
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

            <Account
              slotProps={{
                signInButton: { color: "black", startIcon: <Login /> },
                signOutButton: { color: "black", startIcon: <Logout /> },
                preview: {
                  variant: "expanded",
                  slotProps: {
                    avatarIconButton: {
                      sx: { width: "fit-content", margin: "auto" },
                    },
                    avatar: { variant: "rounded" },
                  },
                },
              }}
            />
          </div>
        </header>

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

Header.propTypes = {
  hideNav: PropTypes.bool,
};

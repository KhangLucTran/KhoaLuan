import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthenticationContext,
  SessionContext,
} from "@toolpad/core/AppProvider";
import CustomTooltip from "../CustomTooltip/CustomTooltip";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Badge, IconButton } from "@mui/material";
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
import { getFavoriteUserApi } from "../../features/favorite/favoriteApi";
import NotificationDropdown from "../Toast/NotificationDropdown";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ChatBox from "../Chat/ChatBox";

const Header = ({ hideNav }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const token = getAuthTokens().accessToken;
  const [total, setTotal] = useState(0);
  const [totalFavorite, setTotalFavorite] = useState(0);
  const { open, setOpen, handleProtectedAction } = useProtectedDialog();
  const isFetched = useRef(false);
  const prevCartItems = useRef([]);
  const { cartItems, lineItems, totalQuantity, fetchCartData } = useCart();
  const [showChat, setShowChat] = useState(false);

  // ✅ Gọi API lấy số lượng khi đăng nhập
  useEffect(() => {
    if (token && !isFetched.current) {
      dispatch(fetchUserInfo());
      fetchCartQuantity();
      fecthQuantityFavroite();
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

  const fecthQuantityFavroite = async () => {
    try {
      const response = await getFavoriteUserApi();

      if (response && Array.isArray(response.data)) {
        setTotalFavorite(response.data.length);
        console.log("Số lượng sản phẩm yêu thích:", response.data.length);
      } else {
        console.warn("Dữ liệu không hợp lệ từ API yêu thích:", response);
      }
    } catch (error) {
      console.error("Lỗi khi lấy số lượng yêu thích:", error.message);
    }
  };

  // const handleNotificationClick = () => {
  //   navigate("/levents/notification");
  // };

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
        setTotalFavorite(0);
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
              <Badge
                badgeContent={0}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#000", // Màu nền badge
                    color: "#fff", // Màu chữ trong badge
                  },
                }}
              >
                <NotificationDropdown />
              </Badge>
            </CustomTooltip>

            <CustomTooltip title="Tin nhắn">
              <IconButton color="inherit">
                <Badge
                  badgeContent={1}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#000",
                      color: "#fff",
                    },
                  }}
                  onClick={() => setShowChat(true)}
                >
                  <ChatOutlinedIcon />
                </Badge>
              </IconButton>
            </CustomTooltip>

            <CustomTooltip title="Giỏ hàng">
              <IconButton color="inherit">
                <Badge
                  badgeContent={total}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#000", // Màu nền badge
                      color: "#fff", // Màu chữ trong badge
                    },
                  }}
                >
                  <ShoppingCartOutlinedIcon
                    fontSize="medium"
                    onClick={() => handleProtectedAction("/levents/cart")}
                    style={{ cursor: "pointer" }}
                  />
                </Badge>
              </IconButton>
            </CustomTooltip>

            <CustomTooltip title="Sản phẩm yêu thích">
              <IconButton color="inherit">
                <Badge
                  badgeContent={totalFavorite}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#000", // Màu nền badge
                      color: "#fff", // Màu chữ trong badge
                    },
                  }}
                >
                  <FavoriteBorderOutlinedIcon
                    fontSize="medium"
                    onClick={() => handleProtectedAction("/levents/favorite")}
                    style={{ cursor: "pointer" }}
                  />
                </Badge>
              </IconButton>
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
        {/* Khung chat */}
        {showChat && <ChatBox onClose={() => setShowChat(false)} />}

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

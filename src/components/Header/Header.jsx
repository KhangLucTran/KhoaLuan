import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthenticationContext,
  SessionContext,
} from "@toolpad/core/AppProvider";
import CustomTooltip from "../CustomTooltip/CustomTooltip";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { Badge, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo, logoutUser } from "../../features/user/userSlice";
import {
  fetchFavorites,
  resetFavorites,
} from "../../features/favorite/favoriteSlice";
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
import NotificationDropdown from "../Toast/NotificationDropdown";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { persistor } from "../../store";
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
  const { totalQuantity, fetchCartData } = useCart();
  const [showChat, setShowChat] = useState(false);

  // ✅ Lấy số lượng sản phẩm yêu thích từ Redux
  const favoriteItems = useSelector((state) => state.favorite.items);

  // ✅ Gọi API lấy số lượng khi đăng nhập
  useEffect(() => {
    if (token && !isFetched.current) {
      dispatch(fetchUserInfo());
      dispatch(fetchFavorites());
      fetchCartQuantity();
      isFetched.current = true; // Đánh dấu đã gọi API
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (totalQuantity === 0) {
      // Chỉ gọi API khi chưa có dữ liệu
      fetchCartQuantity();
    } else {
      setTotal(totalQuantity);
    }
  }, [totalQuantity]);

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

  // Đồng bộ số lượng yêu thích từ Redux store
  useEffect(() => {
    setTotalFavorite(favoriteItems.length);
  }, [favoriteItems]);

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
        persistor.purge(); // xóa toàn bộ dữ liệu đã lưu
        setTotal(0);
        dispatch(resetFavorites());
        navigate("/");
      },
    }),
    [dispatch, navigate, fetchCartData, total]
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
                <li onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                  Trang chủ
                </li>
                <li
                  onClick={() => navigate("/levents/about")}
                  style={{ cursor: "pointer" }}
                >
                  Thông tin
                </li>
                <li
                  onClick={() => {
                    const section = document.querySelector("#services");
                    section?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Dịch vụ
                </li>
                <li
                  onClick={() => {
                    const section = document.querySelector("#contact");
                    section?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Liên hệ
                </li>
              </ul>
            </nav>
          )}

          <div className="header-nav-icon">
            {token && (
              <>
                <CustomTooltip title="Thông báo">
                  <Badge
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#000",
                        color: "#fff",
                      },
                    }}
                  >
                    <NotificationDropdown />
                  </Badge>
                </CustomTooltip>
                <CustomTooltip title="Tin nhắn">
                  <IconButton color="inherit">
                    <Badge
                      badgeContent={0}
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
              </>
            )}

            <CustomTooltip title="Giỏ hàng">
              <IconButton color="inherit">
                <Badge
                  badgeContent={total}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#000",
                      color: "#fff",
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

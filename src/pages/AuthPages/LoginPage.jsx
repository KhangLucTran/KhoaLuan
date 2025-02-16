import "../../styles/LoginPage.css";

import LoginForm from "../../components/Form/LoginForm";
import SocialButton from "../../components/Button/SocialButton";
import ModeSelect from "../../components/ModeSelect/ModeSelect";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightTwoToneIcon from "@mui/icons-material/ChevronRightTwoTone";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";

import { itemLoginData } from "../../constants/LoginData";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAuthTokens } from "../../utils/token";
import { showErrorToast, showSuccessToast } from "../../components/Toast/Toast";
import { fetchUserInfo } from "../../features/user/userSlice";

const LoginPage = () => {
  // Dispatch
  const dispatch = useDispatch();

  // Navigate
  const navigate = useNavigate();

  // Location
  const location = useLocation();

  // useRef
  const intervalRef = useRef(null);

  // Xử lí khi bấm "Đăng nhập"
  // Nếu đang trong quá trình xử lí, disable các button
  const { isLoading } = useSelector((state) => state.auth);

  // Xử lý Background tự động thay đổi sao 5s
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % itemLoginData.length
      );
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Button "Ảnh tiếp theo"
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % itemLoginData.length);
  };

  // Button "Trở về ảnh trước"
  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + itemLoginData.length) % itemLoginData.length
    );
  };

  // Xử lí nút Đăng nhập
  const handleLoginSubmit = async (values) => {
    try {
      // Dùng dispatch gọi đến API login trong Redux
      const response = await dispatch(loginUser(values)).unwrap();
      console.log("🔥 Response từ API Login:", response); // Kiểm tra response

      if (response.access_token) {
        // Thông báo đăng nhập thành công
        showSuccessToast("Đăng nhập thành công!");

        const redirectUrl = location.state?.from || "/";
        // Đợi 3 giây rồi chuyển trang
        setTimeout(() => {
          navigate(redirectUrl);
        }, 3000);
      }
    } catch (error) {
      // Xử lý lỗi khi dispatch hoặc lỗi từ API
      showErrorToast(` ${error} 🚨`);
      console.error("🚨 Lỗi:", error);
    }
  };

  // Dùng useEffect để lấy token và refreshToken đăng nhập bằng Google và Facebook
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      // Lưu AccessToken và RefreshToken
      saveAuthTokens(accessToken, refreshToken);
      // Dùng AccessToken để call API: me (Lấy thông tin user đang đăng nhập)
      dispatch(fetchUserInfo());
      // Chuyển hướng về trang chủ
      navigate("/", { replace: true });
    }
  }, [location.search, dispatch, navigate]);

  // Giao diện Trang Login
  return (
    <>
      {/* Chế độ Dark/Light */}
      <div className="login-page-modee">
        <ModeSelect className="login-page-mode-select" />
      </div>

      {/* Login Container */}
      <div className="login-container">
        {/* Hình nền đăng nhập */}
        <div
          className="login-page-image"
          style={{
            backgroundImage: `url(${itemLoginData[currentImageIndex].img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Nút chuyển ảnh */}
          <button onClick={handlePrevImage} className="image-nav-button">
            <ChevronLeftIcon />
          </button>
          <button onClick={handleNextImage} className="image-nav-button">
            <ChevronRightTwoToneIcon />
          </button>

          {/* Dấu chấm chỉ số */}
          <div className="dot-indicator-container">
            {itemLoginData.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentImageIndex ? "active" : ""}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Form đăng nhập */}
        <div className="login-page-form">
          <div className="login-page-form-title">
            <h3>Levents</h3>
            <h1>Đăng nhập</h1>
            <div className="login-page-form-infor">
              <p>
                Chào mừng đến với Levents.
                <br />
                Vui lòng nhập thông tin đăng nhập bên dưới để sử dụng ứng dụng.
              </p>
            </div>
          </div>

          {/* Đăng nhập bằng mạng xã hội */}
          <div className="login-page-form-social">
            <SocialButton disable={isLoading} />
          </div>

          {/* Hoặc */}
          <div className="login-page-form-divider">
            <hr />
            <span>hoặc</span>
            <hr />
          </div>

          {/* Form đăng nhập */}
          <LoginForm onSubmit={handleLoginSubmit} />

          {/* Quên mật khẩu */}
          <CustomTooltip title="Bạn quên mật khẩu? Bấm vào đây để đặt lại mật khẩu.">
            <p
              className="login-page-form-forgot-password"
              style={
                isLoading
                  ? { pointerEvents: "none", opacity: 0.5 }
                  : { pointerEvents: "auto", opacity: 1 }
              }
            >
              <a href="/levents/forgot/password">Quên mật khẩu?</a>
            </p>
          </CustomTooltip>

          {/* Đăng ký */}
          <CustomTooltip title="Bấm vào đây để Đăng Ký">
            <p
              className="login-page-form-register"
              style={
                isLoading
                  ? { pointerEvents: "none", opacity: 0.5 }
                  : { pointerEvents: "auto", opacity: 1 }
              }
            >
              Bạn chưa có tài khoản? <a href="/levents/register">Đăng ký</a>
            </p>
          </CustomTooltip>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

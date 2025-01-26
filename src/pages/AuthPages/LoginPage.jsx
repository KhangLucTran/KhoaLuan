import "../../styles/LoginPage.css";
import "../../styles/Tooltip.css";

import LoginForm from "../../components/Form/LoginForm";
import SocialButton from "../../components/Button/SocialButton";
import ModeSelect from "../../components/ModeSelect/ModeSelect";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightTwoToneIcon from "@mui/icons-material/ChevronRightTwoTone";

import { itemLoginData } from "../../constants/LoginData";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  // Xử lí Background
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Background Tiếp theo
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % itemLoginData.length);
  };
  // Background Trước
  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + itemLoginData.length) % itemLoginData.length
    );
  };

  // Xử lí nút "Đăng nhập" của Form Login
  const handleLoginSubmit = (values) => {
    dispatch(loginUser(values));
  };

  return (
    <>
      {/* Div: Mode Select */}
      <div className="login-page-modee">
        <ModeSelect className="login-page-mode-select" />
      </div>
      {/* Login Container */}
      <div className="login-container">
        {/* Image Background Login  */}
        <div
          className="login-page-image"
          style={{
            backgroundImage: `url(${itemLoginData[currentImageIndex].img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Nút trái */}
          <button onClick={handlePrevImage} className="image-nav-button">
            <ChevronLeftIcon />
          </button>
          {/* Nút phải */}
          <button onClick={handleNextImage} className="image-nav-button">
            <ChevronRightTwoToneIcon />
          </button>

          {/* Dấu chấm chỉ sốsố */}
          <div className="dot-indicator-container">
            {itemLoginData.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentImageIndex ? "active" : ""}`}
              ></div>
            ))}
          </div>
        </div>
        {/* Div: Form Login */}
        <div className="login-page-form">
          <div className="login-page-form-title">
            <h3>Levents</h3>
            <h1>Đăng nhập</h1>
            <div className="login-page-form-infor">
              <p>
                Chào mừng đến với Levents.
                <br />
                Vui lòng nhập thông tin đăng nhập bên dưới để sử duụng ứng dụng.
              </p>
            </div>
          </div>
          {/* Socical ButtonsButtons */}
          <div className="login-page-form-social">
            <SocialButton />
          </div>
          <div className="login-page-form-divider">
            <hr />
            <span>hoặc</span>
            <hr />
          </div>
          {/* Login Form */}
          <LoginForm onSubmit={handleLoginSubmit} />
          {isLoading && <p>Đang đăng nhập...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {/* Forgot Password? */}
          <p
            className="login-page-form-forgot-password tooltip"
            data-tooltip="Bạn quên mật khẩu? Vui lòng bấm vào đây để tạo mật khẩu mới"
          >
            Quên mật khẩu?
          </p>
          <p className="login-page-form-register">
            Bạn chưa có tài khoản?{" "}
            <a
              href="/levents/register"
              className="tooltip"
              data-tooltip="Bấm vào đây để Đăng ký"
            >
              Đăng ký
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

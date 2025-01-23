import "../../styles/Tooltip.css";
import "../../styles/RegisterPage.css";
import SocialButton from "../../components/Button/SocialButton";
import RegisterForm from "../../components/Form/RegisterForm";
import ModeSelect from "../../components/ModeSelect/ModeSelect";
import ImageBackground from "../../components/ImageList/ImageBackground";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  // Xử lí nút "Đăng nhập" của Form Login
  const handleRegisterSubmit = (values) => {
    console.log("Login with object:", values);
  };

  return (
    <>
      {/* Div: Mode Select */}
      <div className="register-page-mode">
        <ModeSelect className="register-page-mode-select" />
      </div>
      {/* register Container */}
      <div className="register-container">
        <div className="register-page-comeback">
          <Link
            to="/levents/login"
            className="register-not-found-button tooltip"
            data-tooltip="Nhấn để quay về trang đăng nhập"
          >
            <ArrowLeftIcon fontSize="large" />
          </Link>
        </div>
        {/* Div: Form Register */}
        <div className="register-page-form">
          <div className="register-page-form-title">
            <h3>Levents</h3>
            <h1>Đăng ký</h1>
            <div className="register-page-form-infor">
              <p>
                Chào mừng đến với Levents.
                <br />
                Vui lòng đăng ký tài khoản để trải nghiệm các ưu đãi và sản phẩm
                của Levents.
              </p>
            </div>
          </div>
          {/* register Form */}
          <RegisterForm onSubmit={handleRegisterSubmit} />
          {/* Socical Buttons */}
          <div className="register-page-form-social">
            <SocialButton />
          </div>
        </div>

        {/* Multi-Image Background */}
        <div className="register-page-images">
          <ImageBackground />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;

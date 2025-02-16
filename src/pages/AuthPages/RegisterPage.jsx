import "../../styles/RegisterPage.css";
import SocialButton from "../../components/Button/SocialButton";
import RegisterForm from "../../components/Form/RegisterForm";
import ModeSelect from "../../components/ModeSelect/ModeSelect";
import ImageBackground from "../../components/ImageList/ImageBackground";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import { showErrorToast, showSuccessToast } from "../../components/Toast/Toast";
import { ToastContainer } from "react-toastify";
import { sendMailApi } from "../../features/auth/authApi";

const RegisterPage = () => {
  // Sử dụng dispatch
  const dispatch = useDispatch();

  // Hooks điều hướng và lấy location state
  const navigate = useNavigate();
  const location = useLocation();

  // Xử lý nút "Đăng ký" của Form Register
  const handleRegisterSubmit = async (values) => {
    try {
      // Gọi API đăng ký thông qua Redux
      const response = await dispatch(registerUser(values)).unwrap();
      console.log("🔥 Response từ API Register:", response);

      // Kiểm tra nếu có access_token trong response
      if (response) {
        showSuccessToast("Đăng ký thành công!");

        // Gửi email xác thực nhưng không ảnh hưởng đến luồng chính nếu có lỗi
        try {
          // Gọi API gửi mail xác nhận
          await sendMailApi(values.email);
          showSuccessToast("Email xác thực đã được gửi!");
        } catch (error) {
          console.error("🚨 Lỗi gửi mail xác thực:", error);
          showErrorToast("Không thể gửi email xác thực. Vui lòng thử lại sau!");
        }

        // Chuyển hướng sau khi hoàn tất
        const redirectUrl = location.state?.from || "/levents/login";

        // Đợi 3 giây rồi chuyển trang Login
        setTimeout(() => {
          navigate(redirectUrl);
        }, 3000);
      }
    } catch (error) {
      showErrorToast(` ${error} 🚨`);
      console.error("🚨 Lỗi:", error);
    }
  };

  return (
    <>
      {/* Div: Mode Select */}
      <ToastContainer />
      <div className="register-page-mode">
        <ModeSelect className="register-page-mode-select" />
      </div>
      {/* register Container */}
      <div className="register-container">
        <div className="register-page-comeback">
          <CustomTooltip title="Nhấn để quay về trang đăng nhập">
            <Link to="/levents/login" className="register-not-found-button">
              <ArrowLeftIcon fontSize="large" />
            </Link>
          </CustomTooltip>
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
          {/* Register Form */}
          <RegisterForm onSubmit={handleRegisterSubmit} />
          {/* Social Buttons */}
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

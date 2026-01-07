import "../../styles/RegisterPage.css";
import SocialButton from "../../components/Button/SocialButton";
import RegisterForm from "../../components/Form/RegisterForm";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import { showErrorToast, showSuccessToast } from "../../components/Toast/Toast";
import { ToastContainer } from "react-toastify";
import { sendMailApi } from "../../features/auth/authApi";
import bgRegister from "../../assets/bg12.jpg";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRegisterSubmit = async (values) => {
    try {
      const response = await dispatch(registerUser(values)).unwrap();
      console.log("🔥 Response từ API Register:", response);

      if (response) {
        showSuccessToast("Đăng ký thành công!");

        try {
          await sendMailApi(values.email);
          showSuccessToast("Email xác thực đã được gửi!");
        } catch (error) {
          console.error("🚨 Lỗi gửi mail xác thực:", error);
          showErrorToast("Không thể gửi email xác thực. Vui lòng thử lại sau!");
        }

        const redirectUrl = location.state?.from || "/levents/login";
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
      <ToastContainer />
      <div className="register-container">
        {/* Form Đăng ký */}
        <div className="register-page-form">
          <div className="register-page-form-title">
            <h3>Levents</h3>
            <h1>Đăng ký</h1>
            <div className="register-page-form-infor">
              <p>
                Chào mừng bạn đến với Levents.
                <br />
                Vui lòng đăng ký tài khoản để tận hưởng các ưu đãi và trải
                nghiệm sản phẩm từ Levents.
              </p>
            </div>
          </div>

          {/* Đăng ký với MXH */}
          <div className="register-page-form-social">
            <SocialButton />
          </div>

          {/* Form Đăng ký */}
          <RegisterForm onSubmit={handleRegisterSubmit} />
          <CustomTooltip title="Nhấn để đăng nhập">
            <p className="login-page-form-register">
              Bạn đã có tài khoản? <a href="/levents/login">Đăng nhập ngay</a>
            </p>
          </CustomTooltip>
        </div>

        {/* Ảnh nền */}
        <div className="register-page-images">
          <img src={bgRegister} alt="Background" />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;

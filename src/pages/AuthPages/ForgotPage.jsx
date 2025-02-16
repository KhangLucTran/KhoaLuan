import Header from "../../components/header/Header";
// import ForgotForm from "../../components/Form/ForgotForm";
import "../../styles/ForgotPage.css";
import PasswordResetStepper from "./PasswordResetStepper";
// import { forgotPassword } from "../../features/auth/authApi";
// import { showSuccessToast, showErrorToast } from "../../components/Toast/Toast";
// import { useNavigate } from "react-router-dom";

const ForgotPage = () => {
  // useNavigate
  // const navigate = useNavigate();

  // Xử lý quên mật khẩu
  // const handleForgotSubmit = async (values) => {
  //   try {
  //     const response = await forgotPassword({ email: values.email });
  //     console.log("🔥 Response từ API ForgotPassword:", response); // Kiểm tra response
  //     showSuccessToast(
  //       "Liên kết đặt lại mật khẩu đã được gửi vào email của bạn!"
  //     );
  //     const redirectUrl = location.state?.from || "/levents/otp";
  //     // Đợi 3 giây rồi chuyển trang
  //     setTimeout(() => {
  //       navigate(redirectUrl);
  //     }, 3000);
  //   } catch (error) {
  //     showErrorToast(
  //       error.response?.data?.message ||
  //         "Không thể gửi yêu cầu, vui lòng thử lại sau!"
  //     );
  //   }
  // };

  return (
    <>
      <Header />
      <div className="forgot-page-layout">
        <div className="forgot-page-container">
          <div className="forgot-page-container-title">
            <h1>Levents &copy;</h1>
            <h3>Quên mật khẩu?</h3>
            <h5>
              Hãy làm theo hướng dẫn để lấy lại quyền truy cập vào tài khoản của
              bạn.
            </h5>
            <div className="forgot-page-container-image"></div>
          </div>
          <div className="forgot-page-container-form">
            <PasswordResetStepper />
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPage;

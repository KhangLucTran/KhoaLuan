import Header from "../../components/Header/Header";
import PasswordResetStepper from "./PasswordResetStepper";
import "../../styles/ForgotPage.css";

const ForgotPage = () => {
  return (
    <>
      <Header hideNav={true} />
      <div className="forgot-page-layout">
        <div className="forgot-page-container">
          <div className="forgot-page-container-title">
            <h1>Levents &copy;</h1>
            <h3 className="forgot-pgae-container-h3">Quên mật khẩu?</h3>
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

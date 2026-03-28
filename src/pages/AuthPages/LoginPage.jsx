import "../../styles/LoginPage.css";
import LoginForm from "../../components/Form/LoginForm";
// import ImageBackground from "../../components/ImageList/ImageBackground";
import SocialButton from "../../components/Button/SocialButton";
import ModeSelect from "../../components/ModeSelect/ModeSelect";

const LoginPage = () => {
  const handleLoginSubmit = (values) => {
    console.log("Login with object:", values);
  };

  return (
    <>
      <div className="login-page-modee">
        <ModeSelect className="login-page-mode-select" />
      </div>
      <div className="login-container">
        <div className="login-page-image">{/* <ImageBackground /> */}</div>
        <div className="login-page-form">
          <div className="login-page-form-title">
            <h3>Levents</h3>
            <h1>Login Account</h1>
            <div className="login-page-form-infor">
              <p>
                Chào mừng đến với Levents.
                <br />
                Vui lòng nhập thông tin đăng nhập bên dưới để sử duụng ứng dụng.
              </p>
            </div>
          </div>
          <div className="login-page-form-social">
            <SocialButton />
          </div>
          <div className="login-page-form-divider">
            <hr />
            <span>hoặc</span>
            <hr />
          </div>
          <LoginForm onSubmit={handleLoginSubmit} />
        </div>
      </div>
    </>
  );
};

export default LoginPage;

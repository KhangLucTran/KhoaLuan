// LoginForm.jsx
import AuthForm from "../Form/AuthForm";
import { loginFields } from "../../constants/LoginData";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const LoginForm = ({ onSubmit }) => {
  const { isLoading } = useSelector((state) => state.auth);

  return (
    <AuthForm
      className="login-form"
      fields={loginFields}
      onSubmit={onSubmit}
      buttonText={isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      layout="column"
      isSubmitting={isLoading}
    />
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default LoginForm;

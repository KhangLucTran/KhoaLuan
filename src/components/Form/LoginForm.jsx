// LoginForm.jsx
import AuthForm from "../Form/AuthForm";
import { loginFields } from "../../constants/LoginData";
import PropTypes from "prop-types";

const LoginForm = ({ onSubmit }) => {
  return (
    <AuthForm
      className="login-form"
      fields={loginFields}
      onSubmit={onSubmit}
      buttonText="Đăng nhập"
      layout="column"
    />
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default LoginForm;

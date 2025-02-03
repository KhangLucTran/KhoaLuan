import AuthForm from "./AuthForm";
import { registerFields } from "../../constants/RegisterData";
import PropTypes from "prop-types";

const RegisterForm = ({ onSubmit }) => {
  return (
    <AuthForm
      className="register-form"
      fields={registerFields}
      onSubmit={onSubmit}
      buttonText="Đăng ký"
      layout="column"
    />
  );
};

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default RegisterForm;

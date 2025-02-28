import AuthForm from "./AuthForm";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { registerFields } from "../../constants/RegisterData";

const RegisterForm = ({ onSubmit }) => {
  const isLoading = useSelector((state) => state.auth.isLoading);

  return (
    <AuthForm
      className="register-form"
      fields={registerFields}
      onSubmit={onSubmit}
      buttonText={isLoading ? "Đang đăng ký..." : "Đăng ký"}
      layout="column"
      isSubmitting={isLoading}
    />
  );
};

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default RegisterForm;

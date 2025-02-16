// ForgotForm.jsx
import AuthForm from "../Form/AuthForm";

import PropTypes from "prop-types";
import { forgotFields } from "../../constants/ForgotData";

const ForgotForm = ({ onSubmit }) => {
  return (
    <AuthForm
      className="forgot-form"
      fields={forgotFields}
      onSubmit={onSubmit}
      buttonText={"Gửi yêu cầu"}
      layout="column"
    />
  );
};

ForgotForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ForgotForm;

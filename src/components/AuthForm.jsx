import { useState } from "react";
import { validateForm } from "../utils/validation";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

const AuthForm = ({ fields, onSubmit, buttonText }) => {
  const [formValues, setFormValues] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Reset lỗi khi người dùng thay đổi
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onSubmit(formValues);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      {fields.map((field) => (
        <InputField
          key={field.name}
          id={`input-${field.name}`}
          label={field.label}
          type={field.type}
          value={formValues[field.name]}
          autoComplete={field.autoComplete}
          icon={field.icon}
          error={!!formErrors[field.name]}
          helperText={formErrors[field.name]}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
          isPasswordField={field.type === "password"}
        />
      ))}
      <SubmitButton text={buttonText} onClick={handleSubmit} />
    </Box>
  );
};

AuthForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      autoComplete: PropTypes.string,
      icon: PropTypes.element,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default AuthForm;

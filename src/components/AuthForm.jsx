import { useCallback, useState } from "react";
import { validateField } from "../utils/validation";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

const AuthForm = ({
  fields,
  onSubmit,
  buttonText,
  className,
  sx,
  layout = "column",
}) => {
  const [formValues, setFormValues] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [formErrors, setFormErrors] = useState({});

  // Dùng useCallBack cho handleInputChange: tránh tạo lại hàm mỗi lần render
  const handleInputChange = useCallback(
    (name, value) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      const error = validateField(name, value);
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    },
    [setFormValues, setFormErrors]
  );

  // Dùng useCallBack cho handleSubmit: tránh tạo lại hàm mỗi lần render
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const errors = {};
      fields.forEach((field) => {
        const error = validateField(field.name, formValues[field.name]);
        if (error) {
          errors[field.name] = error;
        }
      });

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      onSubmit(formValues);
    },
    [fields, formValues, onSubmit]
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className={className}
      sx={{
        display: "flex",
        flexDirection: layout,
        gap: 2,
        ...sx,
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

      <SubmitButton
        variant="contained"
        text={buttonText}
        onClick={handleSubmit}
        color="theme.palette.primary"
      />
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
  className: PropTypes.string,
  sx: PropTypes.object,
  layout: PropTypes.oneOf(["row", "column"]),
};

AuthForm.defaultProps = {
  className: "",
  sx: {},
  layout: "column",
};

export default AuthForm;

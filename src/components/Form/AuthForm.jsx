// File: components/AuthForm.js
import { useCallback } from "react";
import { useForm } from "../../hooks/useForm";

import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import InputField from "../Input/InputField";
import SubmitButton from "../Button/SubmitButton";

const AuthForm = ({ fields, onSubmit, buttonText, sx, layout = "column" }) => {
  const { formValues, formErrors, handleInputChange, validateForm } =
    useForm(fields);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const errors = validateForm(formValues);
      if (Object.keys(errors).length > 0) {
        return;
      }
      onSubmit(formValues);
    },
    [formValues, validateForm, onSubmit]
  );

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "grid",
          gridTemplateColumns:
            layout === "row" ? "repeat(auto-fit, minmax(200px, 1fr))" : "1fr",
          gap: 2,
          ...sx,
          mb: 3,
        }}
      >
        {fields.map((field) => (
          <InputField
            key={field.name}
            id={`input-${field.name}`}
            width={field.width}
            label={field.label}
            type={field.type}
            value={formValues[field.name]}
            autoComplete={field.autoComplete}
            icon={<field.icon fontSize="small" />}
            error={!!formErrors[field.name]}
            helperText={formErrors[field.name]}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            isPasswordField={field.type === "password"}
          />
        ))}
      </Box>
      <SubmitButton
        variant="contained"
        text={buttonText}
        onClick={handleSubmit}
        disabled={Object.keys(formErrors).some((key) => !!formErrors[key])}
        sx={{
          width: 280,
          color: "#fff",
          borderRadius: 3,
          backgroundColor: (theme) =>
            Object.keys(formErrors).length > 0
              ? theme.palette.grey[400]
              : theme.palette.primary.main,
        }}
      />
    </>
  );
};

AuthForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      width: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      autoComplete: PropTypes.string,
      icon: PropTypes.element,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  sx: PropTypes.object,
  layout: PropTypes.oneOf(["row", "column"]),
};

AuthForm.defaultProps = {
  sx: {},
  layout: "column",
};

export default AuthForm;

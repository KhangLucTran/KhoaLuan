import { useCallback, useEffect } from "react";
import { useForm } from "../../hooks/useForm";

import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import InputField from "../Input/InputField";
import SubmitButton from "../Button/SubmitButton";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const AuthForm = ({
  fields,
  onSubmit,
  buttonText,
  sx,
  layout = "column",
  initialValues = {},
}) => {
  const {
    formValues,
    formErrors,
    handleInputChange,
    validateForm,
    setFormValues,
  } = useForm(fields, initialValues);

  // Cập nhật formValues khi `initialValues` thay đổi
  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...initialValues,
    }));
  }, [initialValues, setFormValues]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const errors = validateForm(formValues);
      console.log("Validation Errors:", errors);
      if (Object.keys(errors).length > 0) return;
      onSubmit(formValues);
    },
    [formValues, validateForm, onSubmit]
  );

  console.log("Current Form Values:", formValues);
  console.log("Current Form Errors:", formErrors);

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
        {fields.map((field) => {
          if (field.type === "radio") {
            return (
              <FormControl key={field.name} component="fieldset">
                <FormLabel>{field.label}</FormLabel>
                <RadioGroup
                  row
                  name={field.name}
                  value={formValues[field.name] || ""}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                >
                  {field.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            );
          }

          if (field.type === "date") {
            return (
              <DatePicker
                key={field.name}
                label={field.label}
                value={
                  formValues[field.name] ? dayjs(formValues[field.name]) : null
                }
                onChange={(date) =>
                  handleInputChange(
                    field.name,
                    date ? date.format("YYYY-MM-DD") : ""
                  )
                }
                sx={{
                  width: field.width,
                  "& .MuiInputBase-root": {
                    height: field.height,
                  },
                }}
              />
            );
          }

          return (
            <InputField
              key={field.name}
              id={`input-${field.name}`}
              width={field.width}
              height={field.height}
              label={field.label}
              type={field.type}
              value={formValues[field.name] || ""}
              autoComplete={field.autoComplete}
              icon={field.icon ? <field.icon fontSize="small" /> : null}
              error={!!formErrors[field.name]}
              helperText={formErrors[field.name]}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              isPasswordField={field.type === "password"}
            />
          );
        })}
      </Box>

      <SubmitButton
        variant="contained"
        text={buttonText}
        onClick={(e) => handleSubmit(e)}
        // disabled={Object.keys(formErrors).some((key) => !!formErrors[key])}
        sx={{
          width: 280,
          color: "#fff",
          borderRadius: 2,
          backgroundColor: (theme) => theme.palette.primary.main,
        }}
      />
    </>
  );
};

AuthForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      width: PropTypes.string,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      autoComplete: PropTypes.string,
      icon: PropTypes.elementType,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  sx: PropTypes.object,
  layout: PropTypes.oneOf(["row", "column"]),
  initialValues: PropTypes.object,
};

AuthForm.defaultProps = {
  sx: {},
  layout: "column",
  initialValues: {},
};

export default AuthForm;

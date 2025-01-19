import { useTheme } from "@emotion/react";
import React, { useState } from "react";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PropTypes from "prop-types";

const InputField = ({
  id,
  width,
  label,
  type,
  value,
  onChange,
  autoComplete,
  icon,
  error,
  helperText,
  isPasswordField,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Đảo ngược trạng thái showPassword
  };

  return (
    <TextField
      InputProps={{
        sx: {
          borderRadius: 3,
          width: width,
          height: 50,
          color: theme.palette.text.primary,
        },
        startAdornment: (focused || value) && icon && (
          <InputAdornment position="start">
            {React.cloneElement(icon, {
              style: { color: theme.palette.primary.main },
            })}
          </InputAdornment>
        ),
        endAdornment: isPasswordField && (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleTogglePasswordVisibility}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        sx: {
          fontSize: "0.85rem",
          color: theme.palette.text.secondary,
        },
      }}
      id={id}
      label={label}
      type={isPasswordField && !showPassword ? type : "text"}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      error={error}
      helperText={helperText}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  autoComplete: PropTypes.string.isRequired,
  icon: PropTypes.element,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isPasswordField: PropTypes.bool, // Prop để kiểm tra input có phải là password field không
};

InputField.defaultProps = {
  isPasswordField: false,
};

export default InputField;

import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useState } from "react";

const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  icon,
}) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <TextField
      InputProps={{
        sx: {
          borderRadius: 3,
          width: 250,
        },
        startAdornment: (focused || value) && (
          <InputAdornment position="start">{icon}</InputAdornment>
        ),
      }}
      id={id}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

export default InputField;

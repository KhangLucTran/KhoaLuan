import React from "react";
import { useState } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import Box from "@mui/material/Box";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";

const AuthForm = ({ onSubmit, buttonText }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        "& > :not(style)": { m: 1 },
      }}
    >
      {/* Email */}
      <InputField
        id="outlined-email-input"
        label="Email"
        type="email"
        value={email}
        autoComplete="current-email"
        icon={<EmailIcon fontSize="small" />}
        onChange={(e) => setEmail(e.target.value)}
      />
      {/* Password */}
      <InputField
        id="outlined-password-input"
        label="Password"
        type="password"
        value={password}
        autoComplete="current-password"
        icon={<PasswordIcon fontSize="small" />}
        onChange={(e) => setPassword(e.target.value)}
      />
    </Box>
  );
};

export default AuthForm;

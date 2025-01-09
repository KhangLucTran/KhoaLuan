// Check Validation

// 1. Check Validate Email.
export const validateEmail = (email) => {
  if (!email) return "Email không được để trống!";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Email không hợp lệ!";
  return null;
};

// 2. Check Validate Password
export const validatePassword = (password) => {
  if (!password) return "Mật khẩu không được để trống!";
  if (password.lenght < 6) return "Mật khẩu phải có ít nhất 6 kí tự";
  if (!/[A-Z]/.test(password))
    return "Mật khẩu phải có ít nhất 1 chữ cái in hoa!";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Mật khẩu phải có ít nhất 1 ký tự đặc biệt!";
  return null;
};

export const validateForm = (fields) => {
  const errors = {};
  if ("email" in fields) {
    const emailError = validateEmail(fields.email);
    if (emailError) errors.email = emailError;
  }
  if ("password" in fields) {
    const passwordError = validatePassword(fields.password);
    if (passwordError) errors.password = passwordError;
  }
  return errors;
};

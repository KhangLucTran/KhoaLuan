// Check Validation

// 1. Check Validate Email.
export const validateEmail = (email) => {
  if (!email) return "Email không được để trống!";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Định dạng email cơ bản
  if (!emailRegex.test(email)) return "Email không hợp lệ!";
  return null; // Không có lỗi
};

// 2. Check Validate Password
export const validatePassword = (password) => {
  if (!password) return "Mật khẩu không được để trống!";
  if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự!";
  if (!/[A-Z]/.test(password))
    return "Mật khẩu phải có ít nhất 1 chữ cái in hoa!";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Mật khẩu phải có ít nhất 1 ký tự đặc biệt!";
  return null; // Không có lỗi
};

// 3. Check Validate Username
export const validateUsername = (username) => {
  if (!username) return "Tên tài khoản không được để trống!";
  if (username.length < 3) return "Tên tài khoản phải có ít nhất 3 kí tự!";
  return null;
};

// 4. Check Valiate Numberphone
export const validateNumberphone = (numberphone) => {
  if (!numberphone) return "Số điện thoại không được để trống!";
  const phoneRegex = /^0[0-9]{8,10}$/;
  if (!phoneRegex.test(numberphone))
    return "Số điện thoại phải bắt đầu bằng 0 và có từ 9 đến 11 chữ số!";
  return null;
};

// 4. Kiểm tra hợp lệ từng trường
export const validateField = (name, value) => {
  if (name === "email") return validateEmail(value);
  if (name === "password") return validatePassword(value);
  if (name === "username") return validateUsername(value);
  if (name === "numberphone") return validateNumberphone(value);
  return "Trường này không hợp lệ!";
};

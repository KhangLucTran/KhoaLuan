import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/auth"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API login
export const loginApi = async (credentials) => {
  try {
    const response = await api.post(`${API_URL}/login`, credentials);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Đăng nhập không thành công"
    );
  }
};

// Gọi API register
export const registerApi = async (credentials) => {
  try {
    const response = await api.post(`${API_URL}/register`, credentials);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Đăng ký không thành công"
    );
  }
};

// Gọi API sendMailVerify
export const sendMailApi = async (credentials) => {
  try {
    await api.post(`${API_URL}/send-mail-verify/${credentials}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Không thể gửi email xác thực"
    );
  }
};

// Gọi API forgotPassword
export const forgotPassword = async (credentials) => {
  try {
    const response = await api.post(`${API_URL}/forgot-password`, credentials);
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Không thể gửi email đổi mật khẩu"
    );
  }
};

// Gọi API verifyOTP
export const otpApi = async (credentials) => {
  try {
    const response = await api.post(`${API_URL}/verify-otp`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Khôg thể xác thực OTP");
  }
};

// Gọi API resetPassword
export const resetApi = async (credentials) => {
  try {
    const response = await api.post(`${API_URL}/reset-password`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Khôg thể đổi mật khẩu");
  }
};

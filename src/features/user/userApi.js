import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/user"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API lấy thông tin người dùng đang đăng nhập
export const getUserInfo = async () => {
  try {
    const response = await api.get(`${API_URL}/me`);
    console.log("🔥 Dữ liệu User vừa đăng nhập:", response.data);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Không thể lấy thông tin người dùng đang đăng nhập"
    );
  }
};

// Gọi API chỉnh sửa thông tin người dùng đang đăng nhập
export const updateInfo = async (credentials) => {
  try {
    // Gửi dữ liệu updateData dưới dạng body của request PUT
    const response = await api.put(`${API_URL}/update/me`, credentials);
    console.log("🔥 Dữ liệu User vừa chỉnh sửa:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Không chỉnh sửa thông tin người dùng đang đăng nhập"
    );
  }
};

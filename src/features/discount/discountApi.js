import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/discount"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API lấy danh sách sản phẩm yêu thích cảu USERID
export const getDiscountApi = async () => {
  try {
    const response = await api.get(`${API_URL}/getall-discount`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách phẩm yêu thích không thành công"
    );
  }
};

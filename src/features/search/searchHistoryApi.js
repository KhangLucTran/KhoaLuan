import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/search"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API Lấy tất cả sản phẩm
export const addKeyWordsApi = async (credentials) => {
  try {
    const response = await api.post(`${API_URL}/`, credentials);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Thêm keyword không thành công"
    );
  }
};

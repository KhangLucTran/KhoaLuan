import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/product"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API Lấy tất cả sản phẩm
export const getAllProductsApi = async () => {
  try {
    const response = await api.get(`${API_URL}/getall-product`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách sản phẩmphẩm không thành công"
    );
  }
};

// Gọi API lấy sản phẩm theo ID
export const getProductByIdApi = async (credentials) => {
  try {
    const response = await api.get(`${API_URL}/get-product/${credentials}`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Đăng nhập không thành công"
    );
  }
};

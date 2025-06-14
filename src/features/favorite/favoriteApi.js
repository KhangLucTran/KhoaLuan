import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/favorite"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API lấy danh sách sản phẩm yêu thích cảu USERID
export const getFavoriteUserApi = async () => {
  try {
    const response = await api.get(`${API_URL}/`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách phẩm yêu thích không thành công"
    );
  }
};

// Gọi API thêm sản phẩm yêu thích của USERID
export const addFavoriteUserApi = async (productId) => {
  try {
    const response = await api.post(`${API_URL}/`, { productId });
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách phẩm yêu thích không thành công"
    );
  }
};

// Gọi API kiểm tra trạng thái yêu thích
export const checkStatusFavoriteUserApi = async (productId) => {
  try {
    const response = await api.get(`${API_URL}/${productId}`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách phẩm yêu thích không thành công"
    );
  }
};

// Gọi API xóa sản phẩm ra danh sách yêu thích
export const deleteFavoriteUserApi = async (productId) => {
  try {
    console.log(productId);
    const response = await api.delete(`${API_URL}/delete-by-prouse`, {
      data: { productId },
    });
    console.log(response);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách phẩm yêu thích không thành công"
    );
  }
};



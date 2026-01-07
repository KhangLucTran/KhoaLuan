import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/recommendations"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API Lấy tất cả sản phẩm theo Hệ thống gợi ý:Content-Base
export const getContentBaseRecommendationsApi = async () => {
  try {
    const response = await api.get(`${API_URL}/content-base`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách sản phẩm theo Content-Base không thành công"
    );
  }
};

// Gọi API Lấy tất cả sản phẩm theo Hệ thống gợi ý:Collaborative
export const getCollaborativeRecommendationsApi = async () => {
  try {
    const response = await api.get(`${API_URL}/collaborative`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách sản phẩm theo Collaborative không thành công"
    );
  }
};

// Gọi API Lấy tất cả sản phẩm theo Hệ thống gợi ý:Personalized
export const getPersonalizedRecommendationsApi = async () => {
  try {
    const response = await api.get(`${API_URL}/personalized`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách sản phẩm theo Personalized không thành công"
    );
  }
};

// Gọi API Lấy tất cả sản phẩm theo Hệ thống gợi ý:Tổng hợp
export const getRecommendationsApi = async () => {
  try {
    const response = await api.get(`${API_URL}/`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy danh sách sản phẩm không thành công"
    );
  }
};

import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/lineitem"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API tạo Lineitem
export const createLineitemApi = async (credentials) => {
  try {
    const response = await api.post(`${API_URL}/add-lineitem`, credentials);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách sản phẩmphẩm không thành công"
    );
  }
};

// Gọi APi lấy Lineitem theo id
export const getLineitemApi = async (credentials) => {
  try {
    const response = await api.get(`${API_URL}/get-lineitem/${credentials}`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách sản phẩmphẩm không thành công"
    );
  }
};

// Gọi APi xóa LineItem theo id
export const deleteLineitemApi = async (credentials) => {
  try {
    const response = await api.delete(
      `${API_URL}/delete-lineitem/${credentials}`
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách sản phẩmphẩm không thành công"
    );
  }
};

// Gọi API update lineitme theo Id
export const updateLineitemApi = async (id, updates) => {
  try {
    const response = await api.put(`${API_URL}/update-lineitem/${id}`, updates);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Cập nhật LineItem không thành công"
    );
  }
};

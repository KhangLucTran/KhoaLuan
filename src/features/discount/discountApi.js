import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/discount"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API lấy danh sách sản phẩm yêu thích của USERID
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

// 1. Tạo mã giảm giá (Chỉ Admin)
export const createDiscountApi = async (discountData) => {
  try {
    const response = await api.post(`${API_URL}/add-discount`, discountData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Tạo mã giảm giá không thành công"
    );
  }
};

// 3. Lấy mã giảm giá theo ID (Cần token)
export const getDiscountByIdApi = async (id) => {
  try {
    const response = await api.get(`${API_URL}/get-discount/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Không tìm thấy mã giảm giá"
    );
  }
};

// 4. Cập nhật mã giảm giá theo ID (Cần token)
export const updateDiscountApi = async (id, updateData) => {
  try {
    const response = await api.put(
      `${API_URL}/update-discount/${id}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Cập nhật mã giảm giá thất bại"
    );
  }
};

// 5. Xóa mã giảm giá theo ID (Chỉ Admin)
export const deleteDiscountApi = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Xóa mã giảm giá thất bại"
    );
  }
};

// 6. Áp dụng mã giảm giá cho User
export const applyDiscountApi = async (code) => {
  try {
    const response = await api.put(`${API_URL}/use-discount`, { code });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Xóa mã giảm giá thất bại"
    );
  }
};
// 7. Lấy danh sách mã giảm giá đã dùng và chưa dùng của user theo userId
export const getDiscountsByUserApi = async () => {
  try {
    const response = await api.get(`${API_URL}/user`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy mã giảm giá theo user thất bại"
    );
  }
};

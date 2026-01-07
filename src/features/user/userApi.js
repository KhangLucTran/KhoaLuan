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
// Gọi API chỉnh sửa thông tin người dùng đang đăng nhập
export const updateInfoAdmin = async (credentials) => {
  try {
    // Gửi dữ liệu updateData dưới dạng body của request PUT
    const response = await api.put(`${API_URL}/admin/update`, credentials);
    console.log("🔥 Dữ liệu User vừa chỉnh sửa Admin:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Không chỉnh sửa thông tin người dùng đang đăng nhập"
    );
  }
};
// Gọi API chỉnh sửa thông tin người dùng đang đăng nhập
export const updateAvatar = async (formData) => {
  try {
    const response = await api.put("/api/profile/update-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("🔥 Avatar cập nhật thành công:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Không thể cập nhật avatar"
    );
  }
};
// Gọi API lấy danh sách người dùng
export const getAllUsersApi = async () => {
  try {
    // Gửi dữ liệu updateData dưới dạng body của request PUT
    const response = await api.get(`${API_URL}/admin/users`);
    console.log("🔥 Danh sách người dùng lấy thành công:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Không thể lấy danh sách");
  }
};

// Gọi API xóa dữ liệu người dùng
export const deleteUserApi = async (userId) => {
  try {
    // Gửi dữ liệu updateData dưới dạng body của request PUT
    const response = await api.delete(`${API_URL}/admin/delete/${userId}`);
    console.log("🔥 Xóa người dùng thành công:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Không thể xóa người dùng"
    );
  }
};

// Gọi API lấy dữ liệu người dùng theo userId
export const getUserByIdApi = async (userId) => {
  try {
    // Gửi dữ liệu updateData dưới dạng body của request PUT
    const response = await api.post(`${API_URL}/get-users/${userId}`);
    console.log("🔥 Láy người dùng thành công:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Không thể lấy  người dùng"
    );
  }
};

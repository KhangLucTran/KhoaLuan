import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/notification"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API lấy thông báo của người dùng
export const fetchNotificationsApi = async () => {
  try {
    const response = await api.get(`${API_URL}`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách thông báo không thành công"
    );
  }
};

// Gọi API đánh dấu thông báo đã đọc
export const markNotificationAsReadApi = async (notifId) => {
  try {
    const response = await api.patch(`${API_URL}/${notifId}/read`);
    console.log("ID Notif:", notifId);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách thông báo không thành công"
    );
  }
};

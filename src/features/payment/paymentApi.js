import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/payment"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API lấy cart theo userId
export const createPayment = async (paymentData) => {
  try {
    const response = await api.post(
      `${API_URL}/create_payment_url`,
      paymentData
    );
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi tạo thanh toán.");
  }
};
export default { createPayment };

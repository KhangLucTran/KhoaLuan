import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/invoice"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API lấy danh sách hóa đơn theo userId
export const getInvoiceByUserIdApi = async () => {
  try {
    const response = await api.get(`${API_URL}/get-invoice-user`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy danh sách hóa đơn không thành công"
    );
  }
};

// Gọi API update trạng thái của hóa đơn
export const updateStatusInvoiceApi = async (invoiceId, payload) => {
  try {
    const response = await api.put(
      `${API_URL}/update-invoice-status/${invoiceId}`,
      payload
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Cập nhật trạng thái hóa đơn không thành công"
    );
  }
};

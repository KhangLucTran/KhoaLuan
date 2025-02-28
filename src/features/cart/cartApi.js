import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/cart"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API lấy cart theo userId
export const getUserCartApi = async () => {
  try {
    const response = await api.get(`${API_URL}/user-cart`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách sản phẩmphẩm không thành công"
    );
  }
};

// API xóa line item khỏi giỏ hàng (dựa trên cartId và lineItemId)
export const deleteLineItemFromCartApi = async (cartId, lineItemId) => {
  try {
    const response = await api.delete(
      `${API_URL}/cart/${cartId}/line-item/${lineItemId}`
    );
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Xóa line item không thành công"
    );
  }
};

// API lấy tổng số lượng sản phẩm trong giỏ hàng của userId
export const getTotalQuantityApi = async () => {
  try {
    const response = await api.get(`${API_URL}/get-total-cart`);
    console.log("Số lượngL:" + response.data);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy số lượng sản phẩm không thành công"
    );
  }
};

import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Gọi API login
export const loginApi = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

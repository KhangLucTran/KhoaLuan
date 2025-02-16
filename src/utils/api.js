import axios from "axios";
import * as jwtDecodeImport from "jwt-decode";
const jwtDecode = jwtDecodeImport.default || jwtDecodeImport;

// Hàm kiểm tra token hết hạn
const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    // exp tính theo giây, chuyển sang milisecond để so sánh với Date.now()
    return exp * 1000 < Date.now();
  } catch (error) {
    return true; // Nếu decode lỗi, coi như token hết hạn
  }
};

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor xử lý token
api.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("access_token");

    if (accessToken && isTokenExpired(accessToken)) {
      // Nếu access token đã hết hạn, lấy refresh token từ localStorage
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          // Gọi API refresh token
          const response = await axios.post(
            "http://localhost:5000/api/auth/refresh-token",
            { refreshToken }
          );
          // Giả sử API trả về dữ liệu theo định dạng:
          // {
          //   accessToken: "newAccessToken",
          //   refreshToken: { token: "newRefreshToken", expiry: "..." }
          // }
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;
          // Lưu token mới vào localStorage
          localStorage.setItem("access_token", newAccessToken);
          localStorage.setItem("refresh_token", newRefreshToken.token);
          accessToken = newAccessToken;
        } catch (error) {
          // Nếu không refresh được, xóa token và có thể chuyển hướng người dùng đăng nhập lại
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          // Bạn có thể thực hiện hành động logout hoặc thông báo cho người dùng ở đây
          return Promise.reject(error);
        }
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

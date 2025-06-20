import axios from "axios";
import * as jwtDecodeImport from "jwt-decode";
const jwtDecode = jwtDecodeImport.default || jwtDecodeImport;

// Biến lưu trữ promise của refresh token để tránh gọi nhiều lần
let refreshTokenPromise = null;

// Hàm kiểm tra token hết hạn
const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now();
  } catch (error) {
    return true; // Nếu decode lỗi, coi như token hết hạn
  }
};

const api = axios.create({
  baseURL: "https://khoaluan-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Hàm refresh token
const refreshAccessToken = async () => {
  if (!refreshTokenPromise) {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      return Promise.reject(new Error("No refresh token available"));
    }

    // Tạo một promise duy nhất để tránh gọi nhiều lần
    refreshTokenPromise = axios
      .post("https://khoaluan-backend.onrender.com/api/auth/refresh-token", {
        refreshToken,
      })
      .then((response) => {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;
        localStorage.setItem("access_token", newAccessToken);
        localStorage.setItem("refresh_token", newRefreshToken.token);
        return newAccessToken;
      })
      .catch((error) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(error);
      })
      .finally(() => {
        refreshTokenPromise = null; // Xóa biến sau khi hoàn tất
      });
  }
  return refreshTokenPromise;
};

// Interceptor xử lý token
api.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("access_token");

    if (accessToken && isTokenExpired(accessToken)) {
      try {
        accessToken = await refreshAccessToken(); // Đợi token mới
      } catch (error) {
        return Promise.reject(error);
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

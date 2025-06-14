import axios from "axios";
import api from "../../utils/api";

// API gốc của call lấy giá trị tỉnh, huyện, phường
const API_BASE_ONLINE = "https://provinces.open-api.vn/api";

// API ở server
const API_URL = "/api/address";

const addressApi = {
  // API lấy tỉnh
  fetchProvinces: async () => {
    try {
      const res = await axios.get(`${API_BASE_ONLINE}/p`);
      return res.data || [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tỉnh:", error);
      return [];
    }
  },

  // API lấy quận/huyện
  fetchDistricts: async (provinceCode) => {
    try {
      const res = await axios.get(
        `${API_BASE_ONLINE}/p/${provinceCode}?depth=2`
      );
      return res.data.districts || [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách huyện:", error);
      return [];
    }
  },

  // API lấy xã/phường
  fetchWards: async (districtCode) => {
    try {
      const res = await axios.get(
        `${API_BASE_ONLINE}/d/${districtCode}?depth=2`
      );
      return res.data.wards || [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xã/phường:", error);
      return [];
    }
  },

  // API tạo địa chỉ mới
  createAddress: async (credentials) => {
    try {
      const response = await api.post(`${API_URL}/`, credentials);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lưu địa chỉ:", error);
      throw new Error(
        error.response?.data?.message || "Lưu địa chỉ không thành công"
      );
    }
  },

  // API lấy tất cả địa chỉ của User đang đăng nhập
  getAllAddressByUserId: async () => {
    try {
      const response = await api.get(`${API_URL}/get-all`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách địa chỉ:", error);
      throw new Error(
        error.response?.data?.message ||
          "Lấy danh sách địa chỉ của user không thành công"
      );
    }
  },
  // API xóa địa chỉ address của User theo idAddress
  deleteAddressById: async (addressId) => {
    try {
      const response = await api.delete(`${API_URL}/${addressId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa địa chỉ:", error);
      throw new Error(
        error.response?.data?.message || "Chỉnh sửa địa chỉ không thành công"
      );
    }
  },
  setDefaultAddress: async (addressId) => {
    try {
      const response = await api.put(`${API_URL}/set-default/${addressId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa địa chỉ:", error);
      throw new Error(
        error.response?.data?.message || "Chỉnh sửa địa chỉ không thành công"
      );
    }
  },
  getDefaultAddress: async () => {
    try {
      const response = await api.get(`${API_URL}/get-all/isDefault`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ mặc định:", error);
      throw new Error(
        error.response?.data?.message || "Lấy địa chỉ mặc định không thành công"
      );
    }
  },
  editAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`${API_URL}/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa địa chỉ:", error);
      throw new Error(
        error.response?.data?.message || "Chỉnh sửa địa chỉ không thành công"
      );
    }
  },
};

export default addressApi;

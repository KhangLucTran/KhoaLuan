import api from "../../utils/api"; // Import cấu hình Axios

const API_URL = "/api/product"; // Không cần localhost, vì baseURL đã có trong api.js

// Gọi API Lấy tất cả sản phẩm
export const getAllProductsApi = async () => {
  try {
    const response = await api.get(`${API_URL}/getall-product`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy danh sách sản phẩm không thành công"
    );
  }
};

// Gọi API lấy sản phẩm theo ID
export const getProductByIdApi = async (credentials) => {
  try {
    const response = await api.get(`${API_URL}/get-product/${credentials}`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy sản phẩm không thành công"
    );
  }
};

// Gọi API xóa sản phẩm theo ID
export const deleteProductByIdApi = async (productId) => {
  try {
    const response = await api.delete(`${API_URL}/delete-product/${productId}`);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Xóa  sản phẩm theo ID không thành công"
    );
  }
};
// Gọi API thêm sản phẩm mới
export const addProductApi = async (productData, images) => {
  try {
    const formData = new FormData();
    for (const key in productData) {
      formData.append(key, productData[key]);
    }
    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await api.post(`${API_URL}/add-product`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi API:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Thêm sản phẩm không thành công"
    );
  }
};

// Gọi API lấy sản phẩm theo category
export const getProductsByCategoryApi = async (categoryProduct) => {
  try {
    const response = await api.get(
      `${API_URL}/getall-product-category?category=${categoryProduct}`
    );
    console.log("API response: ", response.data);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Lấy danh sách phẩm cùng loại không thành công"
    );
  }
};

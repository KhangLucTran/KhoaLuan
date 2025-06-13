import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllProductsApi,
  getProductByIdApi,
  deleteProductByIdApi,
  updateProductByIdApi,
  addProductApi,
  getProductsByCategoryApi,
} from "./productApi";
import { getRecommendationsApi } from "../recommendations/recommendationsApi";

// ✅ Lấy tất cả sản phẩm
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllProductsApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Lấy danh sách sản phẩm gợi ý sau khi đăng nhập
export const fetchRecommendations = createAsyncThunk(
  "product/fetchRecommendations",
  async (_, { rejectWithValue }) => {
    try {
      return await getRecommendationsApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Lấy sản phẩm theo ID
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      return await getProductByIdApi(productId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Thêm sản phẩm mới
export const addNewProduct = createAsyncThunk(
  "product/addNewProduct",
  async ({ productData, images }, { rejectWithValue }) => {
    try {
      return await addProductApi(productData, images);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Cập nhật sản phẩm
export const updateProductById = createAsyncThunk(
  "product/updateProductById",
  async ({ productId, productData, newImages }, { rejectWithValue }) => {
    try {
      return await updateProductByIdApi(productId, productData, newImages);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Xóa sản phẩm
export const deleteProductById = createAsyncThunk(
  "product/deleteProductById",
  async (productId, { rejectWithValue }) => {
    try {
      return await deleteProductByIdApi(productId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Lấy sản phẩm theo danh mục
export const fetchProductsByCategory = createAsyncThunk(
  "product/fetchProductsByCategory",
  async (categoryProduct, { rejectWithValue }) => {
    try {
      return await getProductsByCategoryApi(categoryProduct);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Lấy 3  ản phẩm liên quan
export const fetchRelatedProducts = createAsyncThunk(
  "product/fetchRelatedProducts",
  async ({ category, currentProductId }, { rejectWithValue }) => {
    try {
      const response = await getProductsByCategoryApi(category);
      const allProducts = response?.product || [];

      // Lọc bỏ chính sản phẩm đang xem
      const filtered = allProducts.filter((p) => p._id !== currentProductId);

      // Xáo trộn và chọn 3 sản phẩm
      const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
      return shuffled;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Initial State
const initialState = {
  products: [],
  selectedProduct: null,
  recommendations: [],
  categoryProducts: [],
  relatedProducts: [],

  // Loading riêng biệt cho từng asyncThunk
  isLoadingAllProducts: false,
  isLoadingRecommendations: false,
  isLoadingProductById: false,
  isLoadingRelatedProducts: false,
  isLoadingProductsByCategory: false,
  isLoadingAddProduct: false,
  isLoadingUpdateProduct: false,
  isLoadingDeleteProduct: false,

  error: null,
};

// ✅ productSlice
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoadingAllProducts = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoadingAllProducts = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoadingAllProducts = false;
        state.error = action.payload;
      })

      // Fetch recommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.isLoadingRecommendations = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.isLoadingRecommendations = false;
        state.recommendations = action.payload;
        state.products = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.isLoadingRecommendations = false;
        state.error = action.payload;
      })

      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoadingProductById = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoadingProductById = false;
        state.selectedProduct = action.payload;

        // Thêm vào products nếu chưa có
        const exists = state.products.find((p) => p._id === action.payload._id);
        if (!exists) {
          state.products.push(action.payload);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoadingProductById = false;
        state.error = action.payload;
      })

      // Fetch related products
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.isLoadingRelatedProducts = true;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.isLoadingRelatedProducts = false;
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.isLoadingRelatedProducts = false;
        state.relatedProducts = action.payload;
      })

      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoadingProductsByCategory = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoadingProductsByCategory = false;
        state.categoryProducts = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state) => {
        state.isLoadingProductsByCategory = false;
      })

      // Add new product
      .addCase(addNewProduct.pending, (state) => {
        state.isLoadingAddProduct = true;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.isLoadingAddProduct = false;
        state.products.push(action.payload);
      })
      .addCase(addNewProduct.rejected, (state) => {
        state.isLoadingAddProduct = false;
      })

      // Update product
      .addCase(updateProductById.pending, (state) => {
        state.isLoadingUpdateProduct = true;
      })
      .addCase(updateProductById.fulfilled, (state, action) => {
        state.isLoadingUpdateProduct = false;
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (
          state.selectedProduct &&
          state.selectedProduct._id === action.payload._id
        ) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProductById.rejected, (state) => {
        state.isLoadingUpdateProduct = false;
      })

      // Delete product
      .addCase(deleteProductById.pending, (state) => {
        state.isLoadingDeleteProduct = true;
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.isLoadingDeleteProduct = false;
        state.products = state.products.filter(
          (p) => p._id !== action.payload._id
        );
      })
      .addCase(deleteProductById.rejected, (state) => {
        state.isLoadingDeleteProduct = false;
      });
  },
});

// ✅ Export actions và reducer
export const { clearSelectedProduct, clearRecommendations } =
  productSlice.actions;
export default productSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFavoriteUserApi,
  addFavoriteUserApi,
  deleteFavoriteUserApi,
  checkStatusFavoriteUserApi,
} from "./favoriteApi";

// Thunk: Lấy danh sách sản phẩm yêu thích
export const fetchFavorites = createAsyncThunk(
  "favorite/fetchFavorites",
  async (_, thunkAPI) => {
    try {
      const data = await getFavoriteUserApi();
      console.log("Fetched favorites:", data);
      return data.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk: Thêm sản phẩm yêu thịche
export const addFavorite = createAsyncThunk(
  "favorite/addFavorite",
  async (productId, thunkAPI) => {
    try {
      const data = await addFavoriteUserApi(productId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk: Xoá sản phẩm khỏi danh sách yêu thích
export const removeFavorite = createAsyncThunk(
  "favorite/removeFavorite",
  async (productId, thunkAPI) => {
    try {
      await deleteFavoriteUserApi(productId);
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk: Kiểm tra trạng thái yêu thích
export const checkFavoriteStatus = createAsyncThunk(
  "favorite/checkFavoriteStatus",
  async (productId, thunkAPI) => {
    try {
      const data = await checkStatusFavoriteUserApi(productId);
      return { productId, isFavorite: data?.isFavorite };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    items: [],
    loading: false,
    error: null,
    favoriteStatus: {}, // Lưu trạng thái yêu thích theo productId
  },
  reducers: {
    resetFavorites(state) {
      state.items = [];
      state.favoriteStatus = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách yêu thích
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Thêm vào yêu thích
      .addCase(addFavorite.fulfilled, (state, action) => {
        const addedProduct = action.payload;
        if (!state.items.find((item) => item._id === addedProduct._id)) {
          state.items.push(addedProduct);
        }
        state.favoriteStatus[addedProduct._id] = true;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Xoá khỏi yêu thích
      .addCase(removeFavorite.fulfilled, (state, action) => {
        const productId = action.payload;
        state.items = state.items.filter((item) => item._id !== productId);
        state.favoriteStatus[productId] = false;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Kiểm tra trạng thái yêu thích
      .addCase(checkFavoriteStatus.fulfilled, (state, action) => {
        const { productId, isFavorite } = action.payload;
        state.favoriteStatus[productId] = isFavorite;
      });
  },
});
export const { resetFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserInfo, updateInfo } from "./userApi"; // Import API call

// ✅ Thunk lấy thông tin người dùng đang đăng nhập
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      return await getUserInfo();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Thunk cập nhật thông tin người dùng
export const fetchUpdateUserInfo = createAsyncThunk(
  "user/fetchUpdateUserInfo",
  async (credentials, { dispatch, rejectWithValue }) => {
    // ✅ Nhận dữ liệu user cần cập nhật
    try {
      const response = await updateInfo(credentials);
      dispatch(fetchUserInfo());
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ State ban đầu
const initialState = {
  user: null, // Không lấy từ localStorage để đảm bảo luôn cập nhật từ server
  isLoading: false,
  error: null,
};

// ✅ Tạo userSlice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch user info
      .addCase(fetchUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Update user info
      .addCase(fetchUpdateUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUpdateUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUpdateUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Xuất action & reducer
export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;

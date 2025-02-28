import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi } from "./authApi";
import { fetchUserInfo } from "../user/userSlice";
import api from "../../utils/api";
import {
  saveAuthTokens,
  getAuthTokens,
  clearAuthTokens,
} from "../../utils/token"; // Import token utils

// ✅ Lấy token từ localStorage khi khởi tạo
const tokens = getAuthTokens();
const accessToken = tokens?.accessToken || null;

const initialState = {
  token: accessToken,
  isLoading: false,
  error: null,
};

// ✅ Nếu có token, set lại headers cho API
if (accessToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

// ✅ Async thunk cho login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      saveAuthTokens(response.access_token, response.refresh_token);

      // 👉 Gọi fetchUserInfo ngay sau khi đăng nhập thành công
      dispatch(fetchUserInfo());

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Async thunk cho register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await registerApi(credentials);
      saveAuthTokens(response.access_token, response.refresh_token);

      // 👉 Gọi fetchUserInfo ngay sau khi đăng ký thành công
      dispatch(fetchUserInfo());

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Slice xử lý trạng thái auth
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      clearAuthTokens();
      delete api.defaults.headers.common["Authorization"];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") &&
          ["auth/loginUser/fulfilled", "auth/registerUser/fulfilled"].includes(
            action.type
          ),
        (state, action) => {
          state.isLoading = false;
          state.token = action.payload.access_token;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") &&
          ["auth/loginUser/rejected", "auth/registerUser/rejected"].includes(
            action.type
          ),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

// ✅ Xuất action & reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;

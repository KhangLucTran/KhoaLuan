import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi } from "./authApi";
import { fetchUserInfo } from "../user/userSlice";
import api from "../../utils/api";
import {
  saveAuthTokens,
  getAuthTokens,
  clearAuthTokens,
} from "../../utils/token";
import { connectSocket, disconnectSocket } from "../../utils/socket"; // Import socket

const tokens = getAuthTokens();
const accessToken = tokens?.accessToken || null;

const initialState = {
  token: accessToken,
  isLoading: false,
  error: null,
};

if (accessToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  connectSocket(); // Kết nối socket nếu đã có token
}

// ✅ Xử lý đăng nhập
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      saveAuthTokens(response.access_token, response.refresh_token);

      api.defaults.headers.common["Authorization"] =
        `Bearer ${response.access_token}`;
      connectSocket(); // Kết nối socket khi đăng nhập thành công

      dispatch(fetchUserInfo());
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Xử lý đăng ký
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await registerApi(credentials);
      saveAuthTokens(response.access_token, response.refresh_token);

      api.defaults.headers.common["Authorization"] =
        `Bearer ${response.access_token}`;
      connectSocket(); // Kết nối socket khi đăng ký thành công

      dispatch(fetchUserInfo());
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      clearAuthTokens();
      delete api.defaults.headers.common["Authorization"];

      disconnectSocket(); // Ngắt kết nối socket khi đăng xuất
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

export const { logout } = authSlice.actions;
export default authSlice.reducer;

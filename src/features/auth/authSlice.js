import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi } from "./authApi";
import { fetchUserInfo } from "../user/userSlice"; // Import user thunk
import api from "../../utils/api";

// ✅ Hàm lưu token vào localStorage
const saveToken = (access_token, refresh_token) => {
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
  api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
};

// ✅ Async thunk cho login & register
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      saveToken(response.access_token, response.refresh_token);

      // 👉 Gọi fetchUserInfo ngay sau khi đăng nhập thành công
      dispatch(fetchUserInfo());

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await registerApi(credentials);
      saveToken(response.access_token, response.refresh_token);

      // 👉 Gọi fetchUserInfo ngay sau khi đăng ký thành công
      dispatch(fetchUserInfo());

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ State ban đầu
const initialState = {
  token: localStorage.getItem("access_token") || null,
  isLoading: false,
  error: null,
};

// ✅ Tạo authSlice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
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

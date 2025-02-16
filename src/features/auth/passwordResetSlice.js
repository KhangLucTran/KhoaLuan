import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { forgotPassword, otpApi, resetApi } from "./authApi";

// ✅  Khởi tạo giá trị ban đầu
const initialState = {
  email: "",
  otp: "",
  password: "",
  confirmPassword: "",
  step: 0, // Quản lý bước trong stepper
  loading: false,
  error: null,
};

// ✅  Async Thunk xử lý quên mật khẩu
export const sendResetEmail = createAsyncThunk(
  "passwordReset/sendResetEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await forgotPassword({ email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅  Async Thunk xử lý xác thực OTP
export const verifyOtp = createAsyncThunk(
  "passwordReset/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await otpApi({ email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅  Async Thunk xử lý cập nhật mật khẩu
export const resetPassword = createAsyncThunk(
  "passwordReset/resetPass",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await resetApi({ email, newPassword: password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Slice quản lý trạng thái
const passwordResetSlice = createSlice({
  name: "passwordReset",
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      state[action.payload.field] = action.payload.value;
    },
    goToNextStep: (state) => {
      state.step += 1;
    },
    goToPreviousStep: (state) => {
      state.step -= 1;
    },
    resetProcess: (state) => {
      state.email = "";
      state.otp = "";
      state.password = "";
      state.confirmPassword = "";
      state.step = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendResetEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendResetEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.step = 3; // Cập nhật bước cuối cùng sau khi đặt mật khẩu thành công
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateFormData, goToNextStep, goToPreviousStep, resetProcess } =
  passwordResetSlice.actions;

export default passwordResetSlice.reducer;

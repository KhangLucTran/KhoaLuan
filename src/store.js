import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import passwordResetReducer from "./features/auth/passwordResetSlice";
import userReducer from "./features/user/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    passwordReset: passwordResetReducer,
    user: userReducer,
  },
});

export default store;

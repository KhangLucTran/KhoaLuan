import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import passwordResetReducer from "./features/auth/passwordResetSlice";
import userReducer from "./features/user/userSlice";
import productReducer from "./features/product/productSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    passwordReset: passwordResetReducer,
    user: userReducer,
    product: productReducer,
  },
});

export default store;

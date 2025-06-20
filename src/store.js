// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import sessionStorage from "redux-persist/lib/storage/session"; // sessionStorage

// Import các slice
import authReducer from "./features/auth/authSlice";
import passwordResetReducer from "./features/auth/passwordResetSlice";
import userReducer from "./features/user/userSlice";
import productReducer from "./features/product/productSlice";
import favoriteReducer from "./features/favorite/favoriteSlice";

// --- 1. Persist Config cho sessionStorage (product)
const productPersistConfig = {
  key: "product",
  storage: sessionStorage,
};

// --- 2. Persist Config chính cho localStorage (auth, user,...)
const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user", "favorite"], // không bao gồm product
};

// --- 3. Gộp reducer
const rootReducer = combineReducers({
  auth: authReducer,
  passwordReset: passwordResetReducer,
  user: userReducer,
  favorite: favoriteReducer,
  product: persistReducer(productPersistConfig, productReducer), // riêng product dùng sessionStorage
});

// --- 4. Áp dụng persist toàn bộ
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import App from "./App.jsx";
import theme from "./theme";

// 🔄 import lại store và persistor
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* 👉 Thêm PersistGate để chờ state được khôi phục */}
      <PersistGate loading={null} persistor={persistor}>
        <CssVarsProvider theme={theme}>
          <CssBaseline />
          <App />
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);

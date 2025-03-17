import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Admin Page && HomePage
import HomePage from "./pages/HomePages/HomePage";

// Auth Pages
import LoginPage from "./pages/AuthPages/LoginPage";
import RegisterPage from "./pages/AuthPages/RegisterPage";
import ForgotPassword from "./pages/AuthPages/ForgotPage";
import PasswordResetStepper from "./pages/AuthPages/PasswordResetStepper";

// User Pages
import ProfileView from "./pages/UserPages/ProfileView";
import Profile from "./pages/UserPages/ProfileSideBar";

// Other Pages
import AboutPage from "./pages/OtherPages/AboutPage";
import PageNotFound from "./pages/OtherPages/PageNotFound";

// Toast Container
import { ToastContainer } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers";

// Product Pages
import Product from "./pages/ProductPages/Product";
import ProductDetail from "./pages/ProductPages/ProductDetail";
import PaymentPage from "./pages/OrderPages/PaymentPage";

// Cart & Context
import CartPage from "./pages/OrderPages/CartPage"; // Giả sử file Cart.jsx nằm trong pages/Cart
import CartProvider from "./pages/OrderPages/cartContext"; // CartContext đã được cấu hình
import Checkout from "./pages/OrderPages/CheckoutPage";
import InvoicePage from "./pages/OrderPages/InvoicePage";
import FavoritePage from "./pages/UserPages/FavoritePage";
import NotificationPage from "./pages/UserPages/NotificationPage";
import AddressPage from "./pages/UserPages/AddressPage";

// ✅ Định nghĩa router đúng cách với cấu trúc lồng nhau
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/levents",
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot/password", element: <ForgotPassword /> },
      { path: "about", element: <AboutPage /> },
      { path: "products", element: <Product /> },
      { path: "product-detail/:id", element: <ProductDetail /> },
      { path: "checkout", element: <Checkout /> },
      { path: "payment", element: <PaymentPage /> },
      { path: "invoice", element: <InvoicePage /> },
      { path: "favorite", element: <FavoritePage /> },
      { path: "notification", element: <NotificationPage /> },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "profile",
        element: <Profile />, // Sidebar và nội dung động bên trong
        children: [
          { path: "view", element: <ProfileView /> },
          { path: "address", element: <AddressPage /> },
          { path: "change-password", element: <PasswordResetStepper /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CartProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </CartProvider>
    </LocalizationProvider>
  );
}

export default App;

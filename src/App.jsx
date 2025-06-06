import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

<head>
  <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
  <df-messenger
    intent="WELCOME"
    chat-title="Chatbot"
    agent-id="c0248397-3a16-44be-a84e-0352f65a81f4"
    language-code="vi"
  ></df-messenger>
</head>;

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

// Cart & Context
import CartPage from "./pages/OrderPages/CartPage"; // Giả sử file Cart.jsx nằm trong pages/Cart
import CartProvider from "./pages/OrderPages/cartContext"; // CartContext đã được cấu hình
import Checkout from "./pages/OrderPages/CheckoutPage";
import InvoicePage from "./pages/OrderPages/InvoicePage";
import FavoritePage from "./pages/UserPages/FavoritePage";
import NotificationPage from "./pages/UserPages/NotificationPage";
import AddressPage from "./pages/UserPages/AddressPage";
import DiscountPage from "./pages/OrderPages/DiscountPage";
import AdminPage from "./pages/HomePages/AdminPage";

// 🔔 Import NotificationContext
import { NotificationProvider } from "./components/Toast/notificationContext";
import NotificationDropdown from "./components/Toast/NotificationDropdown";
import InvoiceDetailPage from "./pages/OrderPages/InvoiceDetailPage";
import Chatbot from "./components/Chat/ChatBot";
import ChatBox from "./components/Chat/ChatBox";
// import { useEffect } from "react";

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
      { path: "chatbot", element: <ChatBox /> },
      { path: "product-detail/:id", element: <ProductDetail /> },
      { path: "checkout", element: <Checkout /> },
      { path: "invoice", element: <InvoicePage /> },
      { path: "favorite", element: <FavoritePage /> },
      { path: "notification", element: <NotificationPage /> },
      { path: "notification-dropdown", element: <NotificationDropdown /> },
      { path: "admin", element: <AdminPage /> },
      { path: "invoice/detail/:id", element: <InvoiceDetailPage /> },
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
          { path: "vouchers", element: <DiscountPage /> },
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
  // useEffect(() => {
  //   // 1. Kiểm tra và chèn script nếu chưa có
  //   if (!document.getElementById("dialogflow-script")) {
  //     const script = document.createElement("script");
  //     script.id = "dialogflow-script";
  //     script.src =
  //       "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
  //     script.async = true;
  //     document.body.appendChild(script);
  //   }

  //   // 2. Chèn chatbot vào DOM nếu chưa có
  //   if (!document.getElementById("chatbot-container")) {
  //     const container = document.createElement("div");
  //     container.id = "chatbot-container";
  //     container.innerHTML = `
  //     <df-messenger
  //       intent="WELCOME"
  //       chat-title="Chatbot"
  //       agent-id="c0248397-3a16-44be-a84e-0352f65a81f4"
  //       language-code="vi"
  //     ></df-messenger>
  //   `;
  //     document.body.appendChild(container);
  //   }
  // }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CartProvider>
        <NotificationProvider>
          <Chatbot />
          <RouterProvider router={router} />
          <ToastContainer />
        </NotificationProvider>
      </CartProvider>
    </LocalizationProvider>
  );
}

export default App;

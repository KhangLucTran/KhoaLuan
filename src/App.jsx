import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Admin Page && HomePage
import HomePage from "./pages/HomePages/HomePage";

// Auth Pages
import LoginPage from "./pages/AuthPages/LoginPage";
import RegisterPage from "./pages/AuthPages/RegisterPage";
import ForgotPassword from "./pages/AuthPages/ForgotPage";

// User Pages
import ProfileView from "./pages/UserPages/ProfileView";
import Profile from "./pages/UserPages/ProfileSideBar";

// Other Pages
import AboutPage from "./pages/OtherPages/AboutPage";
import PageNotFound from "./pages/OtherPages/PageNotFound";

// Toast Container
import { ToastContainer } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers";
import PasswordResetStepper from "./pages/AuthPages/PasswordResetStepper";

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
      {
        path: "profile",
        element: <Profile />, // Sidebar và nội dung động bên trong
        children: [
          { path: "view", element: <ProfileView /> },
          { path: "address", element: <div>Quản lý địa chỉ</div> },
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
      <RouterProvider router={router} />
      <ToastContainer />
    </LocalizationProvider>
  );
}

export default App;

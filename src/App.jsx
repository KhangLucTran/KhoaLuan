import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/AuthPages/LoginPage";
import HomePage from "./pages/HomePages/HomePage";
import RegisterPage from "./pages/AuthPages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <h1>404 - Page</h1>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

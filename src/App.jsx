import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/AuthPages/LoginPage";
import HomePage from "./pages/HomePages/HomePage";
import RegisterPage from "./pages/AuthPages/RegisterPage";
import PageNotFound from "./pages/PageNotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/levents/login",
    element: <LoginPage />,
  },
  {
    path: "/levents/register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    future: {
      v7_startTransition: true,
    },
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useTokenHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("accessToken", accessToken);
      currentUrl.searchParams.set("refreshToken", refreshToken);

      navigate(currentUrl.pathname + currentUrl.search, { replace: true });

      console.log("🔑 Access Token:", accessToken);
      console.log("🔄 Refresh Token:", refreshToken);
    }
  }, [navigate, location]);
};

export default useTokenHandler;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const useProtectedDialog = () => {
  // Lấy thông tin user từ Redux
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  // State điều khiển Dialog
  const [open, setOpen] = useState(false);

  // State điều hướng sau khi login thành công.
  const [redirectPath, setRedirectPath] = useState("");

  // Hàm xử lý hành động cần bảo vệ:
  const handleProtectedAction = (path) => {
    if (!user) {
      setRedirectPath(path);
      setOpen(true);
    } else {
      navigate(path);
    }
  };

  return { open, setOpen, handleProtectedAction, navigate, redirectPath };
};

export default useProtectedDialog;

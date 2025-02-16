import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const useProtectedDialog = () => {
  // Lấy thông tin user từ Redux
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  // State điều khiển Dialog
  const [open, setOpen] = useState(false);

  // Hàm xử lý hành động cần bảo vệ:
  // Nếu chưa đăng nhập thì mở Dialog, nếu đã đăng nhập thì điều hướng đến đường dẫn truyền vào.
  const handleProtectedAction = (path) => {
    if (!user) {
      setOpen(true);
    } else {
      navigate(path);
    }
  };

  return { open, setOpen, handleProtectedAction, navigate };
};

export default useProtectedDialog;

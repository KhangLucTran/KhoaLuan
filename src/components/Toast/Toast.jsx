import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AlertCircle, BadgeCheck, Info } from "lucide-react";

// Hàm hiển thị thông báo thành công với icon tùy chỉnh
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
    icon: <BadgeCheck />,
  });
};

// Hàm hiển thị thông báo thông tin
export const showInfoToast = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
    icon: <Info style={{ stroke: "#3498db" }} />,
  });
};

// Hàm hiển thị thông báo lỗi
export const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
    icon: <AlertCircle />,
  });
};

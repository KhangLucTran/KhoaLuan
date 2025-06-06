import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AlertCircle, BadgeCheck, Info } from "lucide-react";
import PropTypes from "prop-types";

//Component Toast hiển thị nội dung với 2 dòng
const ToastContent = ({ title, message }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <strong>{title}</strong>
    <span style={{ marginTop: "4px" }}>{message}</span>
  </div>
);

//  Thông báo thành công
export const showSuccessToast = (message) => {
  toast.success(<ToastContent title="Thành công" message={message} />, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    transition: Bounce,
    icon: <BadgeCheck />,
  });
};

// Thông báo thông tin
export const showInfoToast = (message) => {
  toast.info(<ToastContent title="Thông tin" message={message} />, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    transition: Bounce,
    icon: <Info color="#3498db" />,
  });
};

// Thông báo lỗi
export const showErrorToast = (message) => {
  toast.error(<ToastContent title="Thất bại" message={message} />, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    transition: Bounce,
    icon: <AlertCircle />,
  });
};

// Đinh nghĩa các thuộc tính cho ToastContent
ToastContent.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};

ToastContent.defaultProps = {
  title: "Thông báo",
  message: "",
};

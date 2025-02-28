import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import "../../styles/Dialog.css"; // Đảm bảo đường dẫn đúng
import { useNavigate } from "react-router-dom";

const DetailedDialog = ({
  open,
  onClose,
  onLogin,
  title = "Levents",
  text = "Bạn chưa đăng nhập! Vui lòng đăng nhập để trải nghiệm các tính năng quan trọng.",
  redirectPath,
}) => {
  const navigate = useNavigate();

  // Xử lý khi bấm nút "Đăng nhập"
  const handleLoginClick = () => {
    if (onLogin) {
      onLogin();
    } else if (redirectPath) {
      // Điều hướng đến trang login, truyền state chứa redirectPath
      navigate("/levents/login", { state: { from: redirectPath } });
    } else {
      navigate("/levents/login");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: "detailed-dialog-paper",
      }}
    >
      <div className="detailed-dialog-container">
        {/* Cột hình ảnh */}
        <div className="detailed-dialog-image"></div>
        {/* Cột nội dung */}
        <div className="detailed-dialog-content">
          <DialogTitle className="detailed-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText className="detailed-dialog-text">
              {text}
            </DialogContentText>
          </DialogContent>
          <DialogActions className="detailed-dialog-actions">
            <Button onClick={onClose} variant="outlined" color="secondary">
              Đóng
            </Button>
            <Button
              onClick={handleLoginClick}
              variant="contained"
              color="primary"
            >
              Đăng nhập
            </Button>
          </DialogActions>
        </div>
      </div>
    </Dialog>
  );
};

DetailedDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLogin: PropTypes.func,
  title: PropTypes.string,
  text: PropTypes.string,
  redirectPath: PropTypes.string,
};

export default DetailedDialog;

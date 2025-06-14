import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { CopyAll } from "@mui/icons-material";
import PropTypes from "prop-types";
import "../../styles/ShareNotification.css"; // Import CSS file

const ShareNotification = ({ productUrl, open, onClose }) => {
  const [shareOption, setShareOption] = useState("url"); // Trạng thái chọn URL hoặc Facebook

  // Hàm sao chép URL vào clipboard
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(productUrl); // Copy URL vào clipboard
    alert("Đã sao chép liên kết!" + productUrl);
  };

  // Hàm mở cửa sổ chia sẻ Facebook
  const handleShareFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      productUrl
    )}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chia sẻ sản phẩm</DialogTitle>
      <DialogContent>
        <DialogContentText mb={1}>
          Bạn có thể chia sẻ sản phẩm qua URL hoặc Facebook.
        </DialogContentText>

        {/* Option 1: Chia sẻ URL */}
        {shareOption === "url" && (
          <Box sx={{ textAlign: "center" }}>
            <Typography className="toast-description">
              Sao chép liên kết sản phẩm:
            </Typography>
            <TextField
              value={productUrl}
              variant="outlined"
              fullWidth
              className="share-textfield"
              disabled
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<CopyAll />}
              sx={{ marginTop: 2 }}
              onClick={handleCopyUrl}
            >
              Sao chép liên kết
            </Button>
          </Box>
        )}

        {/* Option 2: Chia sẻ qua Facebook */}
        {shareOption === "facebook" && (
          <Box sx={{ textAlign: "center" }}>
            <Typography className="toast-description">
              Chia sẻ trên Facebook:
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleShareFacebook}
              sx={{ marginTop: 2 }}
            >
              Chia sẻ qua Facebook
            </Button>
          </Box>
        )}

        {/* Switch between options */}
        <Box sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            onClick={() => setShareOption("url")}
            className="share-option-button"
          >
            URL
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShareOption("facebook")}
            className="share-option-button"
          >
            Facebook
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareNotification;

// Định nghĩa dữ liệu được chiều vào ShareNotification
ShareNotification.propTypes = {
  productUrl: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired, // Thêm open để kiểm soát việc hiển thị dialog
  onClose: PropTypes.func.isRequired, // Hàm để đóng dialog
};

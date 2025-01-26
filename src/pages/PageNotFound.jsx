import { Link } from "react-router-dom";
import "../styles/404Page.css";
import "../styles/Tooltip.css";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

const PageNotFound = () => {
  return (
    <div className="page-not-found-container">
      <div className="page-not-found-content">
        <div className="page-not-found-image"></div>
        <p className="page-not-found-message">Trang bạn tìm không tồn tại</p>
        <p className="page-not-found-description">
          Có vẻ như chúng tôi không thể tìm thấy trang bạn yêu cầu. Đừng lo,
          chúng tôi có thể giúp bạn quay lại!
        </p>
        <Link
          to="/"
          className="page-not-found-button tooltip"
          data-tooltip="Nhấn để quay về trang chủ"
        >
          <ArrowLeftIcon fontSize="large" />
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;

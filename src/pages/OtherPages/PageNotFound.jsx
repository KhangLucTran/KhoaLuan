import { Link } from "react-router-dom";
import "../../styles/404Page.css";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";

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
        <CustomTooltip title="Nhấn để quay về trang chủ">
          <Link to="/" className="page-not-found-button">
            <ArrowLeftIcon fontSize="large" />
          </Link>
        </CustomTooltip>
      </div>
    </div>
  );
};

export default PageNotFound;

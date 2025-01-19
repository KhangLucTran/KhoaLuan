import { Link } from "react-router-dom";
import "../styles/404Page.css";

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
        <Link to="/" className="page-not-found-button">
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;

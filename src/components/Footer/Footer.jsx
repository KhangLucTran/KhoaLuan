import "../../styles/Footer.css";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  // useNavigate
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Về Levents</h3>
          <ul>
            <li onClick={() => navigate("/levents/about")}>Thông tin</li>
            <li>Danh sách cửa hàng</li>
            <li>Cơ hội nghề nghiệp</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Trợ giúp</h3>
          <ul>
            <li>FAQ</li>
            <li>Chính sách trả hàng</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Tài khoản</h3>
          <ul>
            <li>Tư cách thành viên</li>
            <li>Hồ sơ</li>
            <li>Coupons</li>
          </ul>
        </div>
        <div className="footer-section newsletter">
          <h3>Bản tin điện tử</h3>
          <p>
            Đăng ký ngay để nhận thông tin về sản phẩm mới, khuyến mãi và sự
            kiện tại Levents.
          </p>
          <button
            className="subscribe-btn"
            onClick={() => navigate("/levents/register")}
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
      <div className="footer-social">
        <p>Tài khoản xã hội Levents</p>
        <div className="social-icons">
          <a
            href="https://www.facebook.com/luc.tran.vinh.khang"
            className="facebook"
          >
            <FacebookIcon />
          </a>
          <a href="#" className="instagram">
            <InstagramIcon />
          </a>
          <a href="#" className="twitter">
            <TwitterIcon />
          </a>
        </div>
        <div className="footer-flag">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
            alt="Vietnam Flag"
            className="vietnam-flag"
          />
          <span>Việt Nam</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

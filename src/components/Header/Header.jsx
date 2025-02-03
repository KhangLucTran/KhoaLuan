import { Badge } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LoginIcon from "@mui/icons-material/Login";
import "../../styles/Header.css";
import "../../styles/Tooltip.css";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "../CustomTooltip/CustomTooltip";

const Header = () => {
  const navigate = useNavigate();
  const handleLoginIconButton = () => {
    navigate("/levents/login");
  };

  return (
    <header className="header-container">
      {/* Header Logo */}
      <div className="header-logo">
        <CustomTooltip title="Trang chủ">
          <a href="/">Levents</a>
        </CustomTooltip>
      </div>
      {/* Header Nav */}
      <nav className="header-nav">
        <ul>
          <li className="header-li">
            <a href="/">Trang chủ</a>
          </li>
          <li className="header-li">
            <a href="/about">Thông tin</a>
          </li>
          <li className="header-li">
            <a href="#services">Dịch vụ</a>
          </li>
          <li className="header-li">
            <a href="#contact">Liên hệ</a>
          </li>
        </ul>
      </nav>
      {/* Header Icon */}
      <div className="header-nav-icon">
        <CustomTooltip title="Giỏ hàng">
          <Badge color="info" badgeContent={0}>
            <ShoppingCartOutlinedIcon fontSize="medium" />
          </Badge>
        </CustomTooltip>
        <CustomTooltip title="Sản phẩm yêu thích">
          <Badge color="info" badgeContent={0}>
            <FavoriteBorderOutlinedIcon fontSize="medium" />
          </Badge>
        </CustomTooltip>
        <CustomTooltip title="Đăng nhập">
          <LoginIcon onClick={handleLoginIconButton} />
        </CustomTooltip>
      </div>
    </header>
  );
};

export default Header;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Inventory, Receipt } from "@mui/icons-material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import "../../styles/AdminPage.css";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import { Avatar, Badge, IconButton } from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import NotificationDropdown from "../../components/Toast/NotificationDropdown";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ChatBox from "../../components/Chat/ChatBox";
import UserManagement from "../AdminPages/UsersPage";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminProductManagement from "../AdminPages/ProductsPage";
import { logout } from "../../features/auth/authSlice";
import { logoutUser } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  // Lấy admin từ Redux
  const adminFromRedux = useSelector((state) => state.user.user);

  // State để lưu user (lấy từ localStorage nếu Redux chưa có)
  const [admin, setAdmin] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Cập nhật localStorage khi adminFromRedux thay đổi
  useEffect(() => {
    if (adminFromRedux) {
      localStorage.setItem("user", JSON.stringify(adminFromRedux));
      setAdmin(adminFromRedux); // Cập nhật admin từ Redux
    }
  }, [adminFromRedux]);

  const handleLogout = () => {
    logout();
    logoutUser();
    navigate("/levents/home");
  };

  // Nếu chưa có admin, hiển thị "Loading..."
  if (!admin) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="admin-page">
      {/* Sidebar bên trái */}
      <div className="sidebar">
        <h1 className="logo">Levents</h1>
        <ul>
          {/* Trang chủ */}
          <CustomTooltip title="Trang chủ">
            <li
              className={selectedMenu === "Home" ? "active" : ""}
              onClick={() => setSelectedMenu("Home")}
            >
              <HomeRoundedIcon fontSize="medium" className="list-icon" />
            </li>
          </CustomTooltip>
          {/* Quản lý người dùng */}
          <CustomTooltip title="Tài khoản">
            <li
              className={selectedMenu === "User" ? "active" : ""}
              onClick={() => setSelectedMenu("User")}
            >
              <PeopleAltRoundedIcon fontSize="medium" className="list-icon" />
            </li>
          </CustomTooltip>
          {/* Product */}
          <CustomTooltip title="Sản phẩm">
            <li
              className={selectedMenu === "Product" ? "active" : ""}
              onClick={() => setSelectedMenu("Product")}
            >
              <Inventory fontSize="medium" className="list-icon" />
            </li>
          </CustomTooltip>
          {/* Voucher */}
          <CustomTooltip title="Mã giảm">
            <li
              className={selectedMenu === "Voucher" ? "active" : ""}
              onClick={() => setSelectedMenu("Voucher")}
            >
              <DiscountIcon fontSize="medium" className="list-icon" />
            </li>
          </CustomTooltip>
          {/* Invoice */}
          <CustomTooltip title="Hóa đơn">
            <li
              className={selectedMenu === "Invoice" ? "active" : ""}
              onClick={() => setSelectedMenu("Invoice")}
            >
              <Receipt fontSize="medium" className="list-icon" />
            </li>
          </CustomTooltip>
        </ul>
        <div className="admin-signout">
          <CustomTooltip title="Đăng xuất">
            <IconButton>
              <LogoutIcon
                fontSize="large"
                sx={{ color: "red" }}
                onClick={handleLogout}
              />
            </IconButton>
          </CustomTooltip>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="admin-content">
        <div className="admin-info">
          <div className="admin-info-header">
            <CustomTooltip title="Thông báo">
              <NotificationDropdown />
            </CustomTooltip>
            <CustomTooltip title="Tin nhắn">
              <Badge
                badgeContent={1}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#000",
                    color: "#fff",
                  },
                }}
                onClick={() => setShowChat(true)}
              >
                <ChatOutlinedIcon />
              </Badge>
            </CustomTooltip>
          </div>
          <Avatar
            sx={{ width: 56, height: 56 }}
            className="admin-info-avatar"
            src={
              admin?.data?.profileId?.avatar ||
              "https://via.placeholder.com/150"
            }
          />
          <div className="admin-info-detail">
            <h4 className="admin-info-gmail">
              {admin?.data?.email || "Chưa có email"}
            </h4>
            <p className="admin-info-username">
              {admin?.data?.profileId?.username || "Chưa có tên"}
            </p>
          </div>
        </div>
        <h2>{selectedMenu}</h2>
        <div className="content-box">
          {selectedMenu === "User" && <UserManagement />}
          {selectedMenu === "Product" && <AdminProductManagement />}
          {selectedMenu === "Voucher" && <p>Quản lý mã giảm giá</p>}
          {selectedMenu === "Invoice" && <p>Quản lý hóa đơn</p>}
        </div>
      </div>

      {/* Khung chat */}
      {showChat && <ChatBox onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default AdminPage;

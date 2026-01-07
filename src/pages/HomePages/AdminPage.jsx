import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Inventory, Receipt } from "@mui/icons-material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import "../../styles/AdminPage.css";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import { Avatar, Badge, IconButton } from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import NotificationDropdown from "../../components/Toast/NotificationDropdown";
import ChatBox from "../../components/Chat/ChatBox";
import SettingsIcon from "@mui/icons-material/Settings";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import EmailIcon from "@mui/icons-material/Email";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { logout } from "../../features/auth/authSlice";
import { logoutUser } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../../utils/socket";
import AdminInvoicePage from "../AdminPages/InvoiceAdminPage";
import AdminProductManagement from "../AdminPages/ProductManagement/ProductManagement";
import UserManagement from "../AdminPages/UserManagement/UserManagement";
import HomeManagement from "../AdminPages/HomeManagement/DashboardPage";
import DiscountManagement from "../AdminPages/DiscountManagement/DiscountManagement";

const AdminPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showChat, setShowChat] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");

  // Lấy admin từ Redux
  const adminFromRedux = useSelector((state) => state.user.user);

  // State để lưu user (lấy từ localStorage nếu Redux chưa có)
  const [admin, setAdmin] = useState(() => {
    const savedUser = localStorage.getItem("user");
    console.log("Admin: ", JSON.parse(savedUser));
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
    dispatch(logout());
    dispatch(logoutUser());
    navigate("/"); // Điều hướng về trang đăng nhập
  };

  // 🔥 Kết nối WebSocket khi admin đăng nhập
  useEffect(() => {
    if (admin?.data?._id) {
      const socket = connectSocket();
      socket.on("newNotification", (data) => {
        console.log("📩 Nhận thông báo mới:", data);
        setNotificationCount((prev) => prev + 1);
      });

      return () => {
        socket.off("newNotification");
      };
    }
  }, [admin]);

  // Nếu chưa có admin, hiển thị "Loading..."
  if (!admin) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      <div className="admin-page">
        <aside className="sidebar">
          <div className="logo">
            <CustomTooltip title="Trang chủ">
              <h2 className="logo-header">Levents</h2>
            </CustomTooltip>
          </div>
          <ul>
            <CustomTooltip title="Trang chủ">
              <li
                className={selectedMenu === "Home" ? "active" : ""}
                onClick={() => setSelectedMenu("Home")}
              >
                <HomeRoundedIcon className="list-icon" />{" "}
              </li>
            </CustomTooltip>
            <CustomTooltip title="Tài khoản">
              <li
                className={selectedMenu === "User" ? "active" : ""}
                onClick={() => setSelectedMenu("User")}
              >
                <PeopleAltRoundedIcon className="list-icon" />{" "}
              </li>
            </CustomTooltip>
            <CustomTooltip title="Sản phẩm">
              <li
                className={selectedMenu === "Product" ? "active" : ""}
                onClick={() => setSelectedMenu("Product")}
              >
                <Inventory className="list-icon" />{" "}
              </li>
            </CustomTooltip>
            <CustomTooltip title="Mã giảm">
              <li
                className={selectedMenu === "Voucher" ? "active" : ""}
                onClick={() => setSelectedMenu("Voucher")}
              >
                <DiscountIcon className="list-icon" />{" "}
              </li>
            </CustomTooltip>
            <CustomTooltip title="Hóa đơn">
              <li
                className={selectedMenu === "Invoice" ? "active" : ""}
                onClick={() => setSelectedMenu("Invoice")}
              >
                <Receipt className="list-icon" />{" "}
              </li>
            </CustomTooltip>
          </ul>
          <div className="admin-signout">
            <CustomTooltip title="Đăng xuất">
              <IconButton onClick={handleLogout}>
                <PowerSettingsNewIcon />
              </IconButton>
            </CustomTooltip>
          </div>
        </aside>

        <main className="admin-content">
          <header className="admin-info">
            <div className="admin-info-header">
              <CustomTooltip title="Thông báo">
                <NotificationDropdown
                  notificationCount={notificationCount}
                  setNotificationCount={setNotificationCount}
                />
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
                  <EmailIcon />
                </Badge>
              </CustomTooltip>
              <CustomTooltip title="Trang Sản Phẩm">
                <IconButton onClick={() => navigate("/levents/products")}>
                  <Inventory2Icon sx={{ color: "#000" }} />
                </IconButton>
              </CustomTooltip>
              <CustomTooltip title="Cài đặt Tài Khoản">
                <IconButton onClick={() => navigate("/levents/profile/view")}>
                  <SettingsIcon sx={{ color: "#000" }} />
                </IconButton>
              </CustomTooltip>
            </div>
            <Avatar
              src={admin?.data?.profileId?.avatar || ""}
              className="admin-info-avatar"
              sx={{ width: 50, height: 50, borderRadius: 1 }}
              variant="square"
            />
            <div className="admin-info-detail">
              <h4 className="admin-info-gmail">
                {admin?.data?.email || "Chưa có email"}
              </h4>
              <p className="admin-info-username">
                {admin?.data?.profileId?.username || "Chưa có tên"}
              </p>
            </div>
          </header>
          <section className="content-box">
            {selectedMenu === "Home" && <HomeManagement />}
            {selectedMenu === "User" && <UserManagement />}
            {selectedMenu === "Product" && <AdminProductManagement />}
            {selectedMenu === "Voucher" && <DiscountManagement />}
            {selectedMenu === "Invoice" && <AdminInvoicePage />}
          </section>
        </main>

        {showChat && <ChatBox onClose={() => setShowChat(false)} />}
      </div>
    </>
  );
};

export default AdminPage;

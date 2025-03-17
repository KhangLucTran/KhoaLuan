import { useEffect, useState } from "react";
import axios from "axios";
import { Badge, IconButton, Typography, Avatar } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useNavigate } from "react-router-dom";
import { getAuthTokens } from "../../utils/token";
import "../../styles/NotificationDropdown.css";

const getTimeAgo = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffInSeconds = Math.floor((now - createdDate) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;

  return `${Math.floor(diffInSeconds / 31536000)} năm trước`;
};

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [timeAgoList, setTimeAgoList] = useState([]);
  const navigate = useNavigate();
  const accessToken = getAuthTokens().accessToken;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notification", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotifications(res.data);

      // Tạo danh sách timeAgo ban đầu
      setTimeAgoList(res.data.map((notif) => getTimeAgo(notif.createdAt)));
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    }
  };

  useEffect(() => {
    const updateTimeAgo = () => {
      setTimeAgoList(notifications.map((notif) => getTimeAgo(notif.createdAt)));
    };

    const interval = setInterval(updateTimeAgo, 60000);
    return () => clearInterval(interval);
  }, [notifications]);

  // Đánh dấu là "Đã đọc"
  const handleNotificationClick = async (notif) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/notification/${notif._id}/read`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );

      setTimeout(() => {
        fetchNotifications(); // Đảm bảo trạng thái mới được cập nhật
      }, 500);

      navigate(notif.link || "/levents/notification");
      setOpen(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  return (
    <div>
      <IconButton color="inherit" onClick={() => setOpen(!open)}>
        <Badge
          badgeContent={notifications.filter((n) => !n.isRead).length}
          color="info"
        >
          <NotificationsOutlinedIcon fontSize="medium" />
        </Badge>
      </IconButton>

      {open && (
        <div
          className="notification-overlay"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <div className={`notification-sidebar ${open ? "open" : ""}`}>
        <div className="notification-header">
          <h3>Thông báo</h3>
          <button onClick={() => setOpen(false)}>×</button>
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <Typography color="textSecondary" className="no-notifications">
              Không có thông báo nào
            </Typography>
          ) : (
            notifications.slice(0, 5).map((notif, index) => (
              <div
                key={notif._id}
                className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <Avatar
                  src={notif.avatar || "/default-avatar.png"}
                  className="notification-avatar"
                />
                <div className="notification-content">
                  <Typography className="notification-message">
                    {notif.message}
                  </Typography>
                  <Typography className="notification-time">
                    {timeAgoList[index]}
                  </Typography>
                </div>
              </div>
            ))
          )}
        </div>

        <div
          className="view-all"
          onClick={() => navigate("/levents/notification")}
        >
          Xem tất cả
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;

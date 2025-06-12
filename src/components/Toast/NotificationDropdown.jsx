import { useEffect, useState } from "react";
import { Badge, IconButton, Typography, Avatar } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import "../../styles/NotificationDropdown.css";
import { useSelector } from "react-redux";
import { getProductByIdApi } from "../../features/product/productApi";
import { markNotificationAsReadApi } from "../../features/notification/notificationApi";
import { useNotification } from "./notificationContext";
import { getInvoiceByIdApi } from "../../features/invoice/invoiceApi";
import defaultProduct from "../../assets/default-product.png";

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
  const { notifications, unreadCount, setNotifications } = useNotification();
  const [open, setOpen] = useState(false);
  const [avatarUrls, setAvatarUrls] = useState({});
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchAvatars = async () => {
      const avatarData = await Promise.all(
        notifications.map(async (notif) => {
          let avatarUrl = "/default-avatar.png";

          if (notif.type === "user" && notif.user) {
            avatarUrl = user?.data?.profileId?.avatar || avatarUrl;
          } else if (notif.type === "product" && notif.refId) {
            try {
              const data = await getProductByIdApi(notif.refId);
              avatarUrl = data?.images?.[0] || defaultProduct;
            } catch (error) {
              console.error("Lỗi khi lấy ảnh sản phẩm:", error);
            }
          } else if (notif.type === "order" && notif.invoiceId) {
            const result = await getInvoiceByIdApi(notif.invoiceId);
            if (
              Array.isArray(result?.invoice?.lineItems) &&
              result?.invoice?.lineItems.length > 0
            ) {
              const productId = result?.invoice?.lineItems[0].productId;
              const data = await getProductByIdApi(productId);
              avatarUrl = data?.images?.[0] || avatarUrl;
            } else {
              console.warn(
                "⚠️ lineItems không hợp lệ hoặc không tồn tại trong invoice",
                result
              );
            }
          }

          return { id: notif._id, avatarUrl };
        })
      );

      setAvatarUrls(
        Object.fromEntries(
          avatarData.map(({ id, avatarUrl }) => [id, avatarUrl])
        )
      );
    };

    if (notifications.length > 0) {
      fetchAvatars();
    }
  }, [notifications, user]);

  const handleNotificationClick = async (notif) => {
    try {
      await markNotificationAsReadApi(notif._id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );

      if (notif.type === "order" && notif.invoiceId) {
        navigate(`/levents/invoice/detail/${notif.invoiceId}`);
      } else if (notif.type === "user" && notif.relatedUserId === null) {
        navigate(`/levents/profile/view`);
      } else if (notif.type === "product" && notif.productId) {
        navigate(`/levents/product-detail/${notif.productId}`);
      } else {
        navigate(notif.link);
      }

      setOpen(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  return (
    <div>
      <IconButton color="inherit" onClick={() => setOpen(!open)}>
        <Badge badgeContent={unreadCount} color="info">
          <NotificationsIcon fontSize="medium" />
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
            notifications.slice(0, 7).map((notif) => (
              <div
                key={notif._id}
                className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <Avatar
                  variant="square"
                  sx={{ width: 60, height: 60, borderRadius: 2 }}
                  src={avatarUrls[notif._id]}
                  className="notification-avatar"
                  loading="lazy"
                />
                <div className="notification-content">
                  <h4 className="notification-message">{notif.title}</h4>
                  <p className="notification-description">
                    {notif.message || "Bạn có một thông báo mới!"}
                  </p>
                  <p className="notification-time">
                    {getTimeAgo(notif.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div
          className="view-all"
          onClick={() => navigate("/levents/profile/notifications")}
        >
          Xem tất cả
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;

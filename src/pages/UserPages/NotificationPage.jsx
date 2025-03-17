import axios from "axios";
import PropTypes from "prop-types";
import { Bell, FileText, Package } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import "../../styles/NotificationPage.css";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { getSocket } from "../../utils/socket";
import { getAuthTokens } from "../../utils/token";

const getTimeAgo = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffInSeconds = Math.floor((now - createdDate) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
};

const NotificationCard = ({ notif, onClick }) => {
  const [timeAgo, setTimeAgo] = useState(getTimeAgo(notif.createdAt));
  useEffect(() => {
    const getTimeAgo = (createdAt) => {
      const now = new Date();
      const createdDate = new Date(createdAt);
      const diffInSeconds = Math.floor((now - createdDate) / 1000);

      if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} phút trước`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    };

    const updateInterval = getTimeAgo(notif.createdAt).includes("giây")
      ? 1000
      : 60000;

    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(notif.createdAt));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [notif.createdAt]);

  return (
    <Card
      key={notif._id}
      className={`notification-card ${notif.isRead ? "notification-read" : "notification-unread"}`}
      onClick={() => onClick(notif._id)}
    >
      <CardContent className="notification-content">
        <Typography className="notification-icon">
          {notif.type === "invoice" ? (
            <FileText size={18} color="#1877F2" />
          ) : (
            <Package size={18} color="#1877F2" />
          )}
          {notif.message}
        </Typography>

        {notif.invoiceId && (
          <>
            <Typography className="notification-meta">
              Tổng tiền: {notif.invoiceId.totalAmount} VNĐ <br />
              Phương thức thanh toán: {notif.invoiceId.paymentMethod}
            </Typography>
            <List className="notification-list">
              {notif.invoiceId.lineItems.map((item) => (
                <ListItem key={item._id} className="notification-list-item">
                  <ListItemText
                    primary={`${item.productName} - ${item.quantity} x ${item.price} VNĐ`}
                    secondary={`Size: ${item.size}, Màu: ${item.color}, Giới tính: ${item.gender}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        <Typography className="notification-time">{timeAgo}</Typography>
      </CardContent>
    </Card>
  );
};

NotificationCard.propTypes = {
  notif: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    invoiceId: PropTypes.shape({
      totalAmount: PropTypes.number,
      paymentMethod: PropTypes.string,
      lineItems: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          productName: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired,
          price: PropTypes.number.isRequired,
          size: PropTypes.string,
          color: PropTypes.string,
          gender: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const accessToken = getAuthTokens().accessToken;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notification", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setNotifications(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchNotifications();

    const socket = getSocket();
    if (socket) {
      socket.on("new_notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });
    }

    return () => {
      if (socket) {
        socket.off("new_notification");
      }
    };
  }, [fetchNotifications]);

  const handleNotificationClick = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  return (
    <div className="notification-container">
      <Typography variant="h5" className="notification-header">
        <Bell color="#1877F2" />
        Thông báo của bạn
      </Typography>

      {notifications.length === 0 ? (
        <Typography color="textSecondary" sx={{ textAlign: "center" }}>
          Không có thông báo nào.
        </Typography>
      ) : (
        notifications.map((notif) => (
          <NotificationCard
            key={notif._id}
            notif={notif}
            onClick={handleNotificationClick}
          />
        ))
      )}
    </div>
  );
};

export default NotificationPage;

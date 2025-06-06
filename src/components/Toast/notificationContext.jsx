import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { connectSocket, getSocket } from "../../utils/socket";
import { getAuthTokens } from "../../utils/token";
import {
  fetchNotificationsApi,
  markNotificationAsReadApi,
} from "../../features/notification/notificationApi";
import PropTypes from "prop-types";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  const token = getAuthTokens()?.accessToken;

  const MAX_NOTIFICATIONS = 50;

  // ✅ Fetch thông báo lần đầu
  const fetchNotifications = useCallback(async () => {
    if (!token || loading || isFetched) return;
    setLoading(true);
    try {
      const list = await fetchNotificationsApi();
      const sliced = (list || []).slice(0, MAX_NOTIFICATIONS);
      setNotifications(sliced);
      const unread = sliced.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
      setIsFetched(true);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    }
    setLoading(false);
  }, [token, loading, isFetched]);

  // ✅ Reset isFetched khi token thay đổi (đăng nhập lại)
  useEffect(() => {
    setIsFetched(false);
  }, [token]);

  // ✅ Lấy thông báo ban đầu
  useEffect(() => {
    if (!isFetched) fetchNotifications();
  }, [fetchNotifications, isFetched]);

  // ✅ Lắng nghe socket
  useEffect(() => {
    if (!token) return;

    const socket = connectSocket();

    if (socket) {
      socket.on("newNotification", (notification) => {
        setNotifications((prev) => {
          // Tránh trùng ID
          if (prev.find((n) => n._id === notification._id)) return prev;
          const updated = [notification, ...prev];
          return updated.slice(0, MAX_NOTIFICATIONS); // Giới hạn số lượng
        });
        setUnreadCount((prev) => prev + 1);
      });
    }

    return () => {
      const socket = getSocket();
      if (socket) socket.off("newNotification");
    };
  }, [token]);

  // ✅ Đánh dấu đã đọc
  const markAllAsRead = async () => {
    try {
      await markNotificationAsReadApi();
      const updated = notifications.map((n) => ({ ...n, isRead: true }));
      setNotifications(updated);
      setUnreadCount(0);
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error);
    }
  };

  // ✅ Reset khi logout
  const resetNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    setIsFetched(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        setNotifications,
        markAllAsRead,
        fetchNotifications,
        resetNotifications,
        loading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotificationProvider;

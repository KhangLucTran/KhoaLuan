import PropTypes from "prop-types";
import { Bell, FileText, Package } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import "../../styles/NotificationPage.css";
import { Avatar, Typography, Pagination } from "@mui/material";
import { getSocket } from "../../utils/socket";
import { useNotification } from "../../components/Toast/notificationContext";
import { useSelector } from "react-redux";
import { getProductByIdApi } from "../../features/product/productApi";
import { getInvoiceByIdApi } from "../../features/invoice/invoiceApi";
import defaultProduct from "../../assets/default-product.png";

const getTimeAgo = (createdAt) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(createdAt)) / 1000);
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
};

const NotificationCard = ({ notif, avatarUrl, onClick }) => {
  const [timeAgo, setTimeAgo] = useState(getTimeAgo(notif.createdAt));

  useEffect(() => {
    const interval = setInterval(
      () => setTimeAgo(getTimeAgo(notif.createdAt)),
      timeAgo.includes("giây") ? 1000 : 60000
    );
    return () => clearInterval(interval);
  }, [notif.createdAt, timeAgo]);

  return (
    <div
      className={`nc-card ${notif.isRead ? "nc-card--read" : "nc-card--unread"}`}
      onClick={() => onClick(notif._id)}
    >
      <div className="nc-content">
        <Avatar
          variant="square"
          src={avatarUrl}
          className="nc-avatar"
          sx={{ width: 120, height: 120, borderRadius: 2 }}
        />
        <div className="nc-body">
          <Typography className="nc-title" fontWeight={600}>
            {notif.type === "order" ? (
              <FileText size={18} color="#1877F2" />
            ) : (
              <Package size={18} color="#1877F2" />
            )}{" "}
            {notif.title}
          </Typography>
          <Typography className="nc-message">{notif.message}</Typography>
          <Typography className="nc-time">{timeAgo}</Typography>
        </div>
      </div>
    </div>
  );
};

NotificationCard.propTypes = {
  notif: PropTypes.object.isRequired,
  avatarUrl: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

const NotificationPage = () => {
  const { notifications, setNotifications } = useNotification();
  const user = useSelector((state) => state.user.user);
  const [avatarUrls, setAvatarUrls] = useState({});
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (_e, value) => {
    setPage(value);
  };
  // Lấy danh sách notifications trang hiện tại
  const pagedNotifications = notifications.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const loadAvatars = useCallback(async () => {
    const arr = await Promise.all(
      notifications.map(async (notif) => {
        let avatar = defaultProduct;
        try {
          if (notif.type === "user" && notif.user) {
            avatar = user?.data?.profileId?.avatar || avatar;
          } else if (notif.type === "product" && notif.refId) {
            const data = await getProductByIdApi(notif.refId);
            avatar = data?.images?.[0] || defaultProduct;
          } else if (notif.type === "order" && notif.invoiceId) {
            const res = await getInvoiceByIdApi(notif.invoiceId);
            const item = res?.invoice?.lineItems?.[0];
            if (item) {
              const data = await getProductByIdApi(item.productId);
              avatar = data?.images?.[0] || defaultProduct;
            }
          }
        } catch {
          avatar = defaultProduct;
        }
        return [notif._id, avatar];
      })
    );
    setAvatarUrls(Object.fromEntries(arr));
  }, [notifications, user]);

  useEffect(() => {
    if (notifications.length) loadAvatars();
  }, [notifications, loadAvatars]);

  useEffect(() => {
    const socket = getSocket();
    socket?.on("new_notification", (n) =>
      setNotifications((prev) => [n, ...prev])
    );
    return () => socket?.off("new_notification");
  }, [setNotifications]);

  const handleClick = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );

  return (
    <div className="np-container">
      <h2 className="np-header">
        <Bell /> THÔNG BÁO
      </h2>
      {notifications.length === 0 ? (
        <Typography className="np-empty">Không có thông báo nào.</Typography>
      ) : (
        <>
          {pagedNotifications.map((notif) => (
            <NotificationCard
              key={notif._id}
              notif={notif}
              avatarUrl={avatarUrls[notif._id] || defaultProduct}
              onClick={handleClick}
            />
          ))}
          {/* Phân trang */}
          <Pagination
            count={Math.ceil(notifications.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            shape="rounded"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </>
      )}
    </div>
  );
};

export default NotificationPage;

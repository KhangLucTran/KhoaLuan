import { useEffect, useState } from "react";
import "../../styles/InvoiceDetailPage.css";
import { getInvoiceByIdApi } from "../../features/invoice/invoiceApi";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { FaClipboardList, FaCreditCard, FaTruck, FaStar } from "react-icons/fa";
import { Button } from "@mui/material";
import { getProductByIdApi } from "../../features/product/productApi";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useSelector } from "react-redux";
import ChatBox from "../../components/Chat/ChatBox";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMoney = (amount) => {
  return amount.toLocaleString("vi-VN") + "₫";
};

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productImages, setProductImages] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  const fetchProductImages = async (lineItems) => {
    const imagesMap = {};
    await Promise.all(
      lineItems.map(async (item) => {
        try {
          const data = await getProductByIdApi(item.productId);
          console.log(`Fetched product ${item.productId}:`, data.product);
          if (data?.product.images?.[0]) {
            imagesMap[item.productId] = data.product.images[0];
          }
        } catch (error) {
          console.error(`Error fetching product ${item.productId}:`, error);
        }
      })
    );
    setProductImages(imagesMap);
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data = await getInvoiceByIdApi(id);
        console.log("Invoice:", data);
        setInvoice(data.invoice);
        setError(null);
        // Gọi để lấy ảnh
        await fetchProductImages(data.invoice.lineItems);
      } catch (err) {
        setError(err.message || "Lỗi khi lấy chi tiết hóa đơn");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!invoice) return <div>Không tìm thấy hóa đơn</div>;

  // Change Status -> Icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaClipboardList />;
      case "Paid":
        return <FaCreditCard />;
      case "Shipped":
        return <FaTruck />;
      case "Completed":
        return <FaStar />;
      default:
        return <FaClipboardList />;
    }
  };

  // Change Status -> Text
  const getStatus = (status) => {
    switch (status) {
      case "Pending":
        return "Đơn Hàng Đã Đặt";
      case "Paid":
        return "Đã Xác Nhận Thông Tin Thanh Toán";
      case "Shipped":
        return "Đã Giao Cho ĐVVC";
      case "Completed":
        return "Đơn Hàng Đã Hoàn Thành";
      default:
        return "Đã hủy";
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case "Pending":
        return "Chúng tôi đã nhận được đơn hàng của bạn và đang chờ xử lý.";
      case "Paid":
        return "Thanh toán đã được xác nhận, đơn hàng sẽ sớm được đóng gói.";
      case "Shipped":
        return "Đơn hàng đang được vận chuyển đến bạn bởi đơn vị giao hàng.";
      case "Completed":
        return "Bạn đã nhận được đơn hàng. Cảm ơn bạn đã mua sắm!";
      default:
        return "Đơn hàng đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ hỗ trợ.";
    }
  };

  return (
    <>
      <Header hideNav={true} />
      <div className="invoice-detail-container">
        <div className="invoice-card">
          <div className="invoice-card-title">
            <Button
              startIcon={<KeyboardArrowLeftIcon />}
              variant="text"
              onClick={() => window.history.back()}
              style={{ marginRight: "8px", color: "#ccc" }}
            >
              TRỞ LẠI
            </Button>
            <div className="invoice-title">
              <strong>MÃ ĐƠN HÀNG: {invoice.vnp_TxnRef || "N/A"}</strong> |{" "}
              <span className="invoice-title-status">
                {getStatus(invoice.status)}
              </span>
            </div>
          </div>

          {/* Status TimeLine */}
          <div className="status-timeline">
            {invoice.statusTimeLine.map((item, index) => (
              <div className="timeline-step" key={index}>
                <div className="timeline-icon">
                  {getStatusIcon(item.status)}
                </div>
                <div className="timeline-content">
                  <div className="status-title">{getStatus(item.status)}</div>
                  <div className="status-time">
                    {formatDate(item.updatedAt)}
                  </div>
                </div>
                {index < invoice.statusTimeLine.length - 1 && (
                  <div className="timeline-line" />
                )}
              </div>
            ))}
          </div>

          {/* Invoice Action */}
          <div className="invoice-action-section">
            <div className="thanks-text">Cảm ơn bạn đã mua sắm tại Shop!</div>
            <div className="action-buttons">
              {invoice.status === "Completed" && (
                <Button
                  variant="contained"
                  color="error"
                  style={{ marginRight: "8px" }}
                >
                  Mua Lại
                </Button>
              )}
              <Button variant="outlined" onClick={() => setShowChat(true)}>
                Liên Hệ Người Bán
              </Button>
            </div>
          </div>
          {/* Invoice Border */}
          <div className="invoice-border-decor" />

          {/* Invoice Infor */}
          <div className="invoice-tracking-wrapper">
            {/* BÊN TRÁI: Thông tin người nhận */}
            <div className="recipient-info">
              <h3>ĐỊA CHỈ NHẬN HÀNG</h3>
              <h4 className="invoice-info-username">
                {user.data.profileId?.username || "Hi"}
              </h4>
              <div>(+84) {invoice.numberphone}</div>
              <div>{invoice.addressDetail}</div>
            </div>

            {/* BÊN PHẢI: Trạng thái giao hàng */}
            <div className="delivery-timeline">
              <div className="delivery-header">
                <strong>
                  {formatDate(invoice.statusTimeLine.at(-1)?.updatedAt)}
                </strong>{" "}
                <span className="status-success">
                  {getStatus(invoice.status) || "Đã giao"}
                </span>
                <div className="status-sub">
                  {getStatusDescription(invoice.status)}
                </div>
                <div className="status-sub">
                  Người nhận hàng: {user.data.profileId?.username}
                </div>
              </div>

              {/* Timeline động từ DB */}
              <div className="invoice-tracking-timeline">
                {invoice.statusTimeLine.map((item, index) => (
                  <div className="tracking-step" key={index}>
                    <div className="tracking-icon">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="tracking-content">
                      <div className="tracking-title">
                        {getStatus(item.status)}
                      </div>
                      <div className="tracking-time">
                        {formatDate(item.updatedAt)}
                      </div>
                      <div className="tracking-description">
                        {getStatusDescription(item.status)}
                      </div>
                    </div>
                    {index < invoice.statusTimeLine.length - 1 && (
                      <div className="tracking-line" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Item Invoice */}
          <div className="line-items-invoice-detail">
            <div className="line-items-invoice-detail-header">
              <StorefrontIcon fontSize="small" />
              <h3> Levents</h3>
            </div>
            {invoice.lineItems.map((item) => (
              <div
                className="line-item-invoice-detail"
                key={item._id}
                onClick={() =>
                  navigate(`/levents/product-detail/${item.productId}`)
                }
              >
                <div>
                  <img
                    className="product-image-invoice-detail"
                    src={productImages[item.productId] || item.image}
                    alt={item.productName}
                    loading="lazy"
                  />
                </div>
                <div className="product-name-invoice-detail">
                  {item.productName}
                  <div className="details">
                    <span>Số lượng: {item.quantity}</span>
                    <span>Kích cỡ: {item.size}</span>
                    <span>Màu: {item.color}</span>
                  </div>
                  <h5 className="details-footer">
                    Giá: {formatMoney(item.price)}
                  </h5>
                </div>
              </div>
            ))}
          </div>

          <div className="detail-payment">
            <div className="payment">
              <h4>Phương thức thanh toán</h4>
              <span>{invoice.paymentMethod}</span>
            </div>
            <div className="payment">
              <h4>Ngân hàng</h4>
              <span>Ngân hàng {invoice.vnp_BankCode}</span>
            </div>
            <div className="payment">
              <h4>Mã số giao dịch</h4>
              <span>{invoice.vnp_TransactionNo}</span>
            </div>
            <div className="payment">
              <h4>Ngày thanh toán</h4>
              <span>{formatDate(invoice.issuedAt)}</span>
            </div>
          </div>
          <div className="total-section">
            <strong>Tổng cộng: {formatMoney(invoice.totalAmount)}</strong>
          </div>
        </div>
      </div>
      {showChat && <ChatBox onClose={() => setShowChat(false)} />}
      <Footer />
    </>
  );
};

export default InvoiceDetailPage;

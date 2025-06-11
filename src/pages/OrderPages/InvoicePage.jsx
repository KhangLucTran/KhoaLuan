import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../../styles/InvoicePage.css";
import {
  getInvoiceByUserIdApi,
  updateStatusInvoiceApi,
} from "../../features/invoice/invoiceApi";
import { getProductByIdApi } from "../../features/product/productApi";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { Tabs, Tab, Box, Button } from "@mui/material";
import CommentForm from "../../components/Form/CommentForm";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../../utils/socket";

const formatMoney = (amount) => {
  return amount.toLocaleString("vi-VN") + "₫";
};

// Component hiển thị mỗi line item với ảnh sản phẩm
const LineItemComponent = ({ item }) => {
  const [productImage, setProductImage] = useState(null);
  useEffect(() => {
    async function fetchProductImage() {
      try {
        const data = await getProductByIdApi(item.productId);
        if (data && data.images && data.images.length > 0) {
          setProductImage(data.images[0]);
        }
      } catch (error) {
        console.error("Error fetching product image:", error);
      }
    }
    fetchProductImage();
  }, [item]);

  return (
    <div className="invoice-line-item">
      {productImage && (
        <img
          src={productImage}
          alt={item.productName}
          className="invoice-line-item-image"
          loading="lazy"
        />
      )}
      <div className="invoice-line-item-details">
        <div className="product-name-invoice-detail">
          {item.productName}
          <div className="details">
            <span>Số lượng: {item.quantity}</span>
            <span>Kích cỡ: {item.size}</span>
            <span>Màu: {item.color}</span>
          </div>
          <h5 className="details-footer">Giá: {formatMoney(item.price)}</h5>
        </div>
      </div>
    </div>
  );
};

LineItemComponent.propTypes = {
  item: PropTypes.shape({
    product: PropTypes.shape({
      images: PropTypes.arrayOf(PropTypes.string),
    }),
    productId: PropTypes.string,
    productName: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    size: PropTypes.string,
    color: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
};

const InvoiceComponent = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");
  const [activeComment, setActiveComment] = useState(false);
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const navigate = useNavigate();

  // Mapping status tiếng Anh -> Tiếng Việt
  const statusMap = {
    Pending: "Chờ xử lý",
    Paid: "Đã thanh toán",
    Shipped: "Đã giao hàng",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
    All: "Tất cả",
  };

  // Cập nhật Invoice Data theo Real-Time
  useEffect(() => {
    const socket = getSocket();
    socket.on("invoiceStatusUpdated", (updatedInvoice) => {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === updatedInvoice._id ? updatedInvoice : inv
        )
      );
      console.log("📦 Trạng thái hóa đơn đã được cập nhật realtime");
    });

    return () => {
      socket.off("invoiceStatusUpdated");
    };
  }, []);

  useEffect(() => {
    getInvoiceByUserIdApi()
      .then((data) => {
        // Giả sử API trả về dữ liệu theo định dạng { invoice: [...] }
        setInvoices(data.invoice);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Có lỗi xảy ra: {error.message}</p>;

  // Sắp xếp tab theo thứ tự: Pending, Paid, Shipped, Completed, Cancelled, All
  const statuses = [
    "Pending",
    "Paid",
    "Shipped",
    "Completed",
    "Cancelled",
    "All",
  ];

  const filteredInvoices =
    activeTab === "All"
      ? invoices
      : invoices.filter((invoice) => invoice.status === activeTab);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setActiveComment(null);
  };

  // Hàm cập nhật trạng thái hóa đơn khi bấm nút "Hủy hóa đơn"
  const handleCancelInvoice = async (invoiceId) => {
    try {
      const updatedData = await updateStatusInvoiceApi(invoiceId, {
        status: "Cancelled",
      });
      setInvoices((prevInvoices) =>
        prevInvoices.map((inv) =>
          inv._id === invoiceId ? updatedData.invoice : inv
        )
      );
      console.log("Invoice updated:", updatedData);
    } catch (error) {
      console.error("Error updating invoice status:", error);
      alert("Cập nhật trạng thái hóa đơn thất bại, vui lòng thử lại.");
    }
  };

  const handleCommentSubmit = () => {
    // Sau khi submit, ẩn CommentForm
    setActiveComment(null);
  };

  const statusColors = {
    pending: "#f39c12", // cam
    paid: "#16a085", // xanh ngọc
    shipped: "#2980b9", // xanh dương
    completed: "#27ae60", // xanh lá
    cancelled: "#c0392b", // đỏ
  };

  function getStatusColor(status) {
    if (!status) return "#555"; // màu mặc định
    return statusColors[status.toLowerCase()] || "#555";
  }
  return (
    <>
      <Header hideNav={true} />
      <div className="invoice-page-tabs-container">
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            marginBottom: "1rem",
            width: "100%",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ gap: "2rem" }}
          >
            {statuses.map((status) => (
              <Tab key={status} label={statusMap[status]} value={status} />
            ))}
          </Tabs>
        </Box>
        <div className="invoice-page-list">
          {filteredInvoices.length === 0 ? (
            <p className="invoice-no-invoice-message">
              Không có hóa đơn nào trong trạng thái {statusMap[activeTab]}.
            </p>
          ) : (
            filteredInvoices.map((invoice) => (
              <div
                key={invoice._id}
                className={`invoice-page-card status-${invoice.status}`}
              >
                <div className="invoice-page-wrapper">
                  <div
                    className="invoice-page-ribbon"
                    style={{
                      backgroundColor: getStatusColor(invoice.status),
                    }}
                  >
                    {statusMap[invoice.status] || "Không xác định"}
                  </div>
                  {/* Chi tiết Line Items */}
                  <div className="invoice-line-items-section">
                    <div className="line-items-invoice-detail-header">
                      <StorefrontIcon fontSize="small" />
                      <h3> Levents</h3>
                    </div>
                    <div className="invoice-title">
                      <strong>
                        MÃ ĐƠN HÀNG: {invoice.vnp_TxnRef || "N/A"}
                      </strong>
                      |
                      <span className="invoice-title-status-main">
                        {statusMap[invoice.status]}
                      </span>
                    </div>
                    {invoice.lineItems.map((item) => (
                      <div
                        key={item._id}
                        className="invoice-line-item-container"
                      >
                        <LineItemComponent key={item._id} item={item} />
                        <Button
                          onClick={() =>
                            navigate(`/levents/invoice/detail/${invoice._id}`)
                          }
                        >
                          Xem chi tiết đơn hàng
                        </Button>
                        {invoice.status === "Completed" &&
                          (item.hasRated ? (
                            <div className="invoice-hasRated">
                              Đã Đánh giá sản phẩm
                            </div>
                          ) : (
                            <div className="invoice-rate-product-section">
                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  position: "absolute",
                                  bottom: 0,
                                  right: 0,
                                }}
                                onClick={() => {
                                  setIsCommentFormVisible(true);
                                  setActiveComment(
                                    activeComment === item._id ? null : item._id
                                  );
                                }}
                              >
                                Đánh giá sản phẩm
                              </Button>
                              {activeComment === item._id &&
                                isCommentFormVisible && (
                                  <div className="comment-delay">
                                    <CommentForm
                                      productId={item.productId}
                                      onCommentSubmit={handleCommentSubmit}
                                      invoiceId={invoice._id}
                                    />
                                  </div>
                                )}
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                  <p className="invoice-cart-total">
                    <strong>Tổng cộng:</strong>
                    {formatMoney(invoice.totalAmount)} VND
                  </p>
                </div>
                {invoice.status === "Pending" && (
                  <div className="invoice-invoice-actions">
                    <button
                      className="invoice-action-button cancel"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelInvoice(invoice._id);
                      }}
                    >
                      Hủy hóa đơn
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InvoiceComponent;

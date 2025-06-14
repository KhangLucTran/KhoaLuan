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
import { Tabs, Tab, Box } from "@mui/material";

// Component hiển thị mỗi line item với ảnh sản phẩm
const LineItemComponent = ({ item }) => {
  const [productImage, setProductImage] = useState(null);

  useEffect(() => {
    async function fetchProductImage() {
      try {
        // Gọi API lấy sản phẩm theo ID
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
    <div className="line-item">
      {productImage && (
        <img
          src={productImage}
          alt={item.productName}
          className="line-item-image"
        />
      )}
      <div className="line-item-details">
        <p>
          <strong>Sản phẩm:</strong> {item.productName}
        </p>
        <p>
          <strong>Số lượng:</strong> {item.quantity}
        </p>
        <p>
          <strong>Giá:</strong> {item.price.toLocaleString()} VND
        </p>
        <p>
          <strong>Tổng tiền:</strong> {item.total.toLocaleString()} VND
        </p>
        <p>
          <strong>Kích cỡ:</strong> {item.size}
        </p>
        <p>
          <strong>Màu sắc:</strong> {item.color}
        </p>
        <p>
          <strong>Giới tính:</strong> {item.gender}
        </p>
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

  // Mapping status tiếng Anh -> Tiếng Việt
  const statusMap = {
    Pending: "Chờ xử lý",
    Paid: "Đã thanh toán",
    Shipped: "Đã giao hàng",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
    All: "Tất cả",
  };

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
  };

  // Hàm cập nhật trạng thái hóa đơn khi bấm nút "Hủy hóa đơn"
  const handleCancelInvoice = async (invoiceId) => {
    try {
      // Gọi API update status, truyền vào invoiceId và trạng thái mới "Cancelled"
      const updatedData = updateStatusInvoiceApi(invoiceId, {
        status: "Cancelled",
      });
      // Update lại state invoices sau khi update thành công
      setInvoices((prevInvoices) =>
        prevInvoices.map((inv) =>
          inv._id === invoiceId ? { ...inv, status: "Cancelled" } : inv
        )
      );
      console.log("Invoice updated:", updatedData);
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  return (
    <>
      <Header hideNav={true} />
      <div className="invoice-tabs-container">
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
        <div className="invoice-list">
          {filteredInvoices.length === 0 ? (
            <p className="no-invoice-message">
              Không có hóa đơn nào trong trạng thái {statusMap[activeTab]}.
            </p>
          ) : (
            filteredInvoices.map((invoice) => (
              <div key={invoice._id} className="invoice-card-card-container">
                <div className="invoice-card">
                  <h3>Hóa đơn #{invoice.vnp_TxnRef || "N/A"}</h3>
                  <p>
                    <strong>Trạng thái:</strong> {statusMap[invoice.status]}
                  </p>
                  <p>
                    <strong>Ngày lập:</strong>{" "}
                    {new Date(invoice.issuedAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Phương thức thanh toán:</strong>{" "}
                    {invoice.paymentMethod}
                  </p>
                  {invoice.status === "Paid" && (
                    <p>
                      <strong>Ngân hàng:</strong> {invoice.vnp_BankCode}
                    </p>
                  )}
                  <p className="cart-total">
                    <strong>Tổng cộng:</strong>{" "}
                    {invoice.totalAmount.toLocaleString()} VND
                  </p>
                  {/* Chi tiết Line Items */}
                  <div className="line-items-section">
                    <h4>Chi tiết sản phẩm:</h4>
                    {invoice.lineItems.map((item) => (
                      <LineItemComponent key={item._id} item={item} />
                    ))}
                  </div>
                </div>
                {/* Hiển thị nút nếu hóa đơn đã hoàn thành */}
                {invoice.status === "Completed" && (
                  <div className="invoice-actions">
                    <button className="action-button repurchase">
                      Mua lại
                    </button>
                    <button className="action-button rate-product">
                      Đánh giá sản phẩm
                    </button>
                  </div>
                )}
                {/* Nếu hóa đơn đang chờ xử lý, hiển thị nút hủy */}
                {invoice.status === "Pending" && (
                  <div className="invoice-actions">
                    <button
                      className="action-button cancel"
                      onClick={() => handleCancelInvoice(invoice._id)}
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

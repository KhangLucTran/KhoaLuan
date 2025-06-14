import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "../../styles/PaymentPage.css";
import qrVNPAY from "../../assets/qrVNPAY.jpg";
import atmVNPAY from "../../assets/atmVNPAY.png";
import visaVNPAY from "../../assets/visaVNPAY.png";
import paymentApi from "../../features/payment/paymentApi";
import { useCart } from "./cartContext";
import { getSocket } from "../../utils/socket";

const PaymentPage = () => {
  const { state } = useLocation();
  const { cartId } = useCart();
  const {
    selectedCartItems,
    totalPrice,
    additionalFee,
    shippingFee,
    voucherDiscount,
    finalAmount,
    user,
  } = state || {}; // tránh bị lỗi khi không có dữ liệu
  const [bankCode, setBankCode] = useState("VNPAYQR");
  const [language, setLanguage] = useState("vn");
  const payload = {
    cartId,
    amount: finalAmount,
    bankCode,
    language,
    userId: user?.data?._id,
    selectedCartItems,
  };

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on("payment_status", (data) => {
        console.log("Thông báo từ server:", data);
      });
    }
    return () => {
      if (socket) {
        socket.off("payment_status");
      }
    };
  }, []);

  console.log("Payload:", payload);
  if (!state) {
    return (
      <Container className="payment-container">
        <Typography variant="h6" color="error">
          Không có dữ liệu thanh toán. Vui lòng quay lại giỏ hàng.
        </Typography>
      </Container>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!finalAmount || !user?.data?._id || !selectedCartItems.length) {
      console.error("Dữ liệu không hợp lệ! Hãy kiểm tra lại.");
      return;
    }

    const payload = {
      cartId,
      amount: finalAmount,
      bankCode,
      language,
      userId: user?.data?._id,
      selectedCartItems,
    };
    console.log("Payload:", payload);
    try {
      const response = await paymentApi.createPayment(payload);
      if (response.data.vnpUrl) {
        window.location.href = response.data.vnpUrl; // Chuyển hướng sang VNPAY
      } else {
        console.error("API không trả về URL thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
    }
  };

  return (
    <>
      <Header hideNav={true} />
      <Container className="payment-container">
        <div className="payment-card">
          <div className="product-section">
            <h3>SẢN PHẨM ĐƯỢC CHỌN</h3>
            {selectedCartItems.map((item, index) => (
              <div key={index} className="product-item">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="product-image"
                />
                <div className="product-details">
                  <Typography variant="h6">{item.product.title}</Typography>
                  <Typography>
                    Size: {item.size} | Màu: {item.color}
                  </Typography>
                  <Typography>Số lượng: {item.quantity}</Typography>
                  <Typography>
                    Giá: {item.price.toLocaleString()} VND
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Tổng: {item.total.toLocaleString()} VND
                  </Typography>
                </div>
              </div>
            ))}
            <Typography>
              <strong>Tổng tiền sản phẩm:</strong>{" "}
              {totalPrice?.toLocaleString() || "0"} VND
            </Typography>
            <Typography>
              <strong>Phí gia tăng (VAT 10%):</strong>{" "}
              {additionalFee?.toLocaleString() || "0"} VND
            </Typography>
            <Typography>
              <strong>Phí vận chuyển:</strong>{" "}
              {shippingFee === 0
                ? "Miễn phí"
                : `${shippingFee?.toLocaleString() || "0"} VND`}
            </Typography>
            <Typography>
              <strong>Giảm voucher:</strong>{" "}
              {voucherDiscount > 0
                ? `- ${voucherDiscount?.toLocaleString()} VND`
                : "0 VND"}
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              <strong>Thành tiền:</strong>{" "}
              {finalAmount?.toLocaleString() || "0"} VND
            </Typography>
          </div>

          <div className="payment-section">
            <h4>THÔNG TIN NGƯỜI NHẬN</h4>
            <div className="user-info">
              <Typography>
                <strong>Họ tên:</strong> {user?.data.profileId?.username}
              </Typography>
              <Typography>
                <strong>SĐT:</strong> {user?.data.profileId?.numberphone}
              </Typography>
              <Typography>
                <strong>Địa chỉ:</strong> {user?.data.profileId?.address}
              </Typography>
            </div>

            <form id="createOrder" className="payment-form">
              <div className="form-group">
                <label>Số tiền thanh toán</label>
                <input
                  type="text"
                  name="amount"
                  className="form-control"
                  placeholder="Số tiền"
                  required
                  value={finalAmount}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Chọn Phương thức thanh toán:</label>
                <div className="payment-options">
                  <FormControlLabel
                    control={
                      <Radio
                        name="bankCode"
                        value="VNPAYQR"
                        checked={bankCode === "VNPAYQR"}
                        onChange={(e) => setBankCode(e.target.value)}
                      />
                    }
                    label={
                      <div className="payment-label">
                        <span>VNPAYQR - Ứng dụng ngân hàng</span>
                        <img
                          src={qrVNPAY}
                          alt="VNPAYQR"
                          className="payment-icon"
                        />
                      </div>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        name="bankCode"
                        value="VNBANK"
                        checked={bankCode === "VNBANK"}
                        onChange={(e) => setBankCode(e.target.value)}
                      />
                    }
                    label={
                      <div className="payment-label">
                        <span>ATM/Tài khoản ngân hàng nội địa</span>
                        <img
                          src={atmVNPAY}
                          alt="ATM"
                          className="payment-icon"
                        />
                      </div>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        name="bankCode"
                        value="INTCARD"
                        checked={bankCode === "INTCARD"}
                        onChange={(e) => setBankCode(e.target.value)}
                      />
                    }
                    label={
                      <div className="payment-label">
                        <span>Thẻ quốc tế (Visa, MasterCard)</span>
                        <img
                          src={visaVNPAY}
                          alt="Visa/MasterCard"
                          className="payment-icon"
                        />
                      </div>
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Ngôn ngữ</label>
                <div className="language-options">
                  <FormControlLabel
                    control={
                      <Radio
                        name="language"
                        value="vn"
                        checked={language === "vn"}
                        onChange={(e) => setLanguage(e.target.value)}
                      />
                    }
                    label="Tiếng Việt"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        name="language"
                        value="en"
                        checked={language === "en"}
                        onChange={(e) => setLanguage(e.target.value)}
                      />
                    }
                    label="Tiếng Anh"
                  />
                </div>
              </div>

              <Button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary"
                id="btnPopup"
              >
                Thanh toán
              </Button>
            </form>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default PaymentPage;

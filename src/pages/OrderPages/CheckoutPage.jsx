import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, TextField, Modal, Backdrop, Fade } from "@mui/material";

import { useSelector } from "react-redux";
import addressApi from "../../features/address/addressApi";
import DiscountPage from "./DiscountPage";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import qrVNPAY from "../../assets/qrVNPAY.jpg";
import atmVNPAY from "../../assets/atmVNPAY.webp";
import visaVNPAY from "../../assets/visaVNPAY.png";
import paymentApi from "../../features/payment/paymentApi";
import vietnam from "../../assets/vietnam.png";
import england from "../../assets/united-kingdom.png";
import { useCart } from "./cartContext";
import "../../styles/CheckoutPage.css";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";

const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => total + item.total, 0);
};

const Checkout = () => {
  const { state } = useLocation();
  const [selectedCartItems, setSelectedCartItems] = useState(
    state?.selectedCartItems || []
  );
  const [couponCode, setCouponCode] = useState("");
  const [selectDiscount, setSelectDiscount] = useState("");
  const [defaultAddress, setDefaultAddress] = useState("");
  const [openDiscountModal, setOpenDiscountModal] = useState(false);
  const [checkAmountDiscount, setCheckAmountDiscount] = useState(false);
  const user = useSelector((state) => state.user.user);
  const { cartId } = useCart();
  const [bankCode, setBankCode] = useState("VNPAYQR");
  const [language, setLanguage] = useState("vn");
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const data = await addressApi.getDefaultAddress();
        if (data.length > 0) setDefaultAddress(data[0]);
      } catch (error) {
        console.error("Lỗi khi lấy địa chỉ mặc định:", error);
      }
    };
    fetchDefaultAddress();
  }, []);

  const totalPrice = useMemo(() => {
    let total = calculateTotalPrice(selectedCartItems);
    if (
      selectDiscount?.minOrderAmount &&
      total < selectDiscount.minOrderAmount
    ) {
      setCheckAmountDiscount(true);
      return total;
    } else {
      setCheckAmountDiscount(false);
    }
    if (selectDiscount?.percent) {
      total -= (total * selectDiscount.percent) / 100;
    }
    return total;
  }, [selectedCartItems, selectDiscount]);

  const additionalFee = useMemo(() => totalPrice * 0.1, [totalPrice]);

  const shippingFee = useMemo(() => {
    if (!checkAmountDiscount) return totalPrice >= 500000 ? 0 : 50000;
    if (selectDiscount?.freeShipping) return 0;
    return totalPrice >= 500000 ? 0 : 50000;
  }, [totalPrice, selectDiscount]);

  const finalAmount = useMemo(
    () => totalPrice + additionalFee + shippingFee,
    [totalPrice, additionalFee, shippingFee]
  );

  const totalDiscount = useMemo(() => {
    if (!checkAmountDiscount) return 0;
    const percentDiscount = selectDiscount?.percent
      ? (calculateTotalPrice(selectedCartItems) * selectDiscount.percent) / 100
      : 0;
    const shippingDiscount = selectDiscount?.freeShipping ? 50000 : 0;
    return percentDiscount + shippingDiscount;
  }, [selectedCartItems, selectDiscount]);

  const formattedAddress = defaultAddress
    ? `${defaultAddress.detail}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.province}`
    : "Chưa có địa chỉ mặc định";

  const handleRemoveItem = async (index) => {
    const updateItems = [...selectedCartItems];
    updateItems.splice(index, 1);
    setSelectedCartItems(updateItems);
  };

  const handleCheckout = async (event) => {
    event.preventDefault();

    if (
      !finalAmount ||
      !formattedAddress ||
      !user?.data?._id ||
      !selectedCartItems.length
    ) {
      console.error("Dữ liệu không hợp lệ! Hãy kiểm tra lại.");
      return;
    }

    const payload = {
      cartId,
      amount: finalAmount,
      numberphone: user.data.profileId?.numberphone,
      addressDetail: formattedAddress,
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
      <Header hideNav />
      <div className="checkout-container">
        {/* Danh sách sản phẩm */}
        <div className="checkout-item-container">
          <div className="checkout-item-grid">
            {selectedCartItems.map((item, index) => (
              <div key={index} className="checkout-item-card">
                <button
                  className="checkout-item-remove"
                  onClick={() => handleRemoveItem(index)}
                >
                  ×
                </button>
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="checkout-item-image"
                />
                <div className="checkout-item-details">
                  <h3 className="checkout-item-title">{item.product.title}</h3>
                  <p className="checkout-item-text">
                    <strong>Size:</strong> {item.size} &nbsp;|&nbsp;
                    <strong>Màu:</strong> {item.color}
                  </p>
                  <p className="checkout-item-text">
                    <strong>Số lượng:</strong> {item.quantity}
                  </p>
                  <p className="checkout-item-text">
                    <strong>Đơn giá:</strong>
                    <span className="checkout-price-original">
                      {(item.originalPrice || item.price * 2).toLocaleString()}{" "}
                      VND
                    </span>
                    <span className="checkout-price-sale">
                      {item.price.toLocaleString()} VND
                    </span>
                  </p>
                  <p className="checkout-item-total">
                    Tổng: {item.total.toLocaleString()} VND
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thông tin & thanh toán */}
        <div className="checkout-summary">
          <h2 className="checkout-summary-h2">ĐƠN HÀNG</h2>
          {/* THÔNG TIN KHÁCH HÀNG */}
          <h4 className="checkout-summary-h4">1. Thông tin Khách hàng</h4>
          <p className="checkout-summary-p">
            <span>Họ tên: </span> {user.data.profileId?.username}
          </p>
          <p className="checkout-summary-p">
            <span>Số điện thoại: </span> {user.data.profileId?.numberphone}
          </p>
          <p className="checkout-summary-p">
            <span>Địa chỉ: </span> {formattedAddress}
          </p>
          <p className="checkout-summary-sub">
            (Nếu bạn muốn thay đổi địa chỉ giao hàng, vui lòng vào phần{" "}
            <a href="/levents/profile/address">Hồ sơ người dùng</a> để cập nhật
            thông tin địa chỉ.)
          </p>
          {/* THÔNG TIN ĐƠN HÀNG */}
          <h4 className="checkout-summary-h4">2. Thông tin đơn hàng</h4>
          <p className="checkout-summary-p">
            <span>Tổng tiền sản phẩm: </span>
            {totalPrice.toLocaleString()} VND
          </p>
          <p className="checkout-summary-p">
            <span>Phí VAT (10%): </span>
            {additionalFee.toLocaleString()} VND
          </p>
          <p className="checkout-summary-p">
            <span> Phí vận chuyển:</span>
            {shippingFee === 0 ? (
              <span style={{ color: "green" }}>Miễn phí</span>
            ) : (
              `${shippingFee.toLocaleString()} VND`
            )}
          </p>
          <p className="checkout-summary-p">
            <span>Tiết kiệm</span> -{totalDiscount.toLocaleString()} VND
          </p>
          {shippingFee !== 0 && (
            <p className="checkout-summary-sub">
              Mua thêm sản phẩm để được <strong>miễn phí vận chuyển</strong>!
            </p>
          )}
          <h4 className="checkout-summary-h5">
            Thành tiền: {finalAmount.toLocaleString()} VND
          </h4>

          <h2 className="checkout-summary-h4">3. Phương thức thanh toán</h2>
          <h4 className="checkout-summary-h5">Thanh toán</h4>
          <div className="payment-options">
            {[
              {
                value: "VNPAYQR",
                img: qrVNPAY,
                label: "Quét Mã QR",
              },
              {
                value: "VNBANK",
                img: atmVNPAY,
                label: "Thẻ ATM Nội Địa",
              },
              {
                value: "INTCARD",
                img: visaVNPAY,
                label: "Thẻ MasterCard Visa",
              },
            ].map((option) => (
              <CustomTooltip key={option.value} title={option.label}>
                <span>
                  <div
                    className={`payment-card ${bankCode === option.value ? "selected" : ""}`}
                    onClick={() => setBankCode(option.value)}
                  >
                    <img
                      src={option.img}
                      alt={option.label}
                      className="payment-icon"
                    />
                  </div>
                </span>
              </CustomTooltip>
            ))}
          </div>

          <h4 className="checkout-summary-h5">Ngôn ngữ</h4>
          <div className="language-options">
            {[
              {
                value: "vn",
                label: "Tiếng Việt",
                img: vietnam,
              },
              {
                value: "en",
                label: "Tiếng Anh",
                img: england,
              },
            ].map((option) => (
              <div
                key={option.value}
                className={`language-card ${language === option.value ? "selected" : ""}`}
                onClick={() => setLanguage(option.value)}
              >
                <img
                  src={option.img}
                  alt={option.label}
                  className="language-icon"
                />
                <span className="language-label">{option.label}</span>
              </div>
            ))}
          </div>

          <h4 className="checkout-summary-h5">Mã giảm</h4>
          <div style={{ margin: "1rem 0" }}>
            <TextField
              label="Nhập mã giảm giá"
              variant="outlined"
              size="small"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <Button
              variant="outlined"
              onClick={() => setOpenDiscountModal(true)}
              fullWidth
            >
              Chọn mã giảm giá
            </Button>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckout}
            fullWidth
            sx={{ mt: 2 }}
          >
            Tiến hành thanh toán
          </Button>
        </div>
      </div>

      {/* Modal chọn mã giảm giá */}
      <Modal
        open={openDiscountModal}
        onClose={() => setOpenDiscountModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openDiscountModal}>
          <div
            style={{
              width: 500,
              margin: "10% auto",
              background: "#fff",
              padding: 24,
              borderRadius: 8,
            }}
          >
            <DiscountPage
              onSelectDiscount={(discount) => {
                if (discount) {
                  setSelectDiscount(discount);
                  setCouponCode(discount.code);
                }
                setOpenDiscountModal(false);
              }}
            />
          </div>
        </Fade>
      </Modal>

      <Footer />
    </>
  );
};

export default Checkout;

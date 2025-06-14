import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Divider,
  TextField,
  Radio,
} from "@mui/material";
import "../../styles/CheckoutPage.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useSelector } from "react-redux";
import addressApi from "../../features/address/addressApi";
import DiscountPage from "./DiscountPage";
import { Modal, Backdrop, Fade } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

// Hàm tính toán chi phí
const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => total + item.total, 0);
};

const Checkout = () => {
  const { state } = useLocation();
  const selectedCartItems = state?.selectedCartItems || [];
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [selectDiscount, setSelectDiscount] = useState("");
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [defaultAddress, setDefaultAddress] = useState("");
  const [openDiscountModal, setOpenDiscountModal] = useState(false);
  const [checkAmountDiscount, setCheckAmountDiscount] = useState(false);

  // Lấy địa chỉ mặc định của user đang đăng nhập
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const data = await addressApi.getDefaultAddress();
        if (data.length > 0) {
          setDefaultAddress(data[0]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy địa chỉ mặc định:", error);
      }
    };
    fetchDefaultAddress();
  }, []);

  // Sử dụng useMemo để tối ưu hóa tính toán
  // Tiền hàng sản phẩm
  const totalPrice = useMemo(() => {
    let total = calculateTotalPrice(selectedCartItems);
    if (
      selectDiscount?.minOrderAmount &&
      total < selectDiscount.minOrderAmount
    ) {
      setCheckAmountDiscount(true);
      return total; // Giữ nguyên giá trị ban đầu, không áp dụng giảm giá
    } else {
      setCheckAmountDiscount(false);
    }
    if (selectDiscount?.percent) {
      total -= (total * selectDiscount.percent) / 100;
    }
    return total;
  }, [selectedCartItems, selectDiscount]);

  const discountWarning = useMemo(() => {
    if (
      selectDiscount?.minOrderAmount &&
      totalPrice < selectDiscount.minOrderAmount
    ) {
      return `Vui lòng mua thêm sản phẩm để sử dụng mã giảm (Yêu cầu đơn tối thiểu ${selectDiscount.minOrderAmount.toLocaleString()} VND).`;
    }
    return "";
  }, [totalPrice, selectDiscount]);

  // Tiền giá trị gia tăng
  const additionalFee = useMemo(() => totalPrice * 0.1, [totalPrice]);

  // TiềnTiền ship
  const shippingFee = useMemo(() => {
    if (!checkAmountDiscount) return totalPrice >= 500000 ? 0 : 50000;
    if (selectDiscount?.freeShipping) return 0;
    return totalPrice >= 500000 ? 0 : 50000;
  }, [totalPrice, selectDiscount]);

  // Tổng cộng tiền
  const finalAmount = useMemo(
    () => totalPrice + additionalFee + shippingFee,
    [totalPrice, additionalFee, shippingFee]
  );

  // Tính tổng số tiền được giảm
  const totalDiscount = useMemo(() => {
    if (!checkAmountDiscount) return 0;
    else {
      const discountFromPercent = selectDiscount?.percent
        ? (calculateTotalPrice(selectedCartItems) * selectDiscount.percent) /
          100
        : 0;
      const discountFromShipping = selectDiscount?.freeShipping ? 50000 : 0;

      return discountFromPercent + discountFromShipping;
    }
  }, [selectedCartItems, selectDiscount]);

  // Format địa chỉ
  const formattedAddress = defaultAddress
    ? `${defaultAddress.detail}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.province}`
    : "Chưa có địa chỉ mặc định";

  // Xử lý thanh toán
  const handleCheckout = () => {
    if (paymentMethod === "vnpay") {
      navigate("/levents/payment", {
        state: {
          selectedCartItems, // Danh sách sản phẩm
          totalPrice, // Tổng tiền sản phẩm
          additionalFee, // Phí VAT
          shippingFee, // Phí vận chuyển
          finalAmount, // Tổng tiền thanh toán cuối cùng
          user, // Thông tin user
        },
      });
    } else {
      alert("Thanh toán khi nhận hàng được xử lý trực tiếp.");
    }
  };

  return (
    <>
      <Header hideNav={true} />
      <Container className="checkout-container">
        {/* DANH SÁCH SẢN PHẨM */}
        <div className="checkout-items">
          <h2 className="checkout-items-title">SẢN PHẨM CỦA BẠN</h2>
          {selectedCartItems.map((item, index) => (
            <div className="checkout-item" key={index}>
              <img
                src={item.product.images[0]}
                alt={item.product.title}
                className="checkout-item-image"
              />
              <div className="checkout-item-info">
                <Typography variant="h6">{item.product.title}</Typography>
                <Typography>
                  Size: {item.size} | Màu: {item.color}
                </Typography>
                <Typography>Số lượng: {item.quantity}</Typography>
                <Typography>Giá: {item.price.toLocaleString()} VND</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Tổng: {item.total.toLocaleString()} VND
                </Typography>
              </div>
            </div>
          ))}
        </div>

        {/* THÔNG TIN ĐƠN HÀNG */}
        <div className="checkout-summary">
          <h3 className="checkout-summary-title">TỔNG CỘNG</h3>

          {/* Thông tin cá nhân */}
          <div className="user-info">
            <Typography variant="h4" fontWeight="bold">
              THÔNG TIN CÁ NHÂN
            </Typography>
            <Typography>Họ tên: {user.data.profileId?.username}</Typography>
            <Typography>SĐT: {user.data.profileId?.numberphone}</Typography>
            <Typography>Địa chỉ: {formattedAddress}</Typography>
          </div>

          <Typography>
            <strong>Tổng tiền sản phẩm:</strong> {totalPrice.toLocaleString()}{" "}
            VND
          </Typography>
          <Typography>
            <strong>Phí gia tăng (VAT 10%):</strong>{" "}
            {additionalFee.toLocaleString()} VND
          </Typography>
          <Typography>
            <strong>Phí vận chuyển:</strong>{" "}
            <LocalShippingIcon
              style={{ verticalAlign: "middle", marginRight: 5, color: "gray" }}
            />
            {shippingFee === 0 ? (
              <span style={{ color: "green", fontWeight: "bold" }}>
                Miễn phí vận chuyển
              </span>
            ) : (
              `${shippingFee.toLocaleString()} VND`
            )}
          </Typography>
          <Typography style={{ color: "red", fontWeight: "bold" }}>
            <strong>Tiết kiệm:</strong> - {totalDiscount.toLocaleString()} VND
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            <strong>Thành tiền:</strong> {finalAmount.toLocaleString()} VND
          </Typography>
          {discountWarning && (
            <Typography
              style={{ color: "red", fontWeight: "bold", marginTop: 8 }}
            >
              {discountWarning}
            </Typography>
          )}
          <Divider className="checkout-divider" />

          {/* Phương thức thanh toán */}
          <div className="checkout-payment-methods">
            <Typography variant="h6">Phương thức thanh toán</Typography>
            <div className="payment-option">
              <Radio
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <Typography>Thanh toán khi nhận hàng</Typography>
            </div>
            <div className="payment-option">
              <Radio
                checked={paymentMethod === "vnpay"}
                onChange={() => setPaymentMethod("vnpay")}
              />
              <Typography>Thanh toán qua cổng VNPAY</Typography>
            </div>
          </div>

          {/* Nhập mã giảm giá */}
          <div className="coupon-section">
            <TextField
              className="coupon-input"
              label="Nhập mã giảm giá"
              variant="outlined"
              size="small"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button
              className="coupon-button"
              variant="contained"
              onClick={() => setOpenDiscountModal(true)}
            >
              Áp dụng
            </Button>
          </div>

          <Button
            variant="contained"
            color="primary"
            className="checkout-btn"
            onClick={handleCheckout}
          >
            Tiến hành thanh toán
          </Button>
        </div>
      </Container>
      {/* Modal hiển thị danh sách mã giảm giá */}
      <Modal
        open={openDiscountModal}
        onClose={() => setOpenDiscountModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openDiscountModal}>
          <div className="discount-modal">
            <DiscountPage
              onSelectDiscount={(discount) => {
                if (discount) {
                  console.log(discount);
                  setSelectDiscount(discount);
                  setCouponCode(discount.code);
                }
                setOpenDiscountModal(false); // Đóng modal khi chọn mã
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

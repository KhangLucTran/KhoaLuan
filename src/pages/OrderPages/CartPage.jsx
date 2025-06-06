// src/components/Cart.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../OrderPages/cartContext";
import LineItem from "../OrderPages/LineItem";
import "../../styles/CartPage.css";
import { deleteLineItemFromCartApi } from "../../features/cart/cartApi";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const Cart = () => {
  const { cartId, lineItems, updateCartItem, fetchCartData, setTotalQuantity } =
    useCart();
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectItem = (id, isSelected) => {
    setSelectedItems((prev) => ({ ...prev, [id]: isSelected }));
  };

  useEffect(() => {
    fetchCartData();
  }, [location.pathname]);

  const handleQuantityChange = (id, newQuantity) => {
    const updatedItems = lineItems.map((item) =>
      item._id === id
        ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
        : item
    );

    updateCartItem(updatedItems);

    // Cập nhật tổng số lượng ngay lập tức
    const newTotalQuantity = updatedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    setTotalQuantity(newTotalQuantity);
  };

  // Xử lí khi xóa 1 LineItem
  const handleDeleteItem = async (lineItemId) => {
    try {
      if (!cartId) {
        console.error("Cart ID is missing");
        return;
      }
      // Sử dụng API xóa line item mới, truyền cartId và lineItemId
      await deleteLineItemFromCartApi(cartId, lineItemId);
      const updatedItems = lineItems.filter((item) => item._id !== lineItemId);
      updateCartItem(updatedItems);
      // Gọi fetchCartData để cập nhật lại dữ liệu từ API
      await fetchCartData();
    } catch (error) {
      console.error("Error deleting line item:", error);
    }
  };

  const handleCheckout = () => {
    const selectedCartItems = lineItems.filter(
      (item) => selectedItems[item._id]
    );
    navigate("/levents/checkout", { state: { selectedCartItems } });
  };

  if (lineItems.length === 0) {
    return (
      <div className="card-list-section">
        <h1 className="card-list-title">Giỏ hàng của bạn</h1>
        <p className="card-list-no-items">Giỏ hàng của bạn hiện đang trống.</p>
      </div>
    );
  }

  const calculateInvoice = () => {
    const selectedCartItems = lineItems.filter(
      (item) => selectedItems[item._id]
    );
    const totalQuantity = selectedCartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const subtotal = selectedCartItems.reduce(
      (sum, item) => sum + item.total,
      0
    );
    const tax = subtotal * 0.1; // Giả sử VAT là 10%
    const total = subtotal + tax;

    return { totalQuantity, subtotal, tax, total };
  };
  const { totalQuantity, subtotal, tax, total } = calculateInvoice();
  return (
    <>
      <Header hideNav={true} />
      <h2 className="card-list-title">GIỎ HÀNG</h2>
      <div className="card-list-section">
        <div className="card-list-grid">
          {lineItems.map((item) => (
            <LineItem
              key={item._id}
              item={item}
              isSelected={!!selectedItems[item._id]}
              onSelect={handleSelectItem}
              onQuantityChange={handleQuantityChange}
              onDeleteItem={handleDeleteItem}
            />
          ))}
        </div>

        {/* Hóa đơn tổng quan */}
        <div className="checkout-section">
          <div className="checkout-section-info">
            <div className="invoice">
              <h3>
                <strong>TỔNG ĐƠN HÀNG</strong> | {totalQuantity} SẢN PHẨM
              </h3>
              <p>
                Tổng cộng
                <span>{subtotal.toLocaleString()} VND</span>
              </p>
              <p>
                Đã bao gồm thuế giá trị gia tăng
                <span>{tax.toLocaleString()} VND</span>
              </p>
              <hr />
              <h3>
                <strong>TỔNG CỘNG ĐẶT HÀNG</strong>{" "}
                <span> {total.toLocaleString()} VND</span>
              </h3>
            </div>
          </div>
          {/* Thêm thông báo miễn phí giao hàng */}
          <p className="free-shipping-note">
            🚚 Miễn phí giao hàng áp dụng cho đơn hàng giao tận nơi từ
            500.000VND và tất cả các đơn nhận tại cửa hàng (Click & Collect).
          </p>
          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={!Object.values(selectedItems).some((v) => v)}
          >
            THANH TOÁN
          </button>

          <button
            className="checkout continue"
            onClick={() => navigate("/levents/products")}
          >
            TIẾP TỤC MUA SẮM
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getUserCartApi } from "../../features/cart/cartApi";
import { getLineitemApi } from "../../features/lineitem/lineItemApi";
import PropTypes from "prop-types";
import { getAuthTokens } from "../../utils/token";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false); // ✅ Thêm trạng thái kiểm soát
  const token = getAuthTokens().accessToken;

  // ✅ Cập nhật số lượng khi lineItems thay đổi
  useEffect(() => {
    const total = lineItems.reduce((sum, item) => sum + item.quantity, 0);
    setTotalQuantity(total);
  }, [lineItems]);

  // ✅ Hàm lấy dữ liệu giỏ hàng (chỉ gọi khi cần)
  const fetchCartData = useCallback(async () => {
    if (!token || loading) return;
    setLoading(true);
    try {
      const cartData = await getUserCartApi();
      setCartId(cartData._id);
      const fetchedCartItems = cartData.items || [];

      if (fetchedCartItems.length === 0) {
        setCartItems([]);
        setLineItems([]);
      } else {
        setCartItems(fetchedCartItems);

        // ✅ Chỉ gọi API nếu lineItems chưa có hoặc dữ liệu khác
        if (lineItems.length !== fetchedCartItems.length) {
          const lineItemResponses = await Promise.all(
            fetchedCartItems.map((itemId) => getLineitemApi(itemId))
          );
          setLineItems(lineItemResponses.filter((item) => item !== null));
        }
      }
      setIsFetched(true); // ✅ Đánh dấu đã fetch xong
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error.message);
    }
    setLoading(false);
  }, [token, loading, isFetched]);

  // ✅ Chỉ gọi API khi `cartId` thay đổi
  useEffect(() => {
    if (!cartId) {
      fetchCartData();
    }
  }, [cartId, fetchCartData]);

  // ✅ Cập nhật giỏ hàng mà không cần gọi API
  const updateCartItem = (updatedItems) => {
    setLineItems(updatedItems);
  };

  // ✅ Reset giỏ hàng khi đăng xuất
  const resetCart = () => {
    setCartId(null);
    setCartItems([]);
    setLineItems([]);
    setTotalQuantity(0);
    setIsFetched(false);
  };

  return (
    <CartContext.Provider
      value={{
        cartId,
        cartItems,
        lineItems,
        updateCartItem,
        totalQuantity,
        fetchCartData,
        resetCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;

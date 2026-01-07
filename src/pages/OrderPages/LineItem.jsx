// src/components/LineItem.jsx
import PropTypes from "prop-types";
import "../../styles/LineItem.css";
import { updateLineitemApi } from "../../features/lineitem/lineitemApi";

const LineItem = ({
  item,
  isSelected,
  onSelect,
  onQuantityChange,
  onDeleteItem,
}) => {
  const { _id, product, size, color, quantity, price, total, gender } = item;

  const formatPrice = (value) =>
    typeof value === "number" ? value.toLocaleString() : "N/A";

  const handleSelect = (e) => {
    onSelect(_id, e.target.checked);
  };

  const handleQuantityChange = async (operation) => {
    const newQuantity = operation === "increment" ? quantity + 1 : quantity - 1;

    if (newQuantity > 0) {
      const updatedItem = {
        quantity: newQuantity,
        total: newQuantity * price, // Cập nhật total luôn
      };

      await updateLineitemApi(_id, updatedItem)
        .then(() => onQuantityChange(_id, newQuantity))
        .catch((error) => console.error("Lỗi khi cập nhật số lượng:", error));
    }
  };

  const handleDelete = async () => {
    try {
      await onDeleteItem(_id);
    } catch (error) {
      console.error("Error deleting line item:", error);
    }
  };

  return (
    <div className={`line-item-cart ${isSelected ? "selected" : ""}`}>
      <div className="line-item-checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="line-item-checkbox-input"
        />
      </div>
      <img
        src={product?.images?.[0] || "default-image-url"}
        alt={product?.title || "No title available"}
        className="line-item-image"
      />
      <div className="line-item-info">
        <p className="line-item-title">{product.title}</p>
        <p>Kích thước: {size}</p>
        <p>Màu sắc: {color}</p>
        <p>Giới tính: {gender === "Other" ? "Unisex" : gender}</p>
        <div className="line-item-quantity">
          <button
            onClick={() => handleQuantityChange("decrement")}
            className="quantity-btn"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => handleQuantityChange("increment")}
            className="quantity-btn"
          >
            +
          </button>
        </div>
        <p>Price: {formatPrice(price)} VND</p>
        <p>Total: {formatPrice(total)} VND</p>
      </div>
      <button className="cart-delete-btn" onClick={handleDelete}>
        🗑️
      </button>
    </div>
  );
};

LineItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    product: PropTypes.shape({
      title: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    size: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};

export default LineItem;

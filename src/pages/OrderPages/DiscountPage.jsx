import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Collapse,
  Checkbox,
} from "@mui/material";
import {
  LocalShipping,
  ShoppingCart,
  Percent,
  Event,
} from "@mui/icons-material";
import "../../styles/DiscountPage.css";
import { getDiscountApi } from "../../features/discount/discountApi";
import PropTypes from "prop-types";

const DiscountPage = ({ onSelectDiscount }) => {
  const [discounts, setDiscounts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const res = await getDiscountApi();
      setDiscounts(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách giảm giá:", error);
    }
  };

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSelect = (discount) => {
    setSelectedDiscount(
      selectedDiscount?._id === discount._id ? null : discount
    );
    onSelectDiscount &&
      onSelectDiscount(
        discount?._id === selectedDiscount?._id ? null : discount
      );
  };

  return (
    <div className="discount-page">
      <h3 className="page-title">DANH SÁCH MÃ GIẢM GIÁ</h3>
      <div className="discount-container">
        {discounts.map((discount) => {
          const usedPercentage =
            (discount.usedCount / discount.usageLimit) * 100;
          const isSelected = selectedDiscount?._id === discount._id;

          return (
            <div className="discount-item" key={discount._id}>
              <Card
                className={`discount-card ${isSelected ? "selected" : ""}`}
                onClick={() => handleToggle(discount._id)}
              >
                {/* Header */}
                <div className="discount-header">
                  <div className="discount-brand">Levents</div>
                  <div className="discount-info">
                    <Typography variant="h6" className="discount-code">
                      {discount.code}
                    </Typography>
                    <Typography className="discount-percent">
                      <Percent style={{ marginRight: 5, color: "#1877F2" }} />
                      {discount.percent}% giảm giá
                    </Typography>
                    <Typography className="discount-min-order">
                      <ShoppingCart
                        style={{ marginRight: 5, color: "#1877F2" }}
                      />
                      Tối thiểu: {discount.minOrderAmount.toLocaleString()} VND
                    </Typography>
                  </div>
                  <Checkbox
                    checked={isSelected}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => {
                      handleSelect(discount);
                      event.stopPropagation();
                    }}
                    className="discount-checkbox"
                    color="primary"
                  />
                </div>

                {/* Nội dung mở rộng khi click */}
                <Collapse in={expandedId === discount._id}>
                  <CardContent>
                    {discount.freeShipping && (
                      <Chip
                        label="🚛 Miễn phí vận chuyển"
                        style={{ background: "#1877F2", color: "#FFFFFF" }}
                        className="discount-chip"
                      />
                    )}

                    <Typography className="discount-details">
                      <LocalShipping
                        style={{ marginRight: 5, color: "#1877F2" }}
                      />
                      Áp dụng cho:{" "}
                      <strong>{discount.applicableProducts.join(", ")}</strong>
                    </Typography>

                    {/* Tiến trình sử dụng */}
                    <div className="discount-progress-container">
                      <Typography
                        variant="body2"
                        style={{ marginRight: 8, color: "#000000" }}
                      >
                        Đã dùng:
                      </Typography>
                      <div className="discount-progress-wrapper">
                        <LinearProgress
                          variant="determinate"
                          value={usedPercentage}
                          className="discount-progress"
                        />
                      </div>
                      <Typography variant="body2" style={{ color: "#000000" }}>
                        {Math.round(usedPercentage)}%
                      </Typography>
                    </div>

                    {/* Hạn sử dụng */}
                    <Typography className="discount-expiration">
                      <Event style={{ marginRight: 5, color: "#1877F2" }} />
                      Hạn sử dụng:{" "}
                      <strong>
                        {new Date(discount.endDate).toLocaleDateString()}
                      </strong>
                    </Typography>

                    {/* Trạng thái mã */}
                    <Chip
                      label={
                        discount.status === "Active"
                          ? "Đang hoạt động"
                          : "Hết hạn"
                      }
                      style={{
                        background:
                          discount.status === "Active" ? "#1877F2" : "#000000",
                        color: "#FFFFFF",
                      }}
                      className="discount-status"
                    />
                  </CardContent>
                </Collapse>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscountPage;

// Định nghĩa propTypes
DiscountPage.propTypes = {
  onSelectDiscount: PropTypes.func, // Hàm callback, không bắt buộc
};

// Giá trị mặc định nếu không truyền prop
DiscountPage.defaultProps = {
  onSelectDiscount: () => {}, // Mặc định là một function rỗng
};

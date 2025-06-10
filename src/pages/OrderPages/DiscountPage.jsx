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
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { showErrorToast, showSuccessToast } from "../../components/Toast/Toast";

// Hàm mới gọi API lấy discount đã dùng và chưa dùng của user theo userId
import { getDiscountsByUserApi } from "../../features/discount/discountApi";

const DiscountPage = ({ onSelectDiscount, isCheckoutPage }) => {
  const [usedDiscounts, setUsedDiscounts] = useState([]);
  const [unusedDiscounts, setUnusedDiscounts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      // Gọi API lấy discount đã dùng và chưa dùng theo userId
      const res = await getDiscountsByUserApi();

      // Cập nhật state theo response
      setUsedDiscounts(res.used || []);
      setUnusedDiscounts(res.unused || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách giảm giá:", error);
    }
  };

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSelect = async (discount) => {
    const isSelected = selectedDiscount?._id === discount._id;
    const newDiscount = isSelected ? null : discount;

    setSelectedDiscount(newDiscount);
    onSelectDiscount(newDiscount);

    if (!isSelected && discount?.code) {
      try {
        showSuccessToast("Áp dụng mã giảm giá thành công!");
      } catch (err) {
        showErrorToast(err.message);
      }
    }
  };

  const renderDiscountCard = (discount, isDisabled = false) => {
    const usedPercentage = (discount.usedCount / discount.usageLimit) * 100;
    const isSelected = selectedDiscount?._id === discount._id;
    const hasUsed = discount.usedBy?.includes(userId);

    return (
      <div className="discount-item" key={discount._id}>
        <Card
          className={`discount-card ${
            isSelected ? "selected" : ""
          } ${hasUsed ? "used" : "not-used"}`}
          onClick={() => {
            if (!isDisabled) handleToggle(discount._id);
          }}
        >
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
                <ShoppingCart style={{ marginRight: 5, color: "#1877F2" }} />
                Tối thiểu: {discount.minOrderAmount.toLocaleString()} VND
              </Typography>
            </div>

            <div className="discount-checkbox-container">
              {isCheckoutPage &&
                (hasUsed ? (
                  <Typography className="discount-used-label">
                    Bạn đã sử dụng
                  </Typography>
                ) : (
                  <Checkbox
                    checked={isSelected}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => {
                      event.stopPropagation();
                      handleSelect(discount);
                    }}
                    className="discount-checkbox"
                    color="primary"
                    disabled={isDisabled}
                  />
                ))}
            </div>
          </div>

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
                <LocalShipping style={{ marginRight: 5, color: "#1877F2" }} />
                Áp dụng cho:{" "}
                <strong>{discount.applicableProducts.join(", ")}</strong>
              </Typography>

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

              <Typography className="discount-expiration">
                <Event style={{ marginRight: 5, color: "#1877F2" }} />
                Hạn sử dụng:{" "}
                <strong>
                  {new Date(discount.endDate).toLocaleDateString()}
                </strong>
              </Typography>

              <Chip
                label={
                  discount.status === "Active" ? "Đang hoạt động" : "Hết hạn"
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
  };

  return (
    <div className="discount-page">
      <h3 className="page-title">DANH SÁCH MÃ GIẢM GIÁ</h3>
      <div className="discount-container">
        {unusedDiscounts.length > 0 && (
          <>
            <h4 className="discount-section-title">Mã giảm giá chưa dùng</h4>
            {unusedDiscounts.map((discount) => renderDiscountCard(discount))}
          </>
        )}

        {usedDiscounts.length > 0 && (
          <>
            <h4 className="discount-section-title">Mã giảm giá đã dùng</h4>
            {usedDiscounts.map((discount) =>
              renderDiscountCard(discount, true)
            )}
          </>
        )}

        {/* Trường hợp không có mã giảm giá */}
        {unusedDiscounts.length === 0 && usedDiscounts.length === 0 && (
          <Typography>Chưa có mã giảm giá nào.</Typography>
        )}
      </div>
    </div>
  );
};

DiscountPage.propTypes = {
  onSelectDiscount: PropTypes.func,
  isCheckoutPage: PropTypes.bool,
  selectedCartItems: PropTypes.array,
};

DiscountPage.defaultProps = {
  onSelectDiscount: () => {},
  isCheckoutPage: false,
  selectedCartItems: [],
};

export default DiscountPage;

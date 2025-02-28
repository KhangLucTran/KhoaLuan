import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { getProductByIdApi } from "../../features/product/productApi";
import "../../styles/ProductDetail.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShareIcon from "@mui/icons-material/Share";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import useProtectedDialog from "../../hooks/protectedDialogHook";
import DetailedDialog from "../../components/Toast/Dialog";
import ShareNotification from "../../components/Toast/ShareToast"; // Import ShareNotification component
import { createLineitemApi } from "../../features/lineitem/lineItemApi";
import { useSelector } from "react-redux";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showShareNotification, setShowShareNotification] = useState(false); // State để điều khiển việc hiển thị ShareNotification
  const navigate = useNavigate();
  const { open, setOpen, handleProtectedAction, redirectPath } =
    useProtectedDialog();
  const user = useSelector((state) => state.user.user);

  // Lấy sản phẩm qua API.
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductByIdApi(id);
        setProduct(data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error.message);
      }
    };
    fetchProduct();
  }, [id]);

  // Hàm tạo LineItem và điều hướng sang trang Cart
  const handleAddToCart = async () => {
    if (!size || !color) {
      alert("Vui lòng chọn kích thước và màu sắc.");
      return;
    }
    try {
      const newItem = {
        product: product._id,
        size,
        color,
        gender: product.gender || "Other", // Nếu product không có gender, mặc định là Other
        quantity,
        price: product.price,
        total: product.price * quantity,
      };

      const createdLineItem = await createLineitemApi(newItem);
      console.log("LineItem tạo thành công:", createdLineItem);
      // Sau khi tạo thành công, chuyển hướng sang trang giỏ hàng
      navigate("/levents/cart");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error.message);
    }
  };

  // Xử lí khi click vào ShareIcon.
  const handleShareIcon = () => {
    setShowShareNotification(true); // Hiển thị ShareNotification khi nhấn vào icon Share
  };

  // Xử lí đóng ShareIcon.
  const handleCloseShareNotification = () => {
    setShowShareNotification(false);
  };

  // Nếu không có sản phẩm, hiện "Đang tải sản phầm"
  if (!product) {
    return <Typography>Đang tải sản phẩm...</Typography>;
  }

  // hàm xử lí tăng số lượng.
  const increaseQuantity = () => setQuantity(quantity + 1);
  // hàm xử lí giảm số lượng.
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <>
      <Header hideNav={true} />
      <div className="product-detail-container">
        <div className="product-images-grid">
          <CustomTooltip title={product.title}>
            <div className="product-grid">
              {product.images.map((img, index) => (
                <img key={index} src={img} alt={`Ảnh ${index + 1}`} />
              ))}
            </div>
          </CustomTooltip>
          <CustomTooltip title="Mô tả sản phẩm">
            <div className="product-images-grid-title">
              <h2>Mô tả</h2>
              <Typography variant="body1" className="product-description">
                {product.description || "Chưa có mô tả"}
              </Typography>
            </div>
          </CustomTooltip>
        </div>

        {/* Chia sẻ */}
        <div className="product-sidebar">
          <div className="product-title-icons">
            <p className="product-title">{product.title}</p>
            <div className="product-icons">
              <CustomTooltip title="Yêu Thích">
                <FavoriteBorderOutlinedIcon
                  fontSize="small"
                  sx={{ color: "#000", marginLeft: 2, cursor: "pointer" }}
                />
              </CustomTooltip>
              <CustomTooltip title="Chia sẻ">
                <ShareIcon
                  fontSize="small"
                  sx={{ color: "#000", marginLeft: 2, cursor: "pointer" }}
                  onClick={handleShareIcon} // Khi click vào Share icon, gọi handleShareIcon
                />
              </CustomTooltip>
            </div>
          </div>

          {/* Hiển thị màu sắc */}
          <div className="product-colors">
            <div className="color-options">
              {product.colors.map((c, index) => (
                <div
                  key={index}
                  className="color-circle"
                  style={{
                    backgroundColor: c,
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    margin: "5px",
                    border: color === c ? "2px solid #000" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setColor(c)}
                ></div>
              ))}
            </div>
            <p className="product-color-text">Màu sắc: {color}</p>
          </div>

          {/* Màu sắc */}
          <div className="product-options">
            <div className="size-options">
              {product.sizes?.map((s) => (
                <Button
                  key={s}
                  variant={size === s ? "contained" : "outlined"}
                  onClick={() => setSize(s)}
                  className="size-button"
                  sx={{
                    backgroundColor: size === s ? "#000" : "transparent",
                    color: size === s ? "#fff" : "#000",
                    padding: "8px 16px", // Điều chỉnh padding nếu cần
                    border: "1px solid #000", // Viền trong
                    outline: size === s ? "2px solid #333" : "none", // Viền ngoài có khoảng cách
                    outlineOffset: "3px", // Tạo khoảng cách giữa outline và border
                    "&:hover": {
                      backgroundColor: size === s ? "#333" : "transparent",
                      outline: "1px solid #333",
                    },
                  }}
                >
                  {s}
                </Button>
              ))}
            </div>
            <p className="product-size-text">Kích cỡ: {size}</p>
          </div>

          {/* Số tiền */}
          <h2 className="product-price">
            {product.price
              ? `${product.price.toLocaleString()} VND`
              : "Liên hệ"}
          </h2>

          {/* Nút tăng giảm số lượng */}
          <div className="quantity-control">
            <Button
              className="quantity-btn decrease-btn"
              onClick={decreaseQuantity}
              disabled={quantity === 1}
            >
              -
            </Button>
            <Typography variant="body1">{quantity}</Typography>
            <Button
              className="quantity-btn increase-btn"
              onClick={increaseQuantity}
            >
              +
            </Button>
          </div>

          {/* Số lượng trong kho */}
          <p className="product-quantity">
            Số lượng trong kho: {product.stock}
          </p>

          {/* Nút: Thêm vào giỏ hàng */}
          <CustomTooltip
            title={size && color ? "" : "Vui lòng chọn Kích thước và Màu sắc"}
          >
            <Box className="product-actions">
              <Button
                sx={{
                  borderRadius: 3,
                  padding: 1,
                  backgroundColor: "#000",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
                className="product-actions-button"
                variant="contained"
                onClick={() =>
                  !user
                    ? handleProtectedAction(
                        `/levents/product-detail/${product._id}`
                      )
                    : handleAddToCart()
                }
                disabled={!size || !color}
              >
                Thêm vào giỏ hàng
              </Button>
            </Box>
          </CustomTooltip>
        </div>
      </div>

      {/* Chia sẻ thông qua ShareNotification */}
      <ShareNotification
        productUrl={window.location.href} // Truyền URL sản phẩm
        open={showShareNotification}
        onClose={handleCloseShareNotification} // Đóng ShareNotification
      />

      {/*Thông báo khi chưa đăng nhập  */}
      <DetailedDialog
        open={open}
        onClose={() => setOpen(false)}
        redirectPath={redirectPath}
      />
      <Footer />
    </>
  );
};

export default ProductDetail;

// Định nghĩa các biến trong Product
ProductDetail.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    sizes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  IconButton,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import {
  getProductByIdApi,
  getProductsByCategoryApi,
} from "../../features/product/productApi";
import "../../styles/ProductDetail.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShareIcon from "@mui/icons-material/Share";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import useProtectedDialog from "../../hooks/protectedDialogHook";
import DetailedDialog from "../../components/Toast/Dialog";
import ShareNotification from "../../components/Toast/ShareToast";
import { createLineitemApi } from "../../features/lineitem/lineItemApi";
import { useSelector } from "react-redux";
import {
  addFavoriteUserApi,
  checkStatusFavoriteUserApi,
  deleteFavoriteUserApi,
} from "../../features/favorite/favoriteApi";
import { Favorite, FavoriteBorder, StarBorder } from "@mui/icons-material";

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Lấy danh sách sản phẩm khác cùng loại
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product || !product.category) return;
      try {
        console.log("Fetching category:", product.category);
        const response = await getProductsByCategoryApi(product.category);
        console.log("All products response:", response);

        // Đảm bảo response.product là mảng
        let allProducts = response?.product || [];
        if (!Array.isArray(allProducts)) {
          console.error(
            "API không trả về danh sách sản phẩm hợp lệ:",
            allProducts
          );
          return;
        }

        // Lọc bỏ sản phẩm hiện tại
        const filteredProducts = allProducts.filter(
          (p) => p._id !== product._id
        );

        // Xáo trộn danh sách và chỉ lấy 3 sản phẩm
        const shuffledProducts = filteredProducts.sort(
          () => 0.5 - Math.random()
        );
        setRelatedProducts(shuffledProducts.slice(0, 3));
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm liên quan:", error.message);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // Kiểm tra sản phẩm có trong danh sách yêu thích không.
  useEffect(() => {
    let isMounted = true;
    const checkFavorite = async () => {
      try {
        const response = await checkStatusFavoriteUserApi(id);
        console.log("Trạng thái yêu thích:", response); // Kiểm tra dữ liệu trả về
        if (isMounted) setIsFavorite(response.isFavorite);
      } catch (error) {
        console.error("Lỗi kiểm tra yêu thích:", error.message);
      }
    };
    checkFavorite();
    return () => {
      isMounted = false;
    };
  }, [id]);

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

  // Xử lí khi click vào Favorite
  const handleFavoriteClick = async () => {
    if (loading) return; // Ngăn chặn việc người dùng spam click
    setLoading(true);
    try {
      if (isFavorite) {
        await deleteFavoriteUserApi(id);
        setIsFavorite(false); // Cập nhật trạng thái sau khi xóa
      } else {
        await addFavoriteUserApi(id);
        setIsFavorite(true); // Cập nhật trạng thái sau khi thêm
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật danh sách yêu thích:", error.message);
    }
    setLoading(false);
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
      <div className="product-container">
        <div className="product-detail-container">
          <div className="product-images-grid">
            <CustomTooltip title={product.title}>
              <div className="product-grid">
                {product.images.map((img, index) => (
                  <img key={index} src={img} alt={`Ảnh ${index + 1}`} />
                ))}
              </div>
              <div className="product-description">
                <p>{product.description}</p>
              </div>
            </CustomTooltip>
          </div>

          {/* Chia sẻ */}
          <div className="product-sidebar">
            <div className="product-title-icons">
              <p className="product-title">{product.title}</p>
              <p className="product-sold">| Đã bán: {product.sold}</p>
              <div className="product-icons">
                {/* Icon Yêu thích */}
                <CustomTooltip title="Yêu Thích">
                  {isFavorite ? (
                    <FavoriteIcon
                      fontSize="small"
                      sx={{ color: "#333", marginLeft: 2, cursor: "pointer" }}
                      onClick={handleFavoriteClick}
                    />
                  ) : (
                    <FavoriteBorderOutlinedIcon
                      fontSize="small"
                      sx={{ color: "#000", marginLeft: 2, cursor: "pointer" }}
                      onClick={handleFavoriteClick}
                    />
                  )}
                </CustomTooltip>
                {/* Icon chia sẻ */}
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

        {/* Danh sách sản phẩm cùng loại khác */}
        <div className="product-other">
          <h2 className="product-other-title">SẢN PHẨM KHÁC ĐƯỢC QUAN TÂM</h2>
          <div className="related-products-grid">
            {relatedProducts && relatedProducts.length > 0 ? (
              relatedProducts.map((item) => (
                <Card
                  key={item._id}
                  className="product-card"
                  onClick={() =>
                    navigate(`/levents/product-detail/${item._id}`)
                  }
                  sx={{
                    width: 335,
                    boxShadow: "none",
                    background: "#fff",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  {/* Nút Yêu thích */}
                  <IconButton
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn chặn sự kiện lan ra Card
                      handleFavoriteClick();
                    }}
                  >
                    {isFavorite ? (
                      <Favorite sx={{ color: "black" }} />
                    ) : (
                      <FavoriteBorder sx={{ color: "#333" }} />
                    )}
                  </IconButton>

                  {/* Hình ảnh sản phẩm */}
                  <CardMedia
                    component="img"
                    height="400"
                    image={
                      item.images?.[1] ||
                      item.images?.[0] ||
                      "/placeholder-image.jpg"
                    }
                    alt={item.title || "Sản phẩm không có tiêu đề"}
                    sx={{ objectFit: "cover" }}
                  />

                  {/* Nội dung sản phẩm */}
                  <CardContent className="product-card-title">
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {item.title || "Sản phẩm chưa có tên"}
                    </Typography>
                    <Typography variant="body1" color="black" fontWeight="bold">
                      {item.price
                        ? `${item.price.toLocaleString()} VND`
                        : "Giá chưa cập nhật"}
                    </Typography>
                    <Typography>Đã bán: {item.sold ?? 0}</Typography>
                    <Box display="flex" alignItems="center">
                      <StarBorder color="inherit" />
                      <Typography variant="body2">
                        {item.rating !== undefined
                          ? `${item.rating} / 5`
                          : "Chưa có đánh giá"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>Không có sản phẩm nào</p>
            )}
          </div>
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
    sold: PropTypes.number.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    category: PropTypes.string,
    sizes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

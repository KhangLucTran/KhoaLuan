import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Dialog,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import "../../styles/ProductDetail.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Comment from "./CommentPage";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShareIcon from "@mui/icons-material/Share";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import useProtectedDialog from "../../hooks/protectedDialogHook";
import DetailedDialog from "../../components/Toast/Dialog";
import ShareNotification from "../../components/Toast/ShareToast";
import { createLineitemApi } from "../../features/lineitem/lineItemApi";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavoriteUserApi,
  checkStatusFavoriteUserApi,
  deleteFavoriteUserApi,
} from "../../features/favorite/favoriteApi";
import { StarBorder } from "@mui/icons-material";
import {
  fetchProductById,
  fetchRelatedProducts,
} from "../../features/product/productSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.selectedProduct);
  const relatedProducts = useSelector((state) => state.product.relatedProducts);
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
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (product?.category && product?._id) {
      dispatch(
        fetchRelatedProducts({
          category: product.category,
          currentProductId: product._id,
        })
      );
    }
  }, [product, dispatch]);
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

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

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
  if (!product || !product.title) {
    return <Typography>Sản phẩm không tồn tại hoặc đã bị xóa.</Typography>;
  }
  // hàm xử lí tăng số lượng.
  const increaseQuantity = () => setQuantity(quantity + 1);
  // hàm xử lí giảm số lượng.
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
  const SizeTable = () => {
    return (
      <div className="size-table-container">
        <div className="size-table-title">Bảng tham khảo Size</div>
        <table className="size-table">
          <thead>
            <tr>
              <th>Chiều cao</th>
              <th>Cân nặng</th>
              <th>Size gợi ý</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>&lt; 160 cm</td>
              <td>&lt; 50 kg</td>
              <td>XS</td>
            </tr>
            <tr>
              <td>&lt; 160 cm</td>
              <td>50 – 60 kg</td>
              <td>S</td>
            </tr>
            <tr>
              <td>&lt; 160 cm</td>
              <td>&gt; 60 kg</td>
              <td>M</td>
            </tr>
            <tr>
              <td>160 – 169 cm</td>
              <td>&lt; 55 kg</td>
              <td>S</td>
            </tr>
            <tr>
              <td>160 – 169 cm</td>
              <td>55 – 65 kg</td>
              <td>M</td>
            </tr>
            <tr>
              <td>160 – 169 cm</td>
              <td>&gt; 65 kg</td>
              <td>L</td>
            </tr>
            <tr>
              <td>170 – 179 cm</td>
              <td>&lt; 60 kg</td>
              <td>M</td>
            </tr>
            <tr>
              <td>170 – 179 cm</td>
              <td>60 – 75 kg</td>
              <td>L</td>
            </tr>
            <tr>
              <td>170 – 179 cm</td>
              <td>&gt; 75 kg</td>
              <td>XL</td>
            </tr>
            <tr>
              <td>&ge; 180 cm</td>
              <td>&lt; 70 kg</td>
              <td>L</td>
            </tr>
            <tr>
              <td>&ge; 180 cm</td>
              <td>70 – 85 kg</td>
              <td>XL</td>
            </tr>
            <tr>
              <td>&ge; 180 cm</td>
              <td>&gt; 85 kg</td>
              <td>XXL</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <Header hideNav={true} />
      <div className="product-container">
        <div className="product-detail-container">
          <div className="product-images-grid">
            <CustomTooltip title={product.title}>
              <Button
                startIcon={<KeyboardArrowLeftIcon />}
                variant="text"
                onClick={() => window.history.back()}
                style={{ marginRight: "8px", color: "#ccc" }}
              >
                TRỞ LẠI
              </Button>
              <div className="product-grid">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Ảnh ${index + 1}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                    onClick={() => {
                      setSelectedImage(img);
                      setOpenImageDialog(true);
                    }}
                  />
                ))}
              </div>

              <div className="product-description">
                <p>{product.description}</p>
              </div>
              <SizeTable />
              {/* Danh sách bình luận của sản phẩm */}
              <Comment productId={product._id} />
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
                      backgroundColor:
                        size === s
                          ? "#000 !important"
                          : "transparent !important",
                      color: size === s ? "#fff !important" : "#000 !important",
                      padding: "8px 16px", // Điều chỉnh padding nếu cần
                      border: "1px solid #000 !important", // Viền trong
                      outline:
                        size === s ? "2px solid #333 !important" : "none", // Viền ngoài có khoảng cách
                      outlineOffset: "3px", // Tạo khoảng cách giữa outline và border
                      "&:hover": {
                        backgroundColor:
                          size === s
                            ? "#333 !important"
                            : "transparent !important",
                        outline: "1px solid #333 !important",
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
                    borderRadius: 2,
                    padding: 1,
                    backgroundColor: "#000 !important",
                    color: "#fff !important",
                    "&:hover": {
                      backgroundColor: "#333 !important",
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
                <CustomTooltip key={item} title={item.title}>
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
                      <Typography
                        variant="body1"
                        color="black"
                        fontWeight="bold"
                      >
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
                </CustomTooltip>
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

      {/* Dialog hiện ảnh khi click */}
      <Dialog
        open={openImageDialog}
        onClose={() => setOpenImageDialog(false)}
        maxWidth=""
      >
        <img
          src={selectedImage}
          alt="Ảnh chi tiết"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </Dialog>

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

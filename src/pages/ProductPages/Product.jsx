import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProductsApi } from "../../features/product/productApi";
import {
  addFavoriteUserApi,
  checkStatusFavoriteUserApi,
  deleteFavoriteUserApi,
} from "../../features/favorite/favoriteApi";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Grid,
  Box,
  IconButton,
  InputAdornment,
  Pagination,
} from "@mui/material";
import {
  FavoriteBorder,
  Favorite,
  Search,
  StarBorder,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import Footer from "../../components/Footer/Footer";
import ProductFilter from "../../components/Product/ProductFilter";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import Header from "../../components/Header/Header";
import "../../styles/ProductPage.css";

// 🎯 Component Card Product
const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra sản phẩm có trong danh sách yêu thích không
  useEffect(() => {
    if (!item?._id) return;
    const controller = new AbortController();
    checkStatusFavoriteUserApi(item._id, { signal: controller.signal })
      .then((response) => setIsFavorite(response?.isFavorite || false))
      .catch((error) => {
        if (error.name !== "AbortError")
          console.error("Lỗi kiểm tra yêu thích:", error.message);
      });

    return () => controller.abort();
  }, [item?._id]);

  const handleFavoriteClick = async (event) => {
    event.stopPropagation();
    if (isLoading) return;
    setIsLoading(true);
    setIsFavorite((prev) => !prev);

    try {
      if (!isFavorite) {
        await addFavoriteUserApi(item._id);
      } else {
        await deleteFavoriteUserApi(item._id);
      }
    } catch (error) {
      console.error("Lỗi xử lý yêu thích:", error.message);
      setIsFavorite((prev) => !prev);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomTooltip title={item.title}>
      <Card
        className="product-card"
        onClick={() => navigate(`/levents/product-detail/${item._id}`)}
        sx={{
          width: 335,
          boxShadow: "none",
          background: "#fff",
          position: "relative",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <Favorite sx={{ color: "black" }} />
          ) : (
            <FavoriteBorder sx={{ color: "#333" }} />
          )}
        </IconButton>
        <CardMedia
          component="img"
          height="400"
          image={item.images?.[1] || "/placeholder-image.jpg"}
          alt={item.title || "Sản phẩm không có tiêu đề"}
          sx={{ objectFit: "cover" }}
        />
        <CardContent className="product-card-title">
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {item.title || "Sản phẩm chưa có tên"}
          </Typography>
          <Typography variant="body1" color="black" fontWeight="bold">
            {item.price
              ? `${item.price.toLocaleString()} VND`
              : "Giá chưa cập nhật"}
          </Typography>
          <Typography>Đã bán: {item.sold}</Typography>
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
  );
};

// 🎯 Component chính
const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minRating, setMinRating] = useState(0);
  const [sortOrder, setSortOrder] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    getAllProductsApi()
      .then((response) =>
        setProducts(Array.isArray(response) ? response : response.data || [])
      )
      .catch((error) => console.error("Lỗi khi lấy sản phẩm:", error.message));
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          (product.title || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) &&
          (product.price || 0) <= maxPrice &&
          (product.rating || 0) >= minRating &&
          (!category || product.category === category)
      )
      .sort((a, b) => {
        if (sortOrder === "asc") return (a.price || 0) - (b.price || 0);
        if (sortOrder === "desc") return (b.price || 0) - (a.price || 0);
        return 0;
      });
  }, [searchQuery, products, maxPrice, minRating, sortOrder, category]);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <>
      <Header hideNav={true} />
      <div className="product-container">
        <div className="product-header">
          <h2>TÌM KIẾM</h2>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search sx={{ color: "#333", cursor: "pointer" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="product-items">
          <div className="product-items-sidebar">
            <ProductFilter
              category={category}
              setCategory={setCategory}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minRating={minRating}
              setMinRating={setMinRating}
            />
          </div>

          <div style={{ flex: 2 }}>
            <h4>KẾT QUẢ: {filteredProducts.length} Sản phẩm</h4>
            <Grid container rowSpacing={3} columnSpacing={2}>
              {currentItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <ProductCard item={item} />
                </Grid>
              ))}
            </Grid>

            {filteredProducts.length > itemsPerPage && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={Math.ceil(filteredProducts.length / itemsPerPage)}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                  size="large"
                  shape="rounded"
                />
              </Box>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;

// 🎯 Định nghĩa kiểu dữ liệu cho item
ProductCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired, // ID của sản phẩm (bắt buộc)
    title: PropTypes.string.isRequired, // Tiêu đề sản phẩm (bắt buộc)
    price: PropTypes.number.isRequired, // Giá sản phẩm (bắt buộc)
    sold: PropTypes.number.isRequired,
    rating: PropTypes.number, // Đánh giá (không bắt buộc)
    images: PropTypes.arrayOf(PropTypes.string), // Mảng ảnh sản phẩm
  }).isRequired,
};

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProductsApi } from "../../features/product/productApi";
import StarIcon from "@mui/icons-material/StarBorder";
import Footer from "../../components/Footer/Footer";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchIcon from "@mui/icons-material/Search";
import PropTypes from "prop-types";
import "../../styles/ProductPage.css";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import Header from "../../components/Header/Header";
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
  Pagination, // 🎯 Thêm Pagination từ MUI
} from "@mui/material";
import ProductFilter from "../../components/Product/ProductFilter";

// 🎯 Component Card Product
const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/levents/product-detail/${item._id}`);
  };

  return (
    <CustomTooltip title={item.title}>
      <Card
        className="product-card"
        onClick={handleCardClick}
        sx={{
          width: 335,
          boxShadow: "none",
          background: "#fff",
        }}
      >
        <IconButton sx={{ position: "absolute", top: 8, right: 8 }}>
          <FavoriteBorderIcon sx={{ color: "#333" }} />
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
          <Box display="flex" alignItems="center">
            <StarIcon color="inherit" />
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

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minRating, setMinRating] = useState(0);
  const [sortOrder, setSortOrder] = useState("");
  const [category, setCategory] = useState("");

  // 🎯 State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 🎯 Fetch danh sách sản phẩm
  const fetchProducts = useCallback(async () => {
    try {
      const response = await getAllProductsApi();
      setProducts(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    let filtered = products.filter(
      (product) =>
        (product.title || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        (product.price || 0) <= maxPrice &&
        (product.rating || 0) >= minRating &&
        (!category || product.category === category)
    );

    if (sortOrder === "asc") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset về trang đầu khi lọc lại dữ liệu
  }, [searchQuery, products, maxPrice, minRating, sortOrder, category]);

  // 🎯 Lấy danh sách sản phẩm của trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <>
      {/* Header */}
      <Header hideNav={true} />
      <div className="product-container">
        <div className="product-header">
          <h2>TÌM KIẾM</h2>
          <div className="product-header-search">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: "#333", cursor: "pointer" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>

        {/* Bố cục chính */}
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

          {/* 🎯 Khu vực hiển thị sản phẩm có phân trang */}
          <div style={{ flex: 2 }}>
            <h4>KẾT QUẢ: {filteredProducts.length} Sản phẩm</h4>
            {loading ? (
              <Typography>Đang tải sản phẩm...</Typography>
            ) : (
              <>
                <Grid container rowSpacing={3} columnSpacing={2}>
                  {currentItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                      <ProductCard item={item} />
                    </Grid>
                  ))}
                </Grid>

                {/* 🎯 Phân trang */}
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
              </>
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
    rating: PropTypes.number, // Đánh giá (không bắt buộc)
    images: PropTypes.arrayOf(PropTypes.string), // Mảng ảnh sản phẩm
  }).isRequired,
};

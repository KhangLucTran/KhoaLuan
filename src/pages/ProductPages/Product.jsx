import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import { addKeyWordsApi } from "../../features/search/searchHistoryApi";

import { getAuthTokens } from "../../utils/token";
import {
  fetchAllProducts,
  fetchRecommendations,
} from "../../features/product/productSlice";
import axios from "axios";
import {
  addFavorite,
  checkFavoriteStatus,
  removeFavorite,
} from "../../features/favorite/favoriteSlice";

// 🎯 Component Card Product
const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [commentCount, setCommentCount] = useState(0);

  const isFavorite = useSelector(
    (state) => state.favorite.favoriteStatus[item._id]
  );
  useEffect(() => {
    if (item?._id) {
      dispatch(checkFavoriteStatus(item._id));
    }
  }, [dispatch, item._id]);

  // Lấy số lượng đánh giá sản phẩm
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/comment/${item._id}`
        );
        const commentsData = response.data.data;
        setCommentCount(commentsData.length || 0);
      } catch (error) {
        console.error("Lỗi khi lấy số lượng đánh giá:", error.message);
      }
    };
    fetchRating();
  }, [item._id]);

  const handleFavoriteClick = (event) => {
    event.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(item._id));
    } else {
      dispatch(addFavorite(item._id));
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
          cursor: "pointer",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={handleFavoriteClick}
          size="large"
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
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {commentCount > 0
                ? `(${commentCount}) đánh giá`
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
  const dispatch = useDispatch();
  const accessToken = getAuthTokens().accessToken;
  // Lấy dữ liệu từ redux store
  const products = useSelector((state) => state.product.products);

  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minRating, setMinRating] = useState(0);
  const [sortOrder, setSortOrder] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Tự phân nhóm khi có token
  const groupedProducts = useMemo(() => {
    if (!accessToken) return null;
    return {
      popular: products.filter((p) => p.priority === 3),
      searched: products.filter((p) => p.priority === 2),
      general: products.filter((p) => p.priority <= 1),
    };
  }, [products, accessToken]);

  // Fetch data khi component mount hoặc token thay đổi
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchRecommendations());
    } else {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, accessToken]);

  // Filter và sort sản phẩm
  const filteredProducts = useMemo(() => {
    const list = accessToken
      ? [
          ...groupedProducts.popular,
          ...groupedProducts.searched,
          ...groupedProducts.general,
        ]
      : products;

    return list
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
  }, [
    searchQuery,
    groupedProducts,
    products,
    maxPrice,
    minRating,
    sortOrder,
    category,
    accessToken,
  ]);

  // Lấy trang hiện tại
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Xử lý tìm kiếm lưu từ khóa
  const handleSearch = async () => {
    if (accessToken && searchQuery.trim() !== "") {
      try {
        await addKeyWordsApi({ keyword: searchQuery });
        console.log("Keyword đã được thêm thành công");
      } catch (error) {
        console.error("Error adding keyword:", error.message);
      }
    }
  };

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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" onClick={handleSearch}>
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
            <h4>KẾT QUẢ: {filteredProducts.length} Sản phẩm</h4>{" "}
            <Grid container rowSpacing={3} columnSpacing={2}>
              {currentItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <ProductCard item={item} />
                </Grid>
              ))}
            </Grid>
            {accessToken && groupedProducts && (
              <>
                {groupedProducts.popular.length > 0 && (
                  <>
                    <h2>Sản phẩm được nhiều người yêu thích</h2>
                    <Grid container rowSpacing={3} columnSpacing={2}>
                      {groupedProducts.popular.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item._id}>
                          <ProductCard item={item} />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}

                {groupedProducts.searched.length > 0 && (
                  <>
                    <h2>Sản phẩm được bạn tìm kiếm nhiều</h2>
                    <Grid container rowSpacing={3} columnSpacing={2}>
                      {groupedProducts.searched.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item._id}>
                          <ProductCard item={item} />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </>
            )}
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
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    sold: PropTypes.number.isRequired,
    rating: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string),
    priority: PropTypes.number,
    category: PropTypes.string,
  }).isRequired,
};

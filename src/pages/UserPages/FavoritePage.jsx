import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../../components/Toast/Toast";
import {
  getFavoriteUserApi,
  deleteFavoriteUserApi,
} from "../../features/favorite/favoriteApi";
import Footer from "../../components/Footer/Footer";
import "../../styles/FavoritePage.css";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getFavoriteUserApi();
        setFavorites(data.data || []);
      } catch (error) {
        showErrorToast(error.message || "Không thể tải danh sách yêu thích.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const removeFromFavorites = useCallback(async (productId) => {
    try {
      await deleteFavoriteUserApi(productId);
      setFavorites((prev) =>
        prev.filter((fav) => fav.productId._id !== productId)
      );
      showSuccessToast("Đã xóa khỏi danh sách yêu thích.");
    } catch (error) {
      showErrorToast(error.message || "Lỗi khi xóa sản phẩm.");
    }
  }, []);

  return (
    <div className="favorite-page">
      <nav className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">
          Levents
        </Link>
        / <span className="breadcrumb-current">YÊU THÍCH</span>
      </nav>
      <h2>YÊU THÍCH</h2>

      {loading ? (
        <p>Đang tải sản phẩm yêu thích...</p>
      ) : favorites.length === 0 ? (
        <p>Không có sản phẩm yêu thích nào.</p>
      ) : (
        <div className="favorite-products">
          {favorites.map(({ _id, productId }) => (
            <div key={_id} className="favorite-product">
              <div className="favorite-product-image">
                <img
                  src={productId.images[0]}
                  alt={productId.title}
                  className="product-image"
                />
              </div>
              <div className="favorite-product-info">
                <h3>{productId.title}</h3>
                <p>{productId.description}</p>
                <p className="product-price-favorite">
                  {productId.price.toLocaleString()} VND
                </p>
                <button
                  className="remove-from-favorite-btn"
                  onClick={() => removeFromFavorites(productId._id)}
                >
                  Xóa khỏi yêu thích
                </button>
                <button
                  className="view-product-detail-btn"
                  onClick={() =>
                    navigate(`/levents/product-detail/${productId._id}`)
                  }
                >
                  Xem thông tin
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default FavoritePage;

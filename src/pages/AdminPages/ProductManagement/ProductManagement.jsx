import { useEffect, useState } from "react";
import {
  getAllProductsApi,
  getProductByIdApi,
  deleteProductByIdApi,
} from "../../../features/product/productApi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import {
  Edit,
  Delete,
  AddCircleOutline,
  EmojiEvents,
} from "@mui/icons-material";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../components/Toast/Toast";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "../../../components/CustomTooltip/CustomTooltip";
import "./ProductManagement.css";
import ProductDetailManagement from "./ProductDetailManagement";

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [top3Ids, setTop3Ids] = useState([]); // Thêm state chứa ID của top 3 sản phẩm

  // Fetch and set products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getAllProductsApi();
        const sortedProducts = productList.sort(
          (a, b) => (b.sold || 0) - (a.sold || 0)
        );
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);
        setTop3Ids(sortedProducts.slice(0, 3).map((p) => p._id)); // Lưu top 3 ID
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error.message);
        setProducts([]);
        setFilteredProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Handle search
  useEffect(() => {
    let result = [...products];

    if (categoryFilter) {
      result = result.filter((product) => product.category === categoryFilter);
    }

    if (priceFilter) {
      result = result.filter((product) => {
        const price = product.price || 0;
        if (priceFilter === "low") return price < 500000;
        if (priceFilter === "mid") return price >= 500000 && price <= 1000000;
        if (priceFilter === "high") return price > 1000000;
        return true;
      });
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [categoryFilter, priceFilter, products]);

  const handleAddProductClick = () => {
    setEditingProduct(null);
    setIsEditing(true);
  };

  const handleEdit = async (productId) => {
    try {
      const product = await getProductByIdApi(productId);
      setEditingProduct(product);
      setIsEditing(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error.message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProduct(null);
  };

  const confirmDeleteProduct = (productId) => {
    setSelectedProductId(productId);
    setOpenDialogDelete(true);
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;
    setLoading(true);
    try {
      const response = await deleteProductByIdApi(selectedProductId);
      if (response) {
        showSuccessToast("Xóa sản phẩm thành công!");
        const updatedProducts = products.filter(
          (p) => p._id !== selectedProductId
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setTop3Ids(
          updatedProducts
            .sort((a, b) => (b.sold || 0) - (a.sold || 0))
            .slice(0, 3)
            .map((p) => p._id)
        );
        setOpenDialogDelete(false);
        setSelectedProductId(null);
      } else {
        showErrorToast("Xóa sản phẩm không thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error.message);
      showErrorToast("Đã xảy ra lỗi khi xóa sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const mappingCategory = (category) => {
    const categoryMap = {
      Shirt: "Áo sơ mi",
      Hat: "Nón",
      Pants: "Quần dài",
      Jacket: "Áo khoác",
      "T-Shirt": "Áo thun",
      Accessories: "Phụ kiện",
      Short: "Quần ngắn",
    };
    return categoryMap[category] || "Chưa phân loại";
  };

  return (
    <div className="admin-product-page-container">
      <div className="admin-product-page-content">
        {isEditing ? (
          <ProductDetailManagement
            onCancel={handleCancelEdit}
            selectedProduct={editingProduct}
          />
        ) : (
          <>
            <div className="admin-product-header">
              <h2>SẢN PHẨM</h2>
              <div className="admin-product-header-button">
                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="product-filter-select"
                  >
                    <option value="">Tất cả loại</option>
                    <option value="Shirt">Áo sơ mi</option>
                    <option value="Hat">Nón</option>
                    <option value="Pants">Quần dài</option>
                    <option value="Jacket">Áo khoác</option>
                    <option value="T-Shirt">Áo thun</option>
                    <option value="Accessories">Phụ kiện</option>
                    <option value="Short">Quần ngắn</option>
                  </select>

                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="product-filter-select"
                  >
                    <option value="">Tất cả giá</option>
                    <option value="low">&lt; 500.000</option>
                    <option value="mid">500.000 - 1.000.000</option>
                    <option value="high">&gt; 1.000.000</option>
                  </select>
                </div>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutline />}
                  onClick={handleAddProductClick}
                  sx={{ mb: 2, borderRadius: "16px" }}
                >
                  Thêm sản phẩm
                </Button>
              </div>
            </div>

            <TableContainer
              component={Paper}
              className="admin-product-table-container"
            >
              <Table className="admin-product-table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Hình ảnh</TableCell>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell>Loại</TableCell>
                    <TableCell>Số lượng kho</TableCell>
                    <TableCell>Số lượng bán</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedProducts.map((item, index) => {
                    const isTop = top3Ids.includes(item._id);
                    const topClass =
                      top3Ids.indexOf(item._id) === 0
                        ? "top-seller top-rank-1"
                        : top3Ids.indexOf(item._id) === 1
                          ? "top-seller top-rank-2"
                          : top3Ids.indexOf(item._id) === 2
                            ? "top-seller top-rank-3"
                            : "";

                    return (
                      <TableRow
                        key={item._id}
                        className={isTop ? topClass : ""}
                      >
                        <TableCell className="rank-number">
                          {isTop && top3Ids.indexOf(item._id) === 0 ? (
                            <EmojiEvents
                              style={{ color: "gold", fontSize: "1.5rem" }}
                            />
                          ) : (
                            (currentPage - 1) * itemsPerPage + index + 1
                          )}
                        </TableCell>
                        <TableCell>
                          {item.images?.length > 0 && (
                            <img
                              src={item.images[0]}
                              alt={item.title || "Sản phẩm"}
                              className="admin-product-image"
                            />
                          )}
                        </TableCell>
                        <TableCell>{item.title || "Chưa có tên"}</TableCell>
                        <TableCell>
                          {item.price !== undefined
                            ? `${item.price.toLocaleString()} VND`
                            : "Chưa cập nhật"}
                        </TableCell>
                        <TableCell>
                          {mappingCategory(item.category) || "Chưa phân loại"}
                        </TableCell>
                        <TableCell>{item.stock ?? "Chưa cập nhật"}</TableCell>
                        <TableCell>{item.sold ?? "Chưa cập nhật"}</TableCell>
                        <TableCell className="admin-product-page-actions">
                          <CustomTooltip title="Xem chi tiết">
                            <IconButton
                              onClick={() =>
                                navigate(`/levents/product-detail/${item._id}`)
                              }
                            >
                              <CategoryIcon className="category-btn" />
                            </IconButton>
                          </CustomTooltip>
                          <CustomTooltip title="Chỉnh sửa">
                            <IconButton onClick={() => handleEdit(item._id)}>
                              <Edit className="edit-btn" />
                            </IconButton>
                          </CustomTooltip>
                          <CustomTooltip title="Xóa">
                            <IconButton
                              onClick={() => confirmDeleteProduct(item._id)}
                            >
                              <Delete className="delete-btn" />
                            </IconButton>
                          </CustomTooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredProducts.length > itemsPerPage && (
              <div className="admin-product-page-pagination">
                <Pagination
                  count={Math.ceil(filteredProducts.length / itemsPerPage)}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                  size="large"
                  shape="rounded"
                />
              </div>
            )}
          </>
        )}
      </div>

      <Dialog
        open={openDialogDelete}
        onClose={() => !loading && setOpenDialogDelete(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không
            thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialogDelete(false)}
            variant="outlined"
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminProductManagement;

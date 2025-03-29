import { useEffect, useState } from "react";
import {
  getAllProductsApi,
  getProductByIdApi,
  deleteProductByIdApi,
} from "../../features/product/productApi";
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
import { Edit, Delete, Add } from "@mui/icons-material";
import "../../styles/AdminProductStyles.css";
import AddEditProductPage from "./AddEditProductPage";
import { showErrorToast, showSuccessToast } from "../../components/Toast/Toast";

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Quản lý trạng thái form
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Trạng thái Dialog xóa
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getAllProductsApi();
        setProducts(productList);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error.message);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Mở form Thêm sản phẩm
  const handleAddProductClick = () => {
    setEditingProduct(null); // Không có sản phẩm được chọn
    setIsEditing(true);
  };

  // Mở form Chỉnh sửa sản phẩm
  const handleEdit = async (productId) => {
    try {
      const product = await getProductByIdApi(productId);
      setEditingProduct(product);
      setIsEditing(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error.message);
    }
  };

  // Đóng form thêm/chỉnh sửa
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProduct(null);
  };

  // Xác nhận mở Dialog xóa sản phẩm
  const confirmDeleteProduct = (productId) => {
    setSelectedProductId(productId);
    setOpenDialogDelete(true);
  };

  // Xóa sản phẩm
  const handleDelete = async () => {
    if (!selectedProductId) return;
    setLoading(true);
    try {
      const response = await deleteProductByIdApi(selectedProductId);
      if (response) {
        showSuccessToast("Xóa sản phẩm thành công!");
        setProducts(products.filter((p) => p._id !== selectedProductId));
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

  // Dữ liệu sản phẩm hiển thị theo trang
  const currentItems = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="admin-product-page-container">
      <div className="admin-product-page-content">
        {isEditing ? (
          <AddEditProductPage
            onCancel={handleCancelEdit}
            selectedProduct={editingProduct}
          />
        ) : (
          <>
            <div className="admin-product-header">
              <h2>Danh sách sản phẩm</h2>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddProductClick}
                sx={{ mb: 2 }}
              >
                Thêm sản phẩm
              </Button>
            </div>

            <TableContainer
              component={Paper}
              className="admin-product-table-container"
            >
              <Table className="admin-product-table">
                <TableHead>
                  <TableRow>
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
                  {currentItems.map((item) => (
                    <TableRow key={item._id}>
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
                      <TableCell>{item.category || "Chưa phân loại"}</TableCell>
                      <TableCell>{item.stock ?? "Chưa cập nhật"}</TableCell>
                      <TableCell>{item.sold ?? "Chưa cập nhật"}</TableCell>
                      <TableCell className="admin-product-page-actions">
                        <IconButton onClick={() => handleEdit(item._id)}>
                          <Edit className="edit-btn" />
                        </IconButton>
                        <IconButton
                          onClick={() => confirmDeleteProduct(item._id)}
                        >
                          <Delete className="delete-btn" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Phân trang */}
            {products.length > itemsPerPage && (
              <div className="admin-product-page-pagination">
                <Pagination
                  count={Math.ceil(products.length / itemsPerPage)}
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

      {/* Dialog Xóa sản phẩm */}
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

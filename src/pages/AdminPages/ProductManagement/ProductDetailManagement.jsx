import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Typography,
  TextField,
  IconButton,
  LinearProgress,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import { Delete, CloudUpload } from "@mui/icons-material";
import {
  addProductApi,
  updateProductByIdApi,
} from "../../../features/product/productApi";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../components/Toast/Toast";

import "./ProductDetailManagement.css";

const ProductDetailManagement = ({ onCancel, selectedProduct }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [deletedImages, setDeletedImages] = useState([]);
  const [description, setDescription] = useState("");

  // Fetch dữ liệu sản phẩm khi selectedProduct thay đổi
  useEffect(() => {
    if (selectedProduct) {
      setProductName(selectedProduct.product.title || "");
      setCategory(selectedProduct.product.category || "");
      setGender(selectedProduct.product.gender || "");
      setStock(selectedProduct.product.stock || "");
      setPrice(selectedProduct.product.price || "");
      setDescription(selectedProduct.product.description || "");
      setUploadedFiles(
        selectedProduct.product.images?.map((imgUrl, index) => ({
          url: imgUrl,
          name: `image-${index + 1}.jpg`,
          size: "Không xác định",
        })) || []
      );
    }
  }, [selectedProduct]);

  // Tạo hàm tái sử dụng cho việc thay đổi file
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        progress: 100,
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
      })),
    ]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        progress: 100,
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
      })),
    ]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Xử lý xóa file
  const handleRemoveFile = (index) => {
    setUploadedFiles((prev) => {
      const updatedFiles = [...prev];
      const removedFile = updatedFiles[index];

      // Nếu là ảnh từ Cloudinary, thêm vào danh sách xóa
      if (!removedFile.url.startsWith("blob:")) {
        setDeletedImages((prevDeleted) => [...prevDeleted, removedFile.url]);
      }

      // Giải phóng URL tạm thời nếu là ảnh mới
      if (removedFile.url.startsWith("blob:")) {
        URL.revokeObjectURL(removedFile.url);
      }

      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  // Submit form
  const handleSubmit = async () => {
    const productData = {
      title: productName,
      category,
      gender,
      stock,
      price,
      description,
      images: uploadedFiles
        .map((file) => file.url)
        .filter((url) => !url.startsWith("blob:")), // Chỉ lấy ảnh từ Cloudinary
      deletedImages,
    };

    const newImages = uploadedFiles.map((file) => file.file).filter(Boolean);
    // Kiểm tra sự thay đổi giữa productData và selectedProduct
    const hasChanges =
      selectedProduct &&
      (productData.title !== selectedProduct.product.title ||
        productData.category !== selectedProduct.product.category ||
        productData.gender !== selectedProduct.product.gender ||
        productData.stock !== selectedProduct.product.stock ||
        productData.price !== selectedProduct.product.price ||
        productData.description !== selectedProduct.product.description ||
        JSON.stringify(productData.images) !==
          JSON.stringify(selectedProduct.product.images) || // ✅ dòng đã fix
        newImages.length > 0 || // Nếu có ảnh mới
        deletedImages.length > 0); // Nếu có ảnh bị xóa
    try {
      let response;
      if (selectedProduct && hasChanges) {
        // Gọi API update nếu có sự thay đổi và sản phẩm đã tồn tại
        response = await updateProductByIdApi(
          selectedProduct.product._id,
          productData,
          newImages
        );
        console.log("Response:", response);
      } else if (!selectedProduct) {
        // Gọi API thêm mới nếu chưa có sản phẩm
        response = await addProductApi(productData, newImages);
      }

      if (response) {
        showSuccessToast(
          selectedProduct
            ? "Cập nhật sản phẩm thành công!"
            : "Sản phẩm được thêm thành công!"
        );
        setTimeout(() => {
          onCancel();
        }, 3000);
      } else {
        showErrorToast("Có lỗi xảy ra khi xử lý yêu cầu!");
      }
    } catch (error) {
      showErrorToast("Có lỗi xảy ra: " + error.message);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            className="dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
              border: "2px dashed #1877f2",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              color: "#666",
              cursor: "pointer",
              mb: 2,
              "&:hover": {
                backgroundColor: "#f1f9ff",
              },
            }}
          >
            <CloudUpload fontSize="large" sx={{ mb: 1 }} />
            <Typography variant="body1">
              Drop your files here, or <b>Browse</b>
            </Typography>
            <input
              type="file"
              multiple
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
              onChange={handleFileChange}
            />
          </Box>

          {uploadedFiles.map((fileObj, index) => (
            <Box
              key={index}
              sx={{
                border: "1px solid #eee",
                borderRadius: 2,
                p: 1.5,
                mb: 1.5,
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={fileObj.url}
                alt={fileObj.name}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  marginRight: "10px",
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {fileObj.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  {fileObj.size}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={fileObj.progress || 0}
                  sx={{ height: 6, borderRadius: 5, mt: 1 }}
                />
              </Box>
              <IconButton
                size="small"
                onClick={() => handleRemoveFile(index)}
                sx={{
                  color: "#666",
                  "&:hover": {
                    color: "red",
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Tên sản phẩm"
              variant="outlined"
              size="small"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <TextField
              select
              label="Danh mục"
              variant="outlined"
              size="small"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="Shirt">Áo Sơ Mi</MenuItem>
              <MenuItem value="T-Shirt">Áo Thun</MenuItem>
              <MenuItem value="Pants">Quần dài</MenuItem>
              <MenuItem value="Short">Quần ngắn</MenuItem>
              <MenuItem value="Hat">Mũ</MenuItem>
              <MenuItem value="Jacket">Áo khoác</MenuItem>
              <MenuItem value="Accessories">Phụ kiện</MenuItem>
            </TextField>
            <TextField
              select
              label="Giới tính"
              variant="outlined"
              size="small"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value="Other">Khác</MenuItem>
              <MenuItem value="Female">Nữ</MenuItem>
              <MenuItem value="Male">Nam</MenuItem>
            </TextField>
            <TextField
              label="Số lượng trong kho"
              variant="outlined"
              size="small"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <TextField
              label="Giá"
              variant="outlined"
              size="small"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <TextField
              label="Mô tả"
              variant="outlined"
              size="small"
              multiline
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button variant="contained" onClick={handleSubmit}>
                {selectedProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
              </Button>
              <Button variant="outlined" onClick={onCancel} sx={{ ml: 1 }}>
                Hủy
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

ProductDetailManagement.propTypes = {
  onCancel: PropTypes.func.isRequired,
  selectedProduct: PropTypes.object,
};

export default ProductDetailManagement;

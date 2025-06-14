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
} from "@mui/material";
import { Delete, CloudUpload } from "@mui/icons-material";
import {
  addProductApi,
  getProductByIdApi,
} from "../../features/product/productApi";
import "../../styles/AddProductPage.css";
import { showErrorToast, showSuccessToast } from "../../components/Toast/Toast";

const AddEditProductPage = ({ onCancel, selectedProduct }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  // Nếu có sản phẩm được chọn, fill dữ liệu vào form
  useEffect(() => {
    if (selectedProduct) {
      const fetchProduct = async () => {
        try {
          const response = await getProductByIdApi(selectedProduct._id);
          setProductName(response.title || "");
          setCategory(response.category || "");
          setGender(response.gender || "");
          setStock(response.stock || "");
          setPrice(response.price || "");
          setDescription(response.description || "");
          setUploadedFiles(
            response.imageDetails?.map((img) => ({
              url: img.url,
              name: img.fileName,
              size: img.size, // Không có kích thước do là ảnh từ URL
            })) || []
          );
        } catch (error) {
          console.error("Lỗi khi tải sản phẩm:", error);
        }
      };

      fetchProduct();
    }
  }, [selectedProduct]);

  // Xử lý chọn file ảnh
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      file,
      url: URL.createObjectURL(file), // ✅ Tạo URL tạm thời để hiển thị ảnh
      progress: 100, // Mặc định 100%
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB", // Đổi byte sang KB
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  // Xử lý kéo - thả file
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      progress: 100,
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Xóa file đã chọn
  const handleRemoveFile = (index) => {
    setUploadedFiles((prev) => {
      const updatedFiles = [...prev];
      const removedFile = updatedFiles[index];

      // Giải phóng URL tạm thời
      if (removedFile.url.startsWith("blob:")) {
        URL.revokeObjectURL(removedFile.url);
      }

      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    const productData = {
      title: productName,
      category,
      gender,
      stock,
      price,
      description,
    };
    const images = uploadedFiles.map((file) => file.file).filter(Boolean);
    if (selectedProduct) {
      alert("Cập nhật sản phẩm: " + JSON.stringify(productData, null, 2));
    } else {
      const response = await addProductApi(productData, images);
      if (response) {
        setProductName("");
        setCategory("");
        setGender("");
        setStock("");
        setPrice("");
        setDescription("");
        setUploadedFiles([]);
        showSuccessToast("Sản phẩm được thêm thành công!");
      } else {
        showErrorToast("Thêm sản phẩm không thành công!");
      }
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        {selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
      </Typography>
      <Grid container spacing={3}>
        {/* Cột trái: Dropzone & Danh sách file */}
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

          {/* Danh sách file đã upload */}
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
                  value={fileObj.progress}
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

        {/* Cột phải: Form thông tin sản phẩm */}
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
              label="Danh mục"
              variant="outlined"
              size="small"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <TextField
              label="Số lượng trong kho"
              variant="outlined"
              size="small"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <TextField
              label="Giới tính"
              variant="outlined"
              size="small"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
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

            {/* Nút Submit Form */}
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

// Định nghĩa propTypes
AddEditProductPage.propTypes = {
  onCancel: PropTypes.func.isRequired,
  selectedProduct: PropTypes.object,
};

export default AddEditProductPage;

import PropTypes from "prop-types";
import { useState } from "react";
import { Box, Button, Collapse, Slider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Mũi tên mở rộng

// 🎯 Component FilterButton (Danh mục, Sắp xếp, Lọc)
const FilterButton = ({
  label,
  options,
  selectedValue,
  onSelect,
  isCollapsed,
  setIsCollapsed,
}) => {
  return (
    <Box>
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          color: "#333",
        }}
      >
        {label}
        <ExpandMoreIcon
          sx={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </Button>
      <Collapse in={isCollapsed}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {options.map((option) => (
            <Button
              key={option.value}
              onClick={() => onSelect(option.value)}
              sx={{
                px: 2,
                py: 1,
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "14px",
                color: selectedValue === option.value ? "#fff" : "#333",
                backgroundColor:
                  selectedValue === option.value ? "#1877F2" : "",
                "&:hover": {
                  backgroundColor:
                    selectedValue === option.value ? "#125ab3" : "#ddd",
                },
              }}
            >
              {option.label}
            </Button>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

// 🎯 Component Filter Sidebar (tổng hợp các bộ lọc)
const ProductFilter = ({
  category,
  setCategory,
  sortOrder,
  setSortOrder,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
}) => {
  const [isCategoryCollapsed, setIsCategoryCollapsed] = useState(true);
  const [isSortCollapsed, setIsSortCollapsed] = useState(true);

  return (
    <Box sx={{ flex: 1, padding: 2 }}>
      {/* Sắp xếp theo danh mục */}
      <FilterButton
        label="Danh mục"
        options={[
          { label: "Tất cả", value: "" },
          { label: "Quần", value: "Pants" },
          { label: "Áo", value: "Shirt" },
          { label: "Nón", value: "Hat" },
        ]}
        selectedValue={category}
        onSelect={setCategory}
        isCollapsed={isCategoryCollapsed}
        setIsCollapsed={setIsCategoryCollapsed}
      />

      {/* Sắp xếp tăng dần, giảm dần */}
      <FilterButton
        label="Sắp xếp"
        options={[
          { label: "Tất cả", value: "" },
          { label: "Giá tăng dần", value: "asc" },
          { label: "Giá giảm dần", value: "desc" },
        ]}
        selectedValue={sortOrder}
        onSelect={setSortOrder}
        isCollapsed={isSortCollapsed}
        setIsCollapsed={setIsSortCollapsed}
      />

      {/* Lọc theo Giá */}
      <Box sx={{ mb: 3, ml: 1, mt: 2 }}>
        <p style={{ fontSize: "14px", fontWeight: "bold" }}>
          GIÁ TỐI ĐA:{" "}
          <span style={{ color: "#1877F2" }}>
            {maxPrice.toLocaleString()} VND
          </span>
        </p>
        <Slider
          value={maxPrice}
          min={0}
          max={1000000}
          step={10000}
          marks={[
            { value: 0, label: "0" },
            { value: 100000, label: "100K" },
            { value: 500000, label: "500K" },
            { value: 1000000, label: "1M" },
          ]}
          onChange={(e, newValue) => setMaxPrice(newValue)}
          sx={{
            color: "#1877F2",
            "& .MuiSlider-thumb": {
              backgroundColor: "#1877F2",
              border: "2px solid #fff",
            },
            "& .MuiSlider-rail": {
              backgroundColor: "#e0e0e0",
            },
            "& .MuiSlider-track": {
              backgroundColor: "#1877F2",
            },
            "&:hover .MuiSlider-thumb": {
              backgroundColor: "#125ab3", // Màu tối hơn khi hover
            },
          }}
        />
      </Box>

      {/* Lọc theo Đánh giá */}
      <Box sx={{ mb: 3, ml: 1, mt: 2 }}>
        <p style={{ fontSize: "14px", color: "#333", fontWeight: "bold" }}>
          ĐÁNH GIÁ
        </p>
        <Slider
          value={minRating}
          min={0}
          max={5}
          step={1}
          marks={[
            { value: 0, label: "0★" },
            { value: 1, label: "1★" },
            { value: 2, label: "2★" },
            { value: 3, label: "3★" },
            { value: 4, label: "4★" },
            { value: 5, label: "5★" },
          ]}
          onChange={(e, newValue) => setMinRating(newValue)}
          sx={{
            color: "#1877F2",
            "& .MuiSlider-thumb": {
              backgroundColor: "#1877F2",
              border: "2px solid #fff",
            },
            "& .MuiSlider-rail": {
              backgroundColor: "#e0e0e0",
            },
            "& .MuiSlider-track": {
              backgroundColor: "#1877F2",
            },
            "&:hover .MuiSlider-thumb": {
              backgroundColor: "#125ab3", // Màu tối hơn khi hover
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProductFilter;

ProductFilter.propTypes = {
  category: PropTypes.string.isRequired, // Danh mục, phải là chuỗi và bắt buộc
  setCategory: PropTypes.func.isRequired, // Hàm để cập nhật danh mục, bắt buộc
  sortOrder: PropTypes.string.isRequired, // Thứ tự sắp xếp, phải là chuỗi và bắt buộc
  setSortOrder: PropTypes.func.isRequired, // Hàm để cập nhật thứ tự sắp xếp, bắt buộc
  maxPrice: PropTypes.number.isRequired, // Giá tối đa, phải là số và bắt buộc
  setMaxPrice: PropTypes.func.isRequired, // Hàm để cập nhật giá tối đa, bắt buộc
  minRating: PropTypes.number.isRequired, // Đánh giá tối thiểu, phải là số và bắt buộc
  setMinRating: PropTypes.func.isRequired, // Hàm để cập nhật đánh giá tối thiểu, bắt buộc
};

// Định nghĩa PropTypes cho FilterButton
FilterButton.propTypes = {
  label: PropTypes.string.isRequired, // Label phải là một chuỗi và là bắt buộc
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired, // options phải là một mảng các đối tượng có label và value là chuỗi, bắt buộc
  selectedValue: PropTypes.string.isRequired, // selectedValue phải là một chuỗi, bắt buộc
  onSelect: PropTypes.func.isRequired, // onSelect phải là một hàm, bắt buộc
  isCollapsed: PropTypes.bool.isRequired, // isCollapsed phải là một boolean, bắt buộc
  setIsCollapsed: PropTypes.func.isRequired, // setIsCollapsed phải là một hàm, bắt buộc
};

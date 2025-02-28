import { useState } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import "../../styles/InlineEditField.css";
import { validateField } from "../../utils/validation";
import { useDispatch } from "react-redux";
import { fetchUpdateUserInfo } from "../../features/user/userSlice";

const InlineEditField = ({
  label,
  name,
  value = "", // Đảm bảo không bị undefined
  onChange,
  helperText,
  type,
  options,
}) => {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleBlur = () => {
    const errorMessage = validateField(name, currentValue);
    setError(errorMessage); // Lưu lỗi vào state
    if (!errorMessage) {
      setEditing(false);
      if (currentValue !== value) {
        onChange(currentValue);
        // Gửi dữ liệu cập nhật cho API: gửi object chứa tên trường và giá trị mới
        dispatch(fetchUpdateUserInfo({ [name]: currentValue }));
      }
    }
  };

  const handleSelectField = (newValue) => {
    console.log("Giá trị select hiện tại:", newValue); // Log giá trị mới
    setCurrentValue(newValue);
    onChange(newValue); // Cập nhật dữ liệu cho component cha
    dispatch(fetchUpdateUserInfo({ [name]: newValue }));
    setEditing(false);
  };

  return (
    <div className="inline-edit-field" style={{ width: "100%" }}>
      <Typography variant="subtitle2" className="info-label">
        {label}:
      </Typography>
      {editing ? (
        type === "select" ? (
          <Select
            value={currentValue}
            onChange={(e) => handleSelectField(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            variant="standard"
            error={!!error}
            sx={{
              width: "100%",
              "&:before, &:after": { display: "none" }, // Xóa gạch chân xanh
              "& .MuiSelect-select": { padding: "8px 12px" }, // Tinh chỉnh padding
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        ) : type === "date" ? (
          <DatePicker
            value={currentValue ? dayjs(currentValue) : null}
            onChange={(newValue) => {
              const formattedValue = newValue
                ? newValue.format("YYYY-MM-DD")
                : "";
              // Cập nhật state và kiểm tra lỗi khi ngày thay đổi
              setCurrentValue(formattedValue);
              const errorMessage = validateField(name, formattedValue);
              setError(errorMessage);
            }}
            // Không gọi onAccept nữa, ta dùng onKeyDown để bắt Enter
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                helperText: error || helperText,
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    // Chuyển đổi giá trị hiện tại (hiển thị theo DD/MM/YYYY) sang định dạng lưu trữ YYYY-MM-DD
                    const inputValue = e.target.value;
                    const formattedValue = dayjs(
                      inputValue,
                      "DD/MM/YYYY"
                    ).format("YYYY-MM-DD");
                    handleBlur(formattedValue);
                  }
                },
              },
            }}
          />
        ) : (
          <TextField
            variant="standard"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            error={!!error}
            helperText={error || helperText}
            sx={{
              width: "100%",
              "& .MuiInput-underline:before, & .MuiInput-underline:after": {
                display: "none", // Xóa gạch chân xanh khi focus
              },
            }}
          />
        )
      ) : (
        <Typography
          variant="body1"
          className="info-value"
          onClick={() => setEditing(true)}
          sx={{ cursor: "pointer", width: "100%", display: "block" }}
        >
          {type === "select"
            ? options.find((opt) => opt.value === value)?.label ||
              "Chưa cập nhật"
            : type === "date"
              ? (value && dayjs(value).format("DD/MM/YYYY")) || "Chưa cập nhật"
              : value || "Chưa cập nhật"}
        </Typography>
      )}
    </div>
  );
};

InlineEditField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  helperText: PropTypes.string,
  type: PropTypes.oneOf(["text", "select", "date"]),
  options: PropTypes.array,
};

InlineEditField.defaultProps = {
  type: "text",
  options: [],
};

export default InlineEditField;

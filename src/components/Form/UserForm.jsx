import PropTypes from "prop-types";
import { userFields } from "../../constants/UserData";
import InlineEditField from "../../components/Input/InlineEditField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const UserForm = ({ formData, handleFieldChange }) => {
  return (
    <>
      <h4>Thông tin cá nhân</h4>
      {userFields.map((field) => (
        <div key={field.name} style={{ marginBottom: "10px" }}>
          {field.type === "date" ? (
            <div style={{ marginTop: "30px" }}>
              <label
                style={{
                  color: "#1877F2",
                  marginLeft: "1.3em",
                  fontSize: "0.875rem",
                  lineHeight: "1.57",
                  fontWeight: "500",
                  letterSpacing: "0.00714em",
                }}
              >
                {field.label}
              </label>
              <DatePicker
                label={field.label}
                value={
                  formData[field.name] ? dayjs(formData[field.name]) : null
                }
                onChange={(newValue) =>
                  handleFieldChange(
                    field.name,
                    newValue ? newValue.format("YYYY-MM-DD") : ""
                  )
                }
                format="DD/MM/YYYY"
                slotProps={{ textField: { helperText: field.helperText } }}
                sx={{
                  ml: "65px",
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    fontSize: "14px",
                  },
                }}
              />
            </div>
          ) : (
            <InlineEditField
              label={field.label}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(val) => handleFieldChange(field.name, val)}
              type={field.type}
              options={field.options || []}
              helperText={field.helperText}
            />
          )}
        </div>
      ))}
    </>
  );
};

// ✅ Thêm PropTypes
UserForm.propTypes = {
  formData: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    numberphone: PropTypes.string,
    gender: PropTypes.string,
    dob: PropTypes.string,
    roleCode: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired, // Bắt buộc phải có
  handleFieldChange: PropTypes.func.isRequired, // Hàm thay đổi giá trị là bắt buộc
};

export default UserForm;

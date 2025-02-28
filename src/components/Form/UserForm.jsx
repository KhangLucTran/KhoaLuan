import PropTypes from "prop-types";
import { userFields } from "../../constants/UserData";
import InlineEditField from "../../components/Input/InlineEditField";

const UserForm = ({ formData, handleFieldChange }) => {
  return (
    <>
      <h4>Thông tin cá nhân</h4>
      {userFields.map((field) => (
        <div key={field.name} style={{ marginBottom: "10px" }}>
          <InlineEditField
            label={field.label}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={(val) => handleFieldChange(field.name, val)}
            type={field.type}
            options={field.options || []}
            helperText={field.helperText}
          />
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

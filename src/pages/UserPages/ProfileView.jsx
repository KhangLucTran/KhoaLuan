import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUserInfo } from "../../features/user/userSlice";
import { updateAvatar } from "../../features/user/userApi";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import "../../styles/ProfileView.css";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import UserForm from "../../components/Form/UserForm";
import { showErrorToast, showSuccessToast } from "../../components/Toast/Toast";

const ProfileView = () => {
  // Use  Dispatchh
  const dispatch = useDispatch();

  // Use Selector
  const user = useSelector((state) => state.user.user);

  // Form Data
  const [formData, setFormData] = useState(null);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.data.profileId?.username || "",
        email: user.data.email || "",
        numberphone: user.data.profileId?.numberphone || "",
        gender: user.data.profileId?.gender || "male",
        dob: user.data.profileId?.dob || "",
        roleCode: user.data.role_code?.value || "User",
        verify: user.data.verifyState || "false",
        provider: user.data.provider || "System",
        notes:
          "📌 Chào mừng bạn đến với hồ sơ cá nhân! Cập nhật thông tin để có trải nghiệm tốt hơn.",
      });
      setAvatar(
        user.data.profileId?.avatar || "https://via.placeholder.com/150"
      );
    }
  }, [user]);

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      console.error("❌ No file selected");
      return alert("Vui lòng chọn ảnh trước khi cập nhật!");
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await updateAvatar(formData);
      setAvatar(response.avatar);
      showSuccessToast("Cập nhật avatar thành công!");
      console.log("✅ Avatar URL:", response.avatar);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật avatar:", error);
      showErrorToast("Có lỗi xảy ra khi cập nhật ảnh đại diện!");
    }
  };

  // Xử lí khi có file thay đổi
  const handleFieldChange = (field, newValue) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [field]: newValue };
      return updatedData;
    });
  };

  // Nếu chưa có user hoặc formData thì hiện "Đang tải dữ liệu"
  if (!user || !formData) {
    return <p>Đang tải dữ liệu...</p>;
  }

  // Format ngày tháng năm
  const createdAtDate = new Date(user.data.createdAt);
  const formattedCreatedAt = `Tháng ${("0" + (createdAtDate.getMonth() + 1)).slice(-2)} năm ${createdAtDate.getFullYear()}`;

  return (
    <>
      {/* Tiêu đề */}
      <div className="profile-view-container-title">
        <h2>Tài khoản</h2>
        <p>Thông tin tư cách thành viên</p>
      </div>

      {/* Ngày bắt đầu của thành viên */}
      <div className="profile-view-day-begin">
        <p>Thành viên từ {formattedCreatedAt}</p>
      </div>

      <div className="profile-view-container">
        <div className="profile-view-container-main">
          <div className="profile-view-info">
            <div className="profile-view-info-avatar">
              <Avatar
                src={avatar}
                alt="Avatar"
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: "10px",
                  border: "3px solid #1877F2",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)", transition: "0.3s" },
                }}
              />
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-avatar"
                type="file"
                onChange={handleAvatarChange}
              />
              <label htmlFor="upload-avatar">
                <CustomTooltip title="Cập nhật ảnh đại diện">
                  <IconButton color="primary" component="span">
                    <PhotoCamera />
                  </IconButton>
                </CustomTooltip>
              </label>
            </div>
            <div className="profile-view-info-title">
              <div className="profile-view-info-title-name">
                {formData.username}
              </div>
              <div className="profile-view-info-title-email">
                {formData.email} <span>(Không thể thay đổi)</span>
              </div>
            </div>
            <div className="profile-view-info-avatar-title">
              {/* Hiển thị vai trò người dùng với thiết kế trực quan hơn */}
              <div
                className={`role-badge ${formData.roleCode === "User" ? "role-standard" : "role-admin"}`}
              >
                {formData.roleCode === "User"
                  ? "Thành viên tiêu chuẩn"
                  : "Quản trị viên"}
              </div>
              {/* Trạng thái tài khoản */}
              <div className="account-status">
                <span className="status-label">Trạng thái:</span>
                <span
                  className={`status-value ${formData.verify === "true" ? "verified" : "unverified"}`}
                >
                  {formData.verify === "true"
                    ? "✔ Đã xác minh"
                    : "⚠ Chưa xác minh"}
                </span>
              </div>

              {/* Nhà cung cấp dịch vụ tài khoản */}
              <div className="account-provider">
                <span className="provider-label">Nguồn tài khoản:</span>
                <span className="provider-value">
                  {formData.provider === "system"
                    ? "Hệ thống nội bộ"
                    : formData.provider}
                </span>
              </div>
            </div>
          </div>

          {/* Ghi chú và thông tin cá nhân */}
          <div className="profile-details-container">
            <div className="profile-note">
              <h4>Ghi chú</h4>
              <p>{formData.notes}</p>
            </div>
            <div className="profile-readonly-info">
              <CustomTooltip title="Chi tiết thông tin cá nhân">
                <UserForm
                  formData={formData}
                  handleFieldChange={handleFieldChange}
                />
              </CustomTooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileView;

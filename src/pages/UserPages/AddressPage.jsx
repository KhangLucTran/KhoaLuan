import { useState, useEffect } from "react";
import { Button, IconButton, Autocomplete, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import MyLocationIcon from "@mui/icons-material/MyLocation";

import "../../styles/AddressPage.css";
import addressApi from "../../features/address/addressApi";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
const AddressPage = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [detail, setDetail] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState();
  const [showMap, setShowMap] = useState(null);

  // Hiển thị danh sách địa chỉ đã lưu.
  useEffect(() => {
    const fetchAddresses = async () => {
      const data = await addressApi.getAllAddressByUserId();
      setAddresses(data || []);
    };
    fetchAddresses();
  }, []);

  // Load giá trị Tỉnh.
  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await addressApi.fetchProvinces();
      setProvinces(data || []);
    };
    fetchProvinces();
  }, []);

  // Load giá trị Quận/Huyện.
  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedProvince?.code) {
        const data = await addressApi.fetchDistricts(selectedProvince.code);
        setDistricts(data || []);
        setSelectedDistrict(null);
        setWards([]);
      }
    };
    loadDistricts();
  }, [selectedProvince]);

  // Load giá trị Phường/Xã.
  useEffect(() => {
    const loadWards = async () => {
      if (selectedDistrict?.code) {
        const data = await addressApi.fetchWards(selectedDistrict.code);
        setWards(data || []);
        setSelectedWard(null);
      }
    };
    loadWards();
  }, [selectedDistrict]);

  // Xử lí khi lưu địa chỉ mới.
  const handleSaveAddress = async () => {
    if (!selectedProvince || !selectedDistrict || !selectedWard || !detail)
      return;
    const newAddress = {
      province: selectedProvince.name,
      district: selectedDistrict.name,
      ward: selectedWard.name,
      detail,
    };
    try {
      const data = await addressApi.createAddress(newAddress);
      console.log("Địa chỉ đã lưu thành công:", data);
      setAddresses([...addresses, data]);
      setShowForm(false);
    } catch (error) {
      console.error("Lỗi khi lưu địa chỉ:", error.message);
    }
  };

  // Xử lí xóa địa chỉ của user
  const handleDeleteAddress = async (id) => {
    try {
      await addressApi.deleteAddressById(id);
      setAddresses(addresses.filter((addr) => addr._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error.message);
    }
  };

  // Xử lí đặt địa chỉ thành mặc định
  const handleSetDefault = async (id) => {
    try {
      await addressApi.setDefaultAddress(id);
      setAddresses((prevAddresses) =>
        prevAddresses.map((addr) => ({
          ...addr,
          isDefault: addr._id === id, // Chỉ địa chỉ được chọn mới là mặc định
        }))
      );
    } catch (error) {
      console.error("Lỗi khi đặt địa chỉ mặc định:", error.message);
    }
  };

  // Xử lý khi người dùng nhấn nút chỉnh sửa
  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find((addr) => addr._id === id);
    if (addressToEdit) {
      setEditingAddress(addressToEdit);
      setSelectedProvince(
        provinces.find((p) => p.name === addressToEdit.province) || null
      );
      setSelectedDistrict(
        districts.find((d) => d.name === addressToEdit.district) || null
      );
      setSelectedWard(wards.find((w) => w.name === addressToEdit.ward) || null);
      setDetail(addressToEdit.detail);
      setShowForm(true);
    }
  };

  // Xử lý cập nhật địa chỉ
  const handleUpdateAddress = async () => {
    if (!selectedProvince || !selectedDistrict || !selectedWard || !detail)
      return;

    const updatedAddress = {
      province: selectedProvince.name,
      district: selectedDistrict.name,
      ward: selectedWard.name,
      detail,
    };

    try {
      const data = await addressApi.editAddress(
        editingAddress._id,
        updatedAddress
      );
      setAddresses(
        addresses.map((addr) => (addr._id === editingAddress._id ? data : addr))
      );
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ:", error.message);
    }
  };

  return (
    <div className="address-container">
      <div className="header">
        <h2>ĐỊA CHỈ CỦA TÔI</h2>
        <Button
          className="add-address-button"
          onClick={() => setShowForm(true)}
        >
          <AddIcon /> Thêm địa chỉ mới
        </Button>
      </div>

      <div className="address-list">
        <h3>Địa chỉ</h3>
        {addresses.length === 0 ? (
          <p className="empty-text">Chưa có địa chỉ nào.</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr._id}
              className={`address-item ${addr.isDefault ? "default" : ""}`}
            >
              <p>
                <strong>Tỉnh:</strong> {addr.province}
              </p>
              <p>
                <strong>Quận/Huyện:</strong> {addr.district}
              </p>
              <p>
                <strong>Xã/Phường:</strong> {addr.ward}
              </p>
              <p>
                <strong>Chi tiết:</strong> {addr.detail}
              </p>
              <div className="address-actions">
                <CustomTooltip title="Tọa độ">
                  <IconButton onClick={() => setShowMap(addr._id)}>
                    <MyLocationIcon sx={{ color: "#000" }} />
                  </IconButton>
                </CustomTooltip>
                <CustomTooltip title="Chỉnh sửa">
                  <IconButton onClick={() => handleEditAddress(addr._id)}>
                    <EditLocationAltIcon sx={{ color: "#000" }} />
                  </IconButton>
                </CustomTooltip>
                <CustomTooltip title="Xóa địa chỉ">
                  <IconButton
                    onClick={() => handleDeleteAddress(addr._id)}
                    color="error"
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                </CustomTooltip>
                <CustomTooltip
                  title={addr.isDefault ? "Mặc định" : "Đặt làm mặc định"}
                >
                  <IconButton onClick={() => handleSetDefault(addr._id)}>
                    {addr.isDefault ? (
                      <StarOutlinedIcon sx={{ color: "#1877F2" }} />
                    ) : (
                      <StarOutlineOutlinedIcon sx={{ color: "#000" }} />
                    )}
                  </IconButton>
                </CustomTooltip>
              </div>
              {showMap === addr._id && (
                <div className="map-overlay">
                  <div className="map-container">
                    <button
                      className="close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMap(null);
                      }}
                    >
                      ✖
                    </button>
                    <h3>Xem trước trên Google Maps</h3>
                    <iframe
                      width="100%"
                      height="350"
                      style={{
                        border: 0,
                        borderRadius: "8px",
                        marginTop: "10px",
                      }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        `${addr.detail}, ${addr.ward}, ${addr.district}, ${addr.province}`
                      )}&output=embed`}
                    ></iframe>
                    {/* Nút mở Google Maps */}
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${addr.detail}, ${addr.ward}, ${addr.district}, ${addr.province}`
                          )}`,
                          "_blank"
                        )
                      }
                      className="open-maps-btn"
                    >
                      📍 Xem chi tiết & Chỉ đường
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="map-overlay">
          <div className="address-form">
            <div className="form-header">
              <h2>{editingAddress ? "CHỈNH SỬA ĐỊA CHỈ" : "ĐỊA CHỈ MỚI"}</h2>
              <IconButton
                onClick={() => {
                  setShowForm(false);
                  setEditingAddress(null);
                  setSelectedProvince(null);
                  setDetail("");
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <div className="form-fields">
              <Autocomplete
                sx={{ mb: 2 }}
                options={provinces}
                getOptionLabel={(option) => option.name}
                value={selectedProvince}
                onChange={(event, newValue) => setSelectedProvince(newValue)}
                renderInput={(params) => <TextField {...params} label="Tỉnh" />}
              />
              <Autocomplete
                sx={{ mb: 2 }}
                disabled={!selectedProvince}
                options={districts}
                getOptionLabel={(option) => option.name}
                value={selectedDistrict}
                onChange={(event, newValue) => setSelectedDistrict(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Quận/Huyện" />
                )}
              />
              <Autocomplete
                sx={{ mb: 2 }}
                disabled={!selectedDistrict}
                options={wards}
                getOptionLabel={(option) => option.name}
                value={selectedWard}
                onChange={(event, newValue) => setSelectedWard(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Xã/Phường" />
                )}
              />
              <TextField
                id="outlined-basic"
                sx={{ width: "100%" }}
                label="Nhập địa chỉ chi tiết"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                variant="outlined"
              />
              <Button
                sx={{ mt: 2 }}
                onClick={
                  editingAddress ? handleUpdateAddress : handleSaveAddress
                }
              >
                {editingAddress ? "Cập nhật địa chỉ" : "Lưu địa chỉ"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPage;

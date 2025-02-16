import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightTwoToneIcon from "@mui/icons-material/ChevronRightTwoTone";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import { itemLoginData } from "../../constants/LoginData";
import { useState } from "react";

import "../../styles/HomePage.css";
import CustomTooltip from "../../components/CustomTooltip/CustomTooltip";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import DetailedDialog from "../../components/Toast/Dialog";
import useProtectedDialog from "../../hooks/protectedDialogHook";

const HomePage = () => {
  // Dùng useProtectedDialog để quản lí trang thái của Dialog
  const { open, setOpen, handleProtectedAction, navigate } =
    useProtectedDialog();

  // Xử lí Background
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Background Tiếp theo
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % itemLoginData.length);
  };
  // Background Trước
  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + itemLoginData.length) % itemLoginData.length
    );
  };

  return (
    <>
      {/* Homepage Container */}
      <div
        className="home-page-container"
        style={{
          backgroundImage: `url(${itemLoginData[currentImageIndex].img})`,
          backgroundSize: "cover",
        }}
      >
        {/* Header */}
        <Header />
        {/* Nút trái */}
        <button onClick={handlePrevImage} className="image-nav-button">
          <ChevronLeftIcon />
        </button>
        {/* Nút phải */}
        <button onClick={handleNextImage} className="image-nav-button">
          <ChevronRightTwoToneIcon />
        </button>

        {/* Homepage icons */}
        <div className="home-page-icons">
          <CustomTooltip title="Trang chủ">
            <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              <HomeIcon className="home-page-icon home" fontSize="small" />
            </div>
          </CustomTooltip>
          <CustomTooltip title="Tìm kiếm">
            <SearchIcon className="home-page-icon search" fontSize="small" />
          </CustomTooltip>
          <CustomTooltip title="Tài khoản cá nhân">
            <PersonOutlineOutlinedIcon
              className="home-page-icon profile"
              fontSize="small"
              onClick={() => handleProtectedAction("/levents/profile/view")}
            />
          </CustomTooltip>
        </div>

        {/* Dấu chấm chỉ sốsố */}
        <div className="dot-indicator-container">
          {itemLoginData.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentImageIndex ? "active" : ""}`}
            ></div>
          ))}
        </div>
      </div>
      <Footer />
      {/* Dialog */}
      <DetailedDialog
        open={open}
        onClose={() => setOpen(false)}
        onLogin={() => navigate("/levents/login")}
      />
    </>
  );
};

export default HomePage;

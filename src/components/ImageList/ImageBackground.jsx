import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { itemRegisterData } from "../../constants/RegisterData";

const ImageBackground = () => {
  return (
    <ImageList
      sx={{
        width: 600,
        height: "95vh",
        margin: "0 auto", // Căn giữa toàn bộ danh sách ảnh
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
      }}
      variant="woven"
      cols={3}
      gap={8}
    >
      {itemRegisterData.map((item) => (
        <ImageListItem
          key={item.img}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "8px", // Làm tròn góc
          }}
        >
          <img
            srcSet={`${item.img}?w=161&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.img}?w=161&fit=crop&auto=format`}
            alt={item.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // Đảm bảo ảnh bao phủ toàn bộ khung
              objectPosition: "center", // Căn giữa hình ảnh
            }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default ImageBackground;

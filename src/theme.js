import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = extendTheme({
  fashion: {
    appBarHeight: "58px",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#1877F2",
        },
        secondary: {
          main: "#F7F7F7",
        },
        background: {
          default: "#FFFFFF",
          paper: "#F7F7F7",
        },
        text: {
          primary: "#1C2B33",
          secondary: "#65676B",
        },
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: "#4267B2", // Màu xanh đậm Facebook
        },
        secondary: {
          main: "#333333", // Màu xám đậm
        },
        background: {
          default: "#1C1E21", // Màu đen nhạt
          paper: "#333333", // Màu xám đậm
        },
        text: {
          primary: "#FFFFFF", // Màu trắng
          secondary: "#B1B3B5", // Màu xám nhạt
        },
      },
    },
  },
});

export default theme;

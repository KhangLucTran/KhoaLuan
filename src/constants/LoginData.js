import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";

import background1 from "../assets/bg1.png";
import background8 from "../assets/bg8.jpg";
import background10 from "../assets/bg10.jpg";
import background11 from "../assets/bg11.jpg";
import background12 from "../assets/bg12.jpg";

// Dữ liệu của LoginForm
const loginFields = [
  {
    name: "email",
    width: "280px",
    label: "Email",
    type: "email",
    autoComplete: "current-email",
    icon: EmailIcon,
  },
  {
    name: "password",
    width: "280px",
    label: "Mật khẩu",
    type: "password",
    autoComplete: "current-password",
    icon: PasswordIcon,
    isPasswordField: true,
  },
];

// Hình ảnh của itemData Login
const itemLoginData = [
  {
    img: background12,
    title: "Levents",
    rows: 2,
    cols: 2,
  },
  {
    img: background8,
    title: "Levents",
  },
  {
    img: background11,
    title: "Tomato basil",
  },
  {
    img: background10,
    title: "Sea star",
  },
  {
    img: background1,
    title: "Bike",
    cols: 2,
  },
];
export { loginFields, itemLoginData };

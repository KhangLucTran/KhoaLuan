import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

import background15 from "../assets/bg15.jpg";
import background3 from "../assets/bg3.jpg";
import background4 from "../assets/bg4.jpg";
import background5 from "../assets/bg5.jpg";
import background6 from "../assets/bg6.jpg";
import background7 from "../assets/bg7.jpg";
import background8 from "../assets/bg8.jpg";
import background9 from "../assets/bg9.jpg";
import background10 from "../assets/bg10.jpg";
import background11 from "../assets/bg11.jpg";
import background12 from "../assets/bg12.jpg";
import background13 from "../assets/bg13.jpg";

// Dữ liệu của RegisterForm
const registerFields = [
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
  {
    name: "username",
    width: "280px",
    label: "Tên tài khoản",
    type: "text",
    autoComplete: "current-username",
    icon: AssignmentIndIcon,
  },
  {
    name: "numberphone",
    width: "280px",
    label: "SĐT",
    type: "numberphone",
    autoComplete: "current-numberphone",
    icon: ContactPhoneIcon,
  },
];

// Hình ảnh của itemData Login
const itemRegisterData = [
  {
    img: background10,
    title: "Levents",
    rows: 2,
    cols: 2,
  },
  {
    img: background3,
    title: "Levents",
  },
  {
    img: background4,
    title: "Levents",
  },
  {
    img: background5,
    title: "Levents",
    cols: 2,
  },
  {
    img: background6,
    title: "Levents",
    cols: 2,
  },
  {
    img: background7,
    title: "Levents",
    author: "@arwinneil",
    rows: 2,
    cols: 2,
  },
  {
    img: background8,
    title: "Levents",
  },
  {
    img: background9,
    title: "Fern",
  },
  {
    img: background13,
    title: "Mushrooms",
    rows: 2,
    cols: 2,
  },
  {
    img: background11,
    title: "Tomato basil",
  },
  {
    img: background12,
    title: "Sea star",
  },
  {
    img: background15,
    title: "Bike",
    cols: 2,
  },
];
export { registerFields, itemRegisterData };

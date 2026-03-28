import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import background1 from "../assets/bg1.png";
import background3 from "../assets/bg3.jpg";
import background4 from "../assets/bg4.jpg";
import background5 from "../assets/bg5.jpg";
import background6 from "../assets/bg6.jpg";

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
    img: background1,
    title: "Breakfast",
    rows: 2,
    cols: 2,
  },
  {
    img: background3,
    title: "Burger",
  },
  {
    img: background4,
    title: "Camera",
  },
  {
    img: background5,
    title: "Coffee",
    cols: 2,
  },
  {
    img: background6,
    title: "Hats",
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
    author: "@arwinneil",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    cols: 2,
  },
];
export { loginFields, itemLoginData };

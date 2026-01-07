import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

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

export { registerFields };

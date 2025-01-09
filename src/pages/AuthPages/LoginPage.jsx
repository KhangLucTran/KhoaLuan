import AuthForm from "../../components/AuthForm";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";

const LoginPage = () => {
  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      autoComplete: "current-email",
      icon: <EmailIcon fontSize="small" />,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      autoComplete: "current-password",
      icon: <PasswordIcon fontSize="small" />,
      isPasswordField: true,
    },
  ];

  const handleSubmit = (formValues) => {
    console.log("Submitted Values:", formValues);
  };

  return (
    <div>
      <AuthForm
        fields={fields}
        onSubmit={handleSubmit}
        buttonText="Đăng nhập"
      />
    </div>
  );
};

export default LoginPage;

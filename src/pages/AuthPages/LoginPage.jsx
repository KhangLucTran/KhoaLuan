import AuthForm from "../../components/AuthForm";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles"; // Sử dụng đúng thư viện Material-UI
import SubmitButton from "../../components/SubmitButton";
import GoogleIcon from "../../assets/logo_google_icon.svg";
import FacebookIcon from "../../assets/logo_facebook_icon.svg";

const LoginPage = () => {
  const theme = useTheme();

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
    <Container sx={{ mt: 5 }}>
      {/* Levents and Title */}
      <Box mb={4}>
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
          color={theme.palette.primary.main}
        >
          Levents
        </Typography>
        <Typography variant="h4" fontWeight="bold" width="350">
          Login Account
        </Typography>
        <Typography mb={4}>Welcome back, login to continue</Typography>
      </Box>

      {/* Button Login: Google and FaceBook */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mb: 7,
        }}
      >
        {/* Google Icon Button */}
        <SubmitButton
          variant="outlined"
          text="Continue with Google"
          icon={
            <img
              src={GoogleIcon}
              alt="Google Icon"
              style={{ width: 20, height: 20 }}
            />
          }
          onClick={() => console.log("Login with Google")}
          sx={{ color: "black" }}
        />
        {/* Facebook Icon Button */}
        <SubmitButton
          variant="outlined"
          text="Continue with Facebook"
          icon={
            <img
              src={FacebookIcon}
              alt="FaceBook Icon"
              style={{ width: 20, height: 20 }}
            />
          }
          onClick={() => console.log("Login with Facebook")}
        />
      </Box>

      {/* Auth Form */}
      <Box sx={{ mb: 3 }}>
        <AuthForm
          fields={fields}
          onSubmit={handleSubmit}
          buttonText="Sign in"
        />
      </Box>
      {/* Do you have account? */}
      <Box>
        <Typography mb={4}>
          Don't have an account?{" "}
          <Typography
            component="span"
            sx={{
              color: theme.palette.primary.main,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Signup
          </Typography>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;

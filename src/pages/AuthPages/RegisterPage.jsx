import { useTheme } from "@emotion/react";
import AuthForm from "../../components/AuthForm";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import SubmitButton from "../../components/SubmitButton";
import GoogleIcon from "../../assets/logo_google_icon.svg";
import FacebookIcon from "../../assets/logo_facebook_icon1.svg";
import Background from "../../assets/bg4.jpg";
import ModeSelect from "../../components/ModeSelect/ModeSelect";
import BadgeIcon from "@mui/icons-material/Badge";

const RegisterPage = () => {
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
    {
      name: "username",
      label: "Username",
      type: "text",
      autoComplete: "current-username",
      icon: <BadgeIcon fontSize="small" />,
    },
  ];

  return (
    <>
      <>
        <ModeSelect />
        <Container
          sx={{
            mb: 5,
            display: "flex", // Đặt layout flexbox
            alignItems: "center", // Căn giữa theo chiều dọc
            justifyContent: "space-evenly", // Tạo khoảng cách giữa 2 Box chính
            gap: 1, // Khoảng cách giữa các phần tử (nếu cần)
            flexWrap: "wrap", // Đảm bảo bố cục đáp ứng trên màn hình nhỏ
          }}
        >
          {/* Box chứa nội dung đăng nhập */}
          <Box sx={{ flex: 1, minWidth: "300px", ml: { xs: 0, md: 8 } }}>
            {/* Levents and Title */}
            <Box mb={4} mt={6}>
              <Typography
                variant="h5"
                fontWeight="bold"
                mb={1}
                color={theme.palette.primary.main}
              >
                Levents.
              </Typography>
              <Typography variant="h3" fontWeight="bold" width="350">
                Register account
              </Typography>
              <Typography>Welcome to Levents, register to continue</Typography>
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
              {/* Separator OR */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 280,
                  mt: 4,
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: "#ccc",
                  }}
                />
                <Typography
                  sx={{
                    mx: 2,
                    color: "#999",
                    fontWeight: "bold",
                  }}
                >
                  OR
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: "#ccc",
                  }}
                />
              </Box>
            </Box>

            {/* Auth Form */}
            <Box sx={{ mb: 3 }}>
              <AuthForm
                fields={fields}
                // onSubmit={handleSubmit}
                buttonText="Register"
              />
            </Box>
          </Box>

          {/* Box chứa hình nền */}
          <Box
            sx={{
              flex: 1,
              minWidth: "300px",
              backgroundImage: `url(${Background})`,
              backgroundSize: "cover", // Đảm bảo hình ảnh phủ kín Box
              backgroundPosition: "center", // Căn giữa hình ảnh
              backgroundRepeat: "no-repeat", // Không lặp lại hình ảnh
              height: "90vh", // Chiều cao toàn màn hình
              border: "1px solid #65676B",
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.05)", // Điều chỉnh độ mờ
              backgroundBlendMode: "screen",
            }}
          >
            <Box sx={{ mt: 60, ml: 5 }}>
              <Typography variant="h5" fontWeight="bold" mb={1} color="white">
                Levents.
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                width="350"
                color="white"
              >
                Sign in to begin your shopping experience.
              </Typography>
            </Box>
          </Box>
        </Container>
      </>
    </>
  );
};

export default RegisterPage;

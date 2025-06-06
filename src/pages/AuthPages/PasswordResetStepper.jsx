import { useDispatch, useSelector } from "react-redux";
import {
  updateFormData,
  goToNextStep,
  goToPreviousStep,
  resetProcess,
  sendResetEmail,
  verifyOtp,
  resetPassword,
} from "../../features/auth/passwordResetSlice";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  TextField,
  // Input,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { showErrorToast, showSuccessToast } from "../../components/Toast/Toast";
import { useRef, useState } from "react";
import { validateEmail, validatePassword } from "../../utils/validation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const steps = [
  {
    label: "Nhập Email",
    description:
      "Vui lòng nhập email mà bạn đã đăng ký để tiến hành khôi phục mật khẩu.",
    field: "email",
    placeholder: "Nhập email của bạn",
  },
  {
    label: "Nhập mã OTP",
    description:
      "Một mã OTP gồm 6 chữ số đã được gửi đến email của bạn. Hãy nhập mã này để xác minh." +
      "\n" +
      "Nếu bạn không nhận được mã, vui lòng bấm Quay lại để thử lại hoặc kiểm tra địa chỉ email.",
    field: "otp",
  },
  {
    label: "Đặt mật khẩu mới",
    description:
      "Hãy nhập mật khẩu mới và xác nhận lại để đảm bảo không có sai sót.",
    fields: ["password", "confirmPassword"],
    placeholders: ["Mật khẩu mới", "Xác nhận mật khẩu"],
  },
];
const PasswordResetStepper = () => {
  // useDispatch
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { email, otp, password, confirmPassword, step, loading } = useSelector(
    (state) => state.passwordReset
  );

  // Xử lí focus 6 ô OTP
  const otpInputs = useRef([]);

  // Xử lí khi có dữ liệu thay đổi
  const handleChange = (field, value) => {
    dispatch(updateFormData({ field, value }));
  };

  // Xử lí dữ liệu 6 ô OTP
  const handleOtpChange = (index, value) => {
    // Chỉ cho phép nhập số và giới hạn 1 ký tự
    if (!/^\d?$/.test(value)) return;

    // Đảm bảo otp luôn có đủ 6 ký tự
    const otpArray = otp.padEnd(6, " ").split("");
    otpArray[index] = value;

    dispatch(updateFormData({ field: "otp", value: otpArray.join("").trim() }));

    // Nếu xóa (Backspace) và không phải ô đầu tiên -> lui lại ô trước
    if (!value && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  // Xử lí khi dán mã OTP
  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(paste)) {
      const pasteArray = paste.split("");
      dispatch(updateFormData({ field: "otp", value: paste }));
      pasteArray.forEach((char, i) => {
        if (otpInputs.current[i]) {
          otpInputs.current[i].value = char;
        }
      });
      otpInputs.current[5]?.focus(); // Focus ô cuối cùng
    }
  };

  // Xử lí khi bấm vào icon hiện/ẩn mật khẩu
  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Xử lí khi bấm "Tiếp tục"
  const handleNext = async () => {
    // Bước 1 - Nhập email: kiểm tra email, gọi sendReset từ Redux
    if (step === 0) {
      const emailError = validateEmail(email);
      if (emailError) {
        showErrorToast(emailError);
        return;
      }
      try {
        // Await dispatch để lấy kết quả
        const response = await dispatch(sendResetEmail(email)).unwrap();

        // Nếu response có lỗi (theo backend trả về)
        if (response.error === 1) {
          showErrorToast(response.message);
          return;
        }

        // Nếu không lỗi thì tiếp tục bước tiếp theo
        showSuccessToast(
          "Mã xác nhận đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư để nhận mã OTP."
        );
        dispatch(goToNextStep());
      } catch (error) {
        // Bắt lỗi khác nếu có
        showErrorToast(error.message || "Có lỗi xảy ra, vui lòng thử lại");
      }
    }
    // Bước 2 - Nhập mã OTP: kiểm tra độ dài otp, gọi verifyOtp từ Redux
    else if (step === 1) {
      if (otp.length !== 6) {
        showErrorToast("Vui lòng nhập đủ 6 số OTP 🔥");
        return;
      }
      dispatch(verifyOtp({ email, otp }))
        .unwrap()
        .then(() => {
          showSuccessToast("Xác thực OTP thành công");
          dispatch(goToNextStep());
        })
        .catch((error) => showErrorToast(`Lỗi: ${error} 🔥`));
    }
    // Bước 3: Đặt lại mật khẩu mới: kiểm tra password và comfirmPassword
    else {
      if (!password || !confirmPassword) {
        showErrorToast("Vui lòng nhập giá trị 🔥");
        return;
      }
      const passwordError = validatePassword(password);
      if (passwordError) {
        showErrorToast(passwordError);
        return;
      }
      if (password !== confirmPassword) {
        showErrorToast("Mật khẩu bạn nhập không trùng khớp 🔥");
        return;
      }
      dispatch(resetPassword({ email, password }))
        .unwrap()
        .then(() => {
          showSuccessToast("Khôi phục mật khẩu thành công!");
          dispatch(goToNextStep());
        })
        .catch((error) => showErrorToast(`Lỗi: ${error.message} 🔥`));
    }
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={step} orientation="vertical">
        {steps.map((stepData, index) => (
          <Step key={stepData.label}>
            <StepLabel>{stepData.label}</StepLabel>
            <StepContent>
              <Typography sx={{ mb: 2, fontStyle: "italic", color: "#666" }}>
                {stepData.description}
              </Typography>

              {stepData.field === "otp" ? (
                // OTP Form
                <Box sx={{ display: "flex", gap: 1 }}>
                  {[...Array(6)].map((_, i) => (
                    <TextField
                      key={i}
                      type="text"
                      inputRef={(el) => (otpInputs.current[i] = el)}
                      inputProps={{
                        maxLength: 1,
                        inputMode: "numeric",
                        style: { textAlign: "center", fontSize: "1.2rem" },
                      }}
                      value={otp[i] || ""}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onPaste={i === 0 ? handleOtpPaste : undefined}
                      sx={{ width: "40px" }}
                    />
                  ))}
                </Box>
              ) : stepData.field ? (
                // Email Form
                <TextField
                  fullWidth
                  margin="normal"
                  label={stepData.label}
                  placeholder={stepData.placeholder}
                  value={stepData.field === "email" ? email : otp}
                  onChange={(e) => handleChange(stepData.field, e.target.value)}
                />
              ) : (
                stepData.fields.map((field, i) => (
                  // ResetPassword Form
                  <TextField
                    key={field}
                    fullWidth
                    margin="normal"
                    type={showPassword ? "text" : "password"}
                    label={stepData.placeholders[i]}
                    placeholder={stepData.placeholders[i]}
                    value={field === "password" ? password : confirmPassword}
                    onChange={(e) => handleChange(field, e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleToggleVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ))
              )}

              {/* Button: "Hoàn tất", "Tiếp tục", "Quay lại" */}
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{ mt: 1, mr: 1 }}
                >
                  {index === steps.length - 1 ? "Hoàn tất" : "Tiếp tục"}
                </Button>
                <Button
                  disabled={index === 0}
                  onClick={() => dispatch(goToPreviousStep())}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Quay lại
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {/* Nếu hoàn thành step: Hiện thông báo thành công */}
      {step >= steps.length && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Làm tối nền
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000, // Đảm bảo hiển thị trên cùng
          }}
        >
          <div
            style={{
              maxWidth: 400,
              width: "90%",
              padding: "2rem",
              textAlign: "center",
              border: "1px solid #ddd",
              borderRadius: "12px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
              backgroundColor: "#fafafa",
              transform: "scale(1)",
              animation: "fadeInScale 0.4s ease-in-out",
            }}
          >
            <CheckCircleIcon
              fontSize="large"
              sx={{ width: "100px", color: "#2ecc71" }}
            />
            <h2 style={{ margin: "0 0 1rem", color: "#1877F2" }}>
              Mật khẩu đã được đặt lại!
            </h2>
            <p style={{ color: "#555", marginBottom: "2rem" }}>
              Bạn có thể sử dụng mật khẩu mới để đăng nhập lại tài khoản.
            </p>
            <button
              onClick={() => dispatch(resetProcess())}
              style={{
                padding: "0.6rem 1.2rem",
                fontSize: "1rem",
                backgroundColor: "#1877F2",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "opacity 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.opacity = "0.9")}
              onMouseOut={(e) => (e.target.style.opacity = "1")}
            >
              Thực hiện lại
            </button>
            <div style={{ marginTop: "1.5rem" }}>
              <a
                href="/levents/login"
                style={{
                  textDecoration: "none",
                  color: "#1877F2",
                  fontWeight: "500",
                }}
              >
                Quay lại trang đăng nhập
              </a>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default PasswordResetStepper;

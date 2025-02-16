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
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import { showErrorToast, showSuccessToast } from "../../components/Toast/Toast";
import { useRef } from "react";

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
      "Một mã OTP gồm 6 chữ số đã được gửi đến email của bạn. Hãy nhập mã này để xác minh.",
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
    const newOtp = otp.split("");
    newOtp[index] = value;
    dispatch(updateFormData({ field: "otp", value: newOtp.join("") }));

    if (value && index < 5) {
      otpInputs.current[index]?.focus();
    }
  };

  // Xử lí khi bấm "Tiếp tục"
  const handleNext = async () => {
    // Bước 1 - Nhập email: kiểm tra email, gọi sendReset từ Redux
    if (step === 0) {
      if (!email) {
        showErrorToast("Vui lòng nhập email 🔥");
        return;
      }
      dispatch(sendResetEmail(email))
        .unwrap()
        .then(() => {
          showSuccessToast(
            "Mã xác nhận đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư để nhận mã OTP."
          );
          dispatch(goToNextStep());
        })
        .catch((error) => showErrorToast(error));
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
      if (password !== confirmPassword) {
        showErrorToast("Mật khẩu không khớp 🔥");
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
                        style: { textAlign: "center" },
                      }}
                      value={otp[i] || ""}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
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
                    type="password"
                    label={stepData.placeholders[i]}
                    placeholder={stepData.placeholders[i]}
                    value={field === "password" ? password : confirmPassword}
                    onChange={(e) => handleChange(field, e.target.value)}
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
        <Paper
          square
          elevation={3}
          sx={{
            p: 3,
            borderRadius: "12px",
            bgcolor: "#f0f0f0",
            textAlign: "center",
            maxWidth: 350,
            mt: "6rem",
            mx: "auto",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            🎉 Khôi phục mật khẩu thành công!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetProcess())}
            sx={{ borderRadius: "8px", px: 3, py: 1 }}
          >
            Thực hiện lại
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default PasswordResetStepper;

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const SubmitButton = ({ variant, icon, text, onClick, sx, disabled }) => {
  // state nội bộ để giữ trạng thái disabled thêm 3 giây khi disabled trở thành true
  const [tempDisabled, setTempDisabled] = useState(false);

  useEffect(() => {
    if (disabled) {
      // Khi disabled trở thành true, thiết lập trạng thái tạm thời và bắt đầu timer 3s
      setTempDisabled(true);
      const timer = setTimeout(() => {
        setTempDisabled(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [disabled]);

  // Nút bị disable nếu hoặc prop disabled hoặc trạng thái tempDisabled là true
  const finalDisabled = disabled || tempDisabled;

  return (
    <Button
      variant={variant}
      color="text"
      onClick={onClick}
      startIcon={icon}
      disabled={finalDisabled}
      sx={{ ...sx }}
    >
      {text}
    </Button>
  );
};

SubmitButton.propTypes = {
  variant: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.element,
  sx: PropTypes.object,
  disabled: PropTypes.bool,
};

SubmitButton.defaultProps = {
  disabled: false,
};

export default SubmitButton;

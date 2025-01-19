import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const SubmitButton = ({ variant, icon, text, onClick, sx }) => (
  <Button
    variant={variant}
    color="text"
    onClick={onClick}
    startIcon={icon}
    sx={{ ...sx }}
  >
    {text}
  </Button>
);

SubmitButton.propTypes = {
  variant: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.element,
  sx: PropTypes.object,
};

export default SubmitButton;

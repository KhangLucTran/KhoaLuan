import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const SubmitButton = ({ text, onClick }) => (
  <Button
    variant="contained"
    color="primary"
    onClick={onClick}
    sx={{ borderRadius: 3 }}
  >
    {text}
  </Button>
);

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SubmitButton;

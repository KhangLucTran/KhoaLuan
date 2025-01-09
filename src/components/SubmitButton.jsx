import Button from "@mui/material/Button";

const SubmitButton = ({ text }) => {
  return (
    <Button variant="contained" color="primary" type="submit" fullWidth>
      {text}
    </Button>
  );
};

export default SubmitButton;

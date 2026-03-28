// SocialButtons.jsx
import SubmitButton from "./SubmitButton";
import GoogleIcon from "../../assets/logo_google_icon.svg";
import FacebookIcon from "../../assets/logo_facebook_icon1.svg";

const sx = {
  borderRadius: 3,
  width: 20,
  color: "text",
  border: "1px solid",
  borderColor: "text.secondary",
  textTransform: "none",
};

const SocialButtons = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
      {/* Google ButtonButton */}
      <SubmitButton
        variant="outlined"
        icon={
          <img
            src={GoogleIcon}
            alt="Google Icon"
            style={{ width: 20, height: 20, alignItems: "center" }}
          />
        }
        onClick={() => console.log("Login with Google")}
        sx={sx}
      />
      {/* Facebook Button */}
      <SubmitButton
        variant="outlined"
        icon={
          <img
            src={FacebookIcon}
            alt="Facebook Icon"
            style={{ width: 20, height: 20, alignItems: "center" }}
          />
        }
        sx={sx}
        onClick={() => console.log("Login with Facebook")}
      />
    </div>
  );
};

export default SocialButtons;

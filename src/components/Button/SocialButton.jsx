import SubmitButton from "./SubmitButton";
import GoogleIcon from "../../assets/logo_google_icon.svg";
import FacebookIcon from "../../assets/logo_facebook_icon1.svg";

import CustomTooltip from "../CustomTooltip/CustomTooltip";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const sx = {
  borderRadius: 3,
  width: 20,
  color: "text",
  border: "1px solid",
  borderColor: "#000",
  textTransform: "none",
  position: "relative",
};

const SocialButtons = () => {
  const [loading, setLoading] = useState(false);
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  const handleGoogleLogin = () => {
    if (!loading) {
      setLoading(true);
      window.location.href = "http://localhost:5000/api/auth/google";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
      <CustomTooltip title="Tiếp tục bằng Google">
        <span>
          <SubmitButton
            variant="outlined"
            icon={
              loading ? (
                <span>🔄</span>
              ) : (
                <img
                  src={GoogleIcon}
                  alt="Google Icon"
                  style={{ width: 30, height: 30, alignItems: "center" }}
                />
              )
            }
            onClick={handleGoogleLogin}
            sx={sx}
            disabled={isLoading || loading}
          />
        </span>
      </CustomTooltip>
      <CustomTooltip title="Tiếp tục bằng Facebook">
        <span>
          <SubmitButton
            variant="outlined"
            icon={
              <img
                src={FacebookIcon}
                alt="Facebook Icon"
                style={{ width: 30, height: 30, alignItems: "center" }}
              />
            }
            onClick={() => console.log("Login with Facebook")}
            sx={sx}
            disabled={isLoading}
          />
        </span>
      </CustomTooltip>
    </div>
  );
};

export default SocialButtons;

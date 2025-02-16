import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const StyleTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black, // Màu của mũi tên
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black, // Màu nền của tooltip
    color: "white", // Màu chữ trong tooltip
    fontSize: "0.7rem", // Tùy chỉnh cỡ chữ (nếu cần)
  },
}));

const CustomTooltip = ({ title, children }) => {
  return <StyleTooltip title={title}>{children}</StyleTooltip>;
};

CustomTooltip.propTypes;

export default CustomTooltip;

import PropTypes from "prop-types";
import "../../styles/SkeletonLoadingLines.css"; // Import CSS styles for the spinner

const SkeletonLoadingSpinner = ({ size, thickness, color }) => {
  return (
    <div
      className="skeleton-spinner"
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
        borderColor: `${color} transparent transparent transparent`,
      }}
    />
  );
};

SkeletonLoadingSpinner.propTypes = {
  size: PropTypes.number, // Kích thước spinner (width = height)
  thickness: PropTypes.number, // Độ dày viền spinner
  color: PropTypes.string, // Màu viền spinner
};

SkeletonLoadingSpinner.defaultProps = {
  size: 40,
  thickness: 4,
  color: "#1877F2", // màu xanh chủ đạo của bạn
};

export default SkeletonLoadingSpinner;

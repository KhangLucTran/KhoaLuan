import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axios from "axios";
// import CommentForm from "../../components/Form/CommentForm";
import "../../styles/CommentPage.css";
import { Avatar } from "@mui/material";

const Comment = ({ productId, onRatingUpdate }) => {
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(0); // Điểm trung bình
  const [totalReviews, setTotalReviews] = useState(0); // Tổng số lượt đánh giá

  // Lấy tất cả bình luận của sản phẩm
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://khoaluan-backend.onrender.com/api/comment/${productId}`
        );
        const commentsData = response.data.data;

        // Thêm thông tin người dùng vào mỗi bình luận
        const commentsWithUserInfo = await Promise.all(
          commentsData.map(async (comment) => {
            const userResponse = await axios.get(
              `https://khoaluan-backend.onrender.com/api/user/get-users/${comment.userId._id}`
            );
            const user = userResponse.data.data;
            console.log("User trong comment:");
            comment.userId.profileId = {
              username: user.profileId.username || "Unknown User",
              avatar: user.profileId.avatar || "default-avatar.jpg",
            };

            return comment;
          })
        );

        // Cập nhật bình luận
        setComments(commentsWithUserInfo);

        // Tính toán tổng sao và điểm trung bình
        const totalStars = commentsData.reduce(
          (acc, comment) => acc + comment.rating,
          0
        );
        const average = totalStars / commentsData.length || 0;
        setAverageRating(average.toFixed(1)); // Lấy điểm trung bình đến 1 chữ số
        setTotalReviews(commentsData.length); // Cập nhật tổng số lượt đánh giá

        // Truyền điểm trung bình và tổng số lượt đánh giá lên ProductDetail
        onRatingUpdate(average.toFixed(1), commentsData.length);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [productId, onRatingUpdate]);

  return (
    <>
      <div className="comment-container">
        <h3>ĐÁNH GIÁ SẢN PHẨM</h3>

        {/* Hiển thị điểm trung bình và tổng số lượt đánh giá */}
        <div className="rating-summary">
          <p className="average-rating">Điểm trung bình: {averageRating} / 5</p>
          <p className="total-reviews">Tổng số lượt đánh giá: {totalReviews}</p>
        </div>

        {comments.length === 0 ? (
          <p className="no-comments">Không có bình luận nào.</p>
        ) : (
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment._id} className="comment-item">
                <div className="user-info-comment">
                  <Avatar
                    src={
                      comment.userId.profileId?.avatar || "default-avatar.jpg"
                    }
                    alt={comment.userId.profileId?.username || "Unknown User"}
                    sx={{ width: "60px", height: "60px" }}
                  />
                  <div className="user-details-comment">
                    <p className="username-comment">
                      {comment.userId.profileId?.username || "Unknown User"}
                    </p>
                    <p className="user-email-comment">{comment.userId.email}</p>
                  </div>
                </div>
                <p className="rating-comment">{"★".repeat(comment.rating)}</p>
                <p className="message-comment">{comment.message}</p>
                <p className="timestamp">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* <CommentForm productId={productId} onCommentSubmit={handleNewComment} /> */}
    </>
  );
};

// Thêm PropTypes
Comment.propTypes = {
  productId: PropTypes.string.isRequired, // productId là một chuỗi bắt buộc
  onRatingUpdate: PropTypes.func.isRequired, // onRatingUpdate là một hàm bắt buộc
};

export default Comment;

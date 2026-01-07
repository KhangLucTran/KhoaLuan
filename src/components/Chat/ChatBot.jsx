// React
import { useEffect, useRef, useState } from "react";
// API
import { getProductsByCategoryApi } from "../../features/product/productApi";
// MUI Material
import CustomTooltip from "../CustomTooltip/CustomTooltip";
import { StarBorder } from "@mui/icons-material";
import PropTypes from "prop-types";
// React-redux
import { useSelector } from "react-redux";
// CSS
import "./ChatBot.css";
import { getAuthTokens } from "../../utils/token";

const ProductCard = ({ item }) => {
  const handleClick = () => {
    window.location.href = `/levents/product-detail/${item._id}`;
  };

  return (
    <CustomTooltip title={item.title}>
      <div
        className="product-card-chatbot"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <img
          className="product-card-image-chatbot"
          src={item.images?.[1] || "/placeholder-image.jpg"}
          alt={item.title || "Sản phẩm không có tiêu đề"}
        />
        <div className="product-card-content-chatbot">
          <h6 className="product-card-title-chatbot">
            {item.title || "Sản phẩm chưa có tên"}
          </h6>
          <p className="product-card-price-chatbot">
            {item.price
              ? `${item.price.toLocaleString()} VND`
              : "Giá chưa cập nhật"}
          </p>
          <p className="product-card-sold-chatbot">Đã bán: {item.sold}</p>
          <div className="product-card-rating-chatbot">
            <StarBorder style={{ verticalAlign: "middle", marginRight: 4 }} />
            <span>
              {item.rating !== undefined
                ? `${item.rating} / 5`
                : "Chưa có đánh giá"}
            </span>
          </div>
        </div>
      </div>
    </CustomTooltip>
  );
};

ProductCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    sold: PropTypes.number.isRequired,
    rating: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default function Chatbot() {
  const user = useSelector((state) => state.user.user) || "user123";
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [width, setWidth] = useState(320); // chiều rộng mặc định
  const containerRef = useRef(null);
  const resizing = useRef(false);
  const [sizeSuggestion, setSizeSuggestion] = useState(null);
  const token = getAuthTokens().accessToken;
  const [pendingRedirect, setPendingRedirect] = useState(null);

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  useEffect(() => {
    const text = user?.data?.profileId?.username
      ? `Chào ${user.data.profileId.username}! Tôi có thể giúp gì cho bạn hôm nay?`
      : "Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?";

    setMessages([{ from: "bot", text }]);

    // Trigger rung sau khi DOM đã render
    requestAnimationFrame(() => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 800);
    });
  }, [user]);

  async function sendMessage(messageText) {
    const userMessage = messageText || input;
    if (!userMessage.trim()) return;

    // Cập nhật tin nhắn user vào state messages
    const newMsgs = [...messages, { from: "user", text: userMessage }];
    setMessages(newMsgs);
    setInput("");
    setShowSuggestions(false);
    setSizeSuggestion(false);
    setIsBotTyping(true);

    try {
      const userId = user?._id || "anonymous";

      // Gửi yêu cầu lên backend chatbot
      const res = await fetch("http://localhost:5000/api/chat-bot/chatbot", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ userId, message: userMessage }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Lỗi kết nối server: " + res.status);
      const data = await res.json();
      console.log(data);
      if (data.redirect) {
        window.location.href = data.redirect;
        setIsBotTyping(false);
        return; // không hiển thị thêm reply nữa nếu bạn muốn
      }

      setTimeout(() => {
        let updatedMsgs = [...newMsgs];

        // Chatbot trả lời
        if (data.reply) {
          updatedMsgs.push({ from: "bot", text: data.reply });
        }

        // Nếu cần xác nhận trước khi redirect
        if (data.requireConfirmation && data.redirectPath) {
          setPendingRedirect({
            message: data.reply,
            path: data.redirectPath,
          });
          setIsBotTyping(false);
          return;
        }

        // Nếu không cần xác nhận, nhưng có redirectPath
        if (!data.requireConfirmation && data.redirectPath) {
          setMessages(updatedMsgs);
          setIsBotTyping(false);
          // Optional: delay 1-2 giây rồi redirect
          setTimeout(() => {
            window.location.href = data.redirectPath;
          }, 1500);
          return;
        }

        // Nếu có gợi ý sản phẩm
        if (
          data.products &&
          Array.isArray(data.products) &&
          data.products.length > 0
        ) {
          updatedMsgs.push({
            from: "bot",
            products: data.products.slice(0, 6),
          });
          setShowSuggestions(true);
        }

        // Nếu có gợi ý size
        if (data.height && data.weight && data.size) {
          setSizeSuggestion({
            height: data.height,
            weight: data.weight,
            size: data.size,
          });
        }

        // Cập nhật tin nhắn
        setMessages(updatedMsgs);
        setIsBotTyping(false);
      }, 1200);
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Xin lỗi, tôi không thể kết nối tới server." },
      ]);
      setIsBotTyping(false);
    }
  }

  // Tìm kiếm sản phẩm theo Category
  async function handleCategorySelection(label) {
    const mapCategory = {
      "Áo thun": "T-Shirt",
      "Áo sơ mi": "Shirt",
      "Quần ngắn": "Short",
      Nón: "Hat",
    };

    const categoryKey = mapCategory[label];
    if (!categoryKey) return;

    setMessages((msgs) => [...msgs, { from: "user", text: label }]);
    setShowSuggestions(false);
    setIsBotTyping(true);

    try {
      const data = await getProductsByCategoryApi(categoryKey);
      const fetchedProducts = data?.product || [];

      if (fetchedProducts.length === 0) {
        setTimeout(() => {
          setMessages((msgs) => [
            ...msgs,
            { from: "bot", text: `Hiện tại không có sản phẩm loại "${label}"` },
          ]);
          setIsBotTyping(false);
        }, 1200);
        return;
      }

      const random3 = fetchedProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: `Dưới đây là 4 sản phẩm loại "${label}":`,
            products: random3,
          },
        ]);
        setIsBotTyping(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: "Không thể tải sản phẩm. Vui lòng thử lại sau.",
          },
        ]);
        setIsBotTyping(false);
      }, 1200);
    }
  }

  // Xử lý bắt đầu kéo
  const onMouseDown = (e) => {
    e.preventDefault();
    resizing.current = true;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Xử lý kéo, thay đổi width
  const onMouseMove = (e) => {
    if (!resizing.current) return;
    if (!containerRef.current) return;

    const containerLeft = containerRef.current.getBoundingClientRect().left;
    const newWidth = e.clientX - containerLeft;

    if (newWidth >= 320 && newWidth <= 600) {
      setWidth(newWidth);
    }
  };

  // Kết thúc kéo
  const onMouseUp = () => {
    resizing.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  // Component gợi ý size
  function SizeSuggestion() {
    return (
      <div className="size-suggestion">
        <div className="size-icon">👕</div>
        <div className="size-content">
          <p>Dựa trên thông tin bạn cung cấp:</p>
          <ul className="size-list">
            <li>
              <span className="icon" role="img" aria-label="Chiều cao">
                📏
              </span>
              <span>{sizeSuggestion.height} cm</span>
            </li>
            <li>
              <span className="icon" role="img" aria-label="Cân nặng">
                ⚖️
              </span>
              <span>{sizeSuggestion.weight} kg</span>
            </li>
            <li>
              <strong>Size đề xuất:</strong>{" "}
              <span className="size-value">{sizeSuggestion.size}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomTooltip title="Chatbot">
        <button
          className="chatbot-toggle-btn"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Đóng chatbot" : "Mở chatbot"}
        >
          💬
        </button>
      </CustomTooltip>

      {isOpen && (
        <div
          className="chatbot-container"
          ref={containerRef}
          style={{ width: width + "px", maxWidth: "600px" }}
        >
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${msg.from === "user" ? "user" : "bot"}`}
              >
                {msg.from === "bot" ? (
                  <>
                    <span
                      role="img"
                      aria-label="robot"
                      className={`chatbot-icon ${animate ? "animate-shake" : ""}`}
                    >
                      🤖 <span className="chatbot-icon-name">chatbot</span>
                    </span>
                    <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>
                    {msg.products && (
                      <div className="product-container-chatbot">
                        {msg.products.map((item) => (
                          <ProductCard key={item._id} item={item} />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>{msg.text}</div>
                  </>
                )}
              </div>
            ))}

            {isBotTyping && (
              <div className="chatbot-message bot typing">
                <span className="chatbot-icon" role="img" aria-label="robot">
                  🤖
                </span>
                <div className="typing-indicator">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            )}

            {/* Confirm "Đồng ý" hay "Hủy bỏ" */}
            {pendingRedirect && (
              <div className="confirmation-box">
                <p>{pendingRedirect.message}</p>
                <div className="btn-group">
                  <button
                    onClick={() => {
                      window.location.href = pendingRedirect.path;
                    }}
                  >
                    Đồng ý
                  </button>
                  <button
                    onClick={() => {
                      setPendingRedirect(null);
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Gợi ý size */}
            {sizeSuggestion && (
              <>
                <SizeSuggestion
                  height={sizeSuggestion.height}
                  weight={sizeSuggestion.weight}
                  size={sizeSuggestion.size}
                />
              </>
            )}

            {/* Đề xuất xem sản phẩm */}
            {showSuggestions && (
              <div className="chatbot-suggestions">
                <button onClick={() => sendMessage("Tham khảo sản phẩm")}>
                  🛍 Tham khảo sản phẩm
                </button>
                <button onClick={() => handleCategorySelection("Áo thun")}>
                  👕 Áo thun
                </button>
                <button onClick={() => handleCategorySelection("Áo sơ mi")}>
                  👔 Áo sơ mi
                </button>
                <button onClick={() => handleCategorySelection("Quần ngắn")}>
                  👖 Quần ngắn
                </button>
                <button onClick={() => handleCategorySelection("Nón")}>
                  🎩 Nón
                </button>
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={() => sendMessage()}>Gửi</button>
          </div>

          {/* Vùng kéo giãn bên phải */}
          <div
            className="resizer"
            onMouseDown={onMouseDown}
            style={{
              width: "8px",
              cursor: "ew-resize",
              position: "absolute",
              top: 0,
              right: 0,
              height: "100%",
              zIndex: 10,
              backgroundColor: "transparent",
            }}
          />
        </div>
      )}
    </>
  );
}

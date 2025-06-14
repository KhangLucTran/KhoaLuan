import PropTypes from "prop-types";
import { useState, useEffect, useRef, useCallback } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { getSocket } from "../../utils/socket";
import { getAuthTokens } from "../../utils/token";
import { useSelector } from "react-redux";
import "../../styles/ChatBox.css";
import { jwtDecode } from "jwt-decode";

const ChatBox = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const chatBodyRef = useRef(null);
  const socket = getSocket();
  const token = getAuthTokens()?.accessToken || "";
  const user = useSelector((state) => state.user.user);
  const decodedToken = jwtDecode(token);
  const isAdmin = decodedToken?.role_code === "R1";

  useEffect(() => {
    if (!user || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chat", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(
          "❌ Lỗi khi tải tin nhắn:",
          error.response?.data || error
        );
        setMessages([]);
      }
    };

    fetchMessages();
  }, [user, token]);

  const handleNewMessage = useCallback((message) => {
    setMessages((prev) =>
      prev.some((msg) => msg._id === message._id) ? prev : [...prev, message]
    );
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, handleNewMessage]);

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const receiverId = isAdmin ? selectedUser : "67bc56f2c552de3a78a3a196";
    if (!receiverId) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { receiver: receiverId, message: input.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket?.emit("sendMessage", res.data);
      setMessages((prevMessages) => [...prevMessages, res.data]);
      setInput("");
    } catch (error) {
      console.error("❌ Lỗi khi gửi tin nhắn:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbox">
      <div className="chatbox-header">
        <h3>{isAdmin ? "Hộp thư Admin" : "Chat với Admin"}</h3>
        <IconButton onClick={onClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </div>

      {isAdmin && (
        <div className="user-selector">
          <select onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Chọn user</option>
            {messages.map((msg) => (
              <option key={msg.sender} value={msg.sender}>
                {msg.sender}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="chatbox-body" ref={chatBodyRef}>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`message-container ${msg.sender === user?._id ? "sent" : "received"}`}
            >
              <div className="message">{msg.message}</div>
            </div>
          ))
        ) : (
          <p className="no-messages">Chưa có tin nhắn nào</p>
        )}
      </div>

      <div className="chatbox-footer">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Nhập tin nhắn..."
          disabled={loading || (isAdmin && !selectedUser)}
        />
        <IconButton
          onClick={handleSendMessage}
          color="primary"
          disabled={loading || (isAdmin && !selectedUser)}
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};

ChatBox.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ChatBox;

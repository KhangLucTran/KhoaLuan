import PropTypes from "prop-types";
import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { getSocket } from "../../utils/socket";
import { getAuthTokens } from "../../utils/token";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { getAllUsersApi } from "../../features/user/userApi";
import "./ChatBox.css";

const ChatBox = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const chatBodyRef = useRef(null);

  const socket = getSocket();
  const token = getAuthTokens()?.accessToken || "";
  const user = useSelector((state) => state.user.user);
  const decodedToken = jwtDecode(token);
  const isAdmin = decodedToken?.role_code === "R1";

  const ADMIN_ID = "67bc56f2c552de3a78a3a196"; // ID cố định của Admin

  // Load danh sách người dùng (Admin)
  useEffect(() => {
    if (!user || !token || !isAdmin) return;

    const fetchUserList = async () => {
      try {
        const userListRes = await getAllUsersApi();
        const users = Array.isArray(userListRes?.data) ? userListRes.data : [];
        const filteredUsers = users.filter((u) => u._id !== user._id);
        setUserList(filteredUsers);
      } catch (error) {
        console.error(
          "❌ Lỗi khi lấy danh sách người dùng:",
          error.response?.data || error
        );
      }
    };

    fetchUserList();
  }, [user, token, isAdmin]);

  // Load tin nhắn giữa 2 người
  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) return;

      const receiverId = (isAdmin ? selectedUser : ADMIN_ID)?.trim();
      if (!receiverId) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/${receiverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("📩 Tin nhắn:", res.data);
        setMessages(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(
          "❌ Lỗi khi lấy tin nhắn:",
          error.response?.data || error
        );
      }
    };

    // Nếu người dùng không phải Admin hoặc nếu có selectedUser, fetch tin nhắn
    if ((isAdmin && selectedUser) || !isAdmin) {
      fetchMessages();
    }
  }, [selectedUser, isAdmin, token]);

  // Nhận tin nhắn realtime
  const handleNewMessage = useCallback((message) => {
    setMessages((prev) =>
      prev.some((msg) => msg._id === message._id) ? prev : [...prev, message]
    );
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("privateMessage", handleNewMessage);
    return () => socket.off("privateMessage", handleNewMessage);
  }, [socket, handleNewMessage]);

  // Tự động scroll khi có tin nhắn
  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const filteredMessages = messages;

  const handleSendMessage = async () => {
    const receiverId = isAdmin ? selectedUser : ADMIN_ID;
    if (!input.trim() || !receiverId) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { receiver: receiverId, message: input.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket?.emit("sendMessage", res.data);
      setMessages((prev) => [...prev, res.data]);
      setInput("");
    } catch (error) {
      console.error("❌ Gửi thất bại:", error.response?.data || error);
    }
  };

  return (
    <div className="chatbox-overlay">
      <div className="chatbox-modal">
        <div className="chatbox-header">
          <h3>
            {isAdmin
              ? selectedUser
                ? `Đang trò chuyện với ${
                    userList.find((u) => u._id === selectedUser)?.profileId
                      ?.username || "người dùng"
                  }`
                : "Chọn người dùng để bắt đầu trò chuyện"
              : "Chat với Admin"}
          </h3>
          <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </div>

        <div className="chatbox-content">
          {isAdmin && (
            <div className="chatbox-sidebar">
              <h4>Người dùng</h4>
              <ul className="user-list">
                {userList.map((u) => (
                  <li
                    key={u._id}
                    className={`user-list-item ${
                      selectedUser === u._id ? "active" : ""
                    }`}
                    onClick={() => setSelectedUser(u._id)}
                  >
                    <div className="user-item-message">
                      <Avatar
                        src={u.profileId?.avatar || "/default-avatar.png"}
                        alt={u.profileId?.username}
                        className="user-avatar-message"
                      />
                      <div className="user-info-message">
                        <div className="user-name-message">
                          {u.profileId?.username}
                        </div>
                        <div className="user-email-message">{u.email}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="chatbox-main">
            <div className="chatbox-body" ref={chatBodyRef}>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => {
                  const isSentByCurrentUser = msg.sender === user?.data?._id;
                  return (
                    <div
                      key={msg._id}
                      className={`message-container ${isSentByCurrentUser ? "sent" : "received"}`}
                    >
                      <Avatar
                        src={
                          isSentByCurrentUser
                            ? user?.data?.profileId?.avatar
                            : selectedUser?.data?.profileId?.avatar ||
                              "/default-avatar.png"
                        }
                        alt={
                          isSentByCurrentUser
                            ? user?.data?.profileId?.username
                            : selectedUser?.data?.profileId?.username
                        }
                        className="message-avatar"
                      />
                      <div className="message">{msg.message}</div>
                    </div>
                  );
                })
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
                disabled={isAdmin && !selectedUser}
              />
              <IconButton
                onClick={handleSendMessage}
                color="primary"
                disabled={isAdmin && (!input.trim() || !selectedUser)}
              >
                <SendIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ChatBox.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ChatBox;

import { io } from "socket.io-client";
import { getAuthTokens } from "./token"; // Import hàm lấy token
import { jwtDecode } from "jwt-decode";
let socket = null;

export const connectSocket = () => {
  if (!socket) {
    const tokens = getAuthTokens();
    const accessToken = tokens?.accessToken;

    // Kiểm tra token hợp lệ trước khi decode
    if (!accessToken || accessToken.split(".").length !== 3) {
      console.error("Token không hợp lệ hoặc bị thiếu!");
      return;
    }

    const decoded = jwtDecode(accessToken);

    const userId = decoded.id;

    socket = io("http://localhost:5000", {
      transports: ["websocket"],
      query: { userId },
      auth: { token: accessToken }, // Gửi token lên server khi kết nối
    });

    socket.on("connect", () => {
      console.log("🔗 Kết nối socket thành công:", socket.id);
      if (userId) {
        socket.emit("userOnline", userId);
        console.log(`📌 Đã gửi userId ${userId} lên server.`);
      }
    });

    socket.on("disconnect", () => {
      console.log("⚡ Mất kết nối socket.");
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔴 Socket đã bị đóng.");
  }
};

export const getSocket = () => socket;

import { io } from "socket.io-client";
import { getAuthTokens } from "./token"; // Import hàm lấy token

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    const tokens = getAuthTokens();
    const accessToken = tokens?.accessToken;

    socket = io("http://localhost:5000", {
      transports: ["websocket"],
      auth: { token: accessToken }, // Gửi token lên server khi kết nối
    });

    socket.on("connect", () => {
      console.log("🔗 Kết nối socket thành công:", socket.id);
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

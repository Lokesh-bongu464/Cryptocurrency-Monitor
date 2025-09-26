import { io } from "socket.io-client";

const WEBSOCKET_URL =
  process.env.REACT_APP_WEBSOCKET_URL || "http://localhost:5000";

export const socket = io(WEBSOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Join user's room when connected
let currentUserId = "test-user"; // Default user ID

socket.on("connect", () => {
  console.log("Connected to WebSocket server");
  if (currentUserId) {
    socket.emit("join_user_room", currentUserId);
  }
});

socket.on("connect_error", (error) => {
  console.error("WebSocket connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from WebSocket server:", reason);
});

export const setSocketUserId = (userId: string) => {
  currentUserId = userId;
  if (socket.connected) {
    socket.emit("join_user_room", userId);
  }
};

export default socket;

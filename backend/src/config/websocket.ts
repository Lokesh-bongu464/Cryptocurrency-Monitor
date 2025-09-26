import { Server as SocketIOServer } from "socket.io";

export const setupWebSocket = (io: SocketIOServer) => {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join_user_room", (userId: string) => {
      // Join the user's room for notifications
      socket.join(userId);
      console.log(`User ${userId} joined their notification room`);
    });

    socket.on("subscribe_coins", (coins: string[]) => {
      console.log(`Client ${socket.id} subscribing to coins:`, coins);
      socket.join(coins);
    });

    socket.on("unsubscribe_coins", (coins: string[]) => {
      console.log(`Client ${socket.id} unsubscribing from coins:`, coins);
      coins.forEach((coin) => socket.leave(coin));
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

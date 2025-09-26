import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../services/websocket";
import { updatePrice } from "../features/cryptocurrencies/cryptoSlice";

interface PriceUpdate {
  coinId: string;
  price: number;
  priceChange24h?: number;
}

interface AlertNotification {
  alertId: string;
  message: string;
  triggeredAt: string;
}

export const WebSocketManager: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("price_update", (data: PriceUpdate) => {
      dispatch(
        updatePrice({
          coinId: data.coinId,
          price: data.price,
          priceChange24h: data.priceChange24h,
        })
      );
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server:", reason);
    });

    return () => {
      socket.off("price_update");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, [dispatch]);

  return null;
};

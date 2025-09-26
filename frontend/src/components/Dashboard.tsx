import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import CryptoList from "./CryptoList";
import AlertForm from "./AlertForm";
import AlertList from "./AlertList";
import { socket } from "../services/websocket";
import { updatePrice } from "../features/cryptocurrencies/cryptoSlice";
import { playNotificationSound } from "../utils/sound";
import { getCoinName } from "../config/coins";

interface DashboardProps {
  userId: string;
}

interface Notification {
  id: number;
  message: string;
  type: "success" | "warning" | "error";
  title: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const coinsToDisplay = useMemo(
    () => [
      "bitcoin",
      "ethereum",
      "ripple",
      "cardano",
      "dogecoin",
      "polkadot",
      "solana",
      "binancecoin",
      "litecoin",
    ],
    []
  );
  const [prices, setPrices] = useState<
    Record<string, { currentPrice: number; priceChange24h?: number }>
  >({});
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "error"
  >("disconnected");
  useEffect(() => {
    // Subscribe to all coins for price updates and join user's room
    socket.emit("subscribe_coins", coinsToDisplay);
    socket.emit("join_user_room", userId);

    socket.on("connect", () => {
      setConnectionStatus("connected");
      // Resubscribe to coins and rejoin user's room after reconnection
      socket.emit("subscribe_coins", coinsToDisplay);
      socket.emit("join_user_room", userId);
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socket.on("connect_error", () => {
      setConnectionStatus("error");
    });

    socket.on(
      "price_update",
      (data: {
        coinId: string;
        currentPrice: number;
        priceChange24h?: number;
      }) => {
        dispatch(
          updatePrice({ coinId: data.coinId, price: data.currentPrice })
        );
        setPrices((prev) => ({
          ...prev,
          [data.coinId]: {
            currentPrice: data.currentPrice,
            priceChange24h: data.priceChange24h,
          },
        }));
      }
    );

    socket.on(
      "alertTriggered",
      (data: {
        alertId: string;
        coinId: string;
        condition: string;
        threshold: number;
        currentPrice: number;
      }) => {
        const coinName = getCoinName(data.coinId);
        const message = `${coinName} price is now ${data.condition} $${data.threshold}. Current price: $${data.currentPrice.toFixed(2)}`;
        const newNotification = {
          id: Date.now(),
          message,
          type: "warning" as const,
          title: "Price Alert Triggered",
        };

        playNotificationSound();
        setNotifications((prev) => [...prev, newNotification]);
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== newNotification.id)
          );
        }, 8000);
      }
    );

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("price_update");
      socket.off("alert_triggered");
      socket.emit("unsubscribe_coins", coinsToDisplay);
    };
  }, [dispatch, coinsToDisplay, userId]);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-gray-100 font-inter">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-blue-400">
          Crypto Monitor
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Real-time prices and custom alerts
        </p>
      </header>

      <section className="bg-gray-800 p-6 rounded-2xl shadow-xl mb-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-200">Live Prices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coinsToDisplay.map((coinId: string) => (
            <CryptoList
              key={coinId}
              coinId={coinId}
              price={prices[coinId]?.currentPrice}
              priceChange24h={prices[coinId]?.priceChange24h}
            />
          ))}
        </div>
      </section>

      <section className="bg-gray-800 p-6 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-200">
          Alert Management
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertForm />
          <AlertList />
        </div>
      </section>

      {/* Notification Area */}
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:items-start sm:p-6"
      >
        <div className="flex flex-col items-center space-y-4 w-full sm:items-end">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="max-w-sm w-full bg-gray-800 shadow-2xl rounded-lg pointer-events-auto ring-1 ring-yellow-500 ring-opacity-50 overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105"
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center animate-pulse">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-900"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-yellow-500">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-300">
                      {notification.message}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.filter((n) => n.id !== notification.id)
                      );
                    }}
                    className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300 focus:outline-none"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

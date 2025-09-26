import React from "react";
import { getCoinName } from "../config/coins";

interface CryptoListProps {
  coinId: string;
  price?: number;
  priceChange24h?: number;
}

const CryptoList: React.FC<CryptoListProps> = ({
  coinId,
  price,
  priceChange24h,
}) => {
  const formatPrice = (price?: number) => {
    if (price === undefined) return "Loading...";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all duration-200">
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {coinId.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-100">{getCoinName(coinId)}</h3>
            <p className="text-sm text-gray-400">{coinId.toUpperCase()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-100">{formatPrice(price)}</p>
          <p
            className={`text-sm ${
              priceChange24h && priceChange24h > 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {priceChange24h ? (priceChange24h > 0 ? "▲" : "▼") : ""}{" "}
            {priceChange24h ? `${Math.abs(priceChange24h).toFixed(2)}%` : "--"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CryptoList;

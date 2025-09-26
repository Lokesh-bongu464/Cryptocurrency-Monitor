import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createAlert } from "../api/alertApi";
import { addAlert } from "../features/alerts/alertsSlice";
import { coins } from "../config/coins";

const AlertForm: React.FC = () => {
  const [coinId, setCoinId] = useState("bitcoin");
  const [threshold, setThreshold] = useState("");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!threshold || isNaN(Number(threshold)) || Number(threshold) <= 0) {
      setError("Please enter a valid positive number for the threshold");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const newAlert = await createAlert({
        coinId,
        threshold: Number(threshold),
        condition,
        isTriggered: false,
        userId: "test-user", // Using a mock user ID
      });

      dispatch(addAlert(newAlert));
      setThreshold("");
    } catch (err) {
      setError("Failed to create alert. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-700 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-100">
        Create New Alert
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="coin"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Cryptocurrency
          </label>
          <select
            id="coin"
            value={coinId}
            onChange={(e) => setCoinId(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.id.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Alert when price is
          </label>
          <div className="flex space-x-2">
            <select
              id="condition"
              value={condition}
              onChange={(e) =>
                setCondition(e.target.value as "above" | "below")
              }
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } transition-colors`}
        >
          {isSubmitting ? "Creating..." : "Create Alert"}
        </button>
      </form>
    </div>
  );
};

export default AlertForm;

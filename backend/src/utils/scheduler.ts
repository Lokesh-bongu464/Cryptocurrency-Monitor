import cron from "node-cron";
import { Server as SocketIOServer } from "socket.io";
import { getCryptoPrices } from "../services/coingecko";
import { setBatchPricesInCache } from "../services/cache";
import Alert from "../models/Alert";
import { logger } from "./logger";

interface PriceData {
  usd: number;
  usd_24h_change?: number;
  last_updated_at?: number;
}

const coinsToMonitor = [
  "bitcoin",
  "ethereum",
  "ripple",
  "cardano",
  "dogecoin",
  "polkadot",
  "solana",
  "binancecoin",
  "litecoin",
];

/**
 * Checks alerts for a specific cryptocurrency and notifies users if conditions are met
 */
const checkAlertsForCoin = async (
  coinId: string,
  currentPrice: number,
  io: SocketIOServer
) => {
  try {
    // Get all non-triggered alerts for this coin
    const alerts = await Alert.find({
      coinId,
      isTriggered: false,
    });

    for (const alert of alerts) {
      const isTriggered =
        alert.condition === "above"
          ? currentPrice > alert.threshold
          : currentPrice < alert.threshold;

      if (isTriggered) {
        // Update alert status
        alert.isTriggered = true;
        alert.lastTriggered = new Date();
        await alert.save();

        // Send notification to specific user
        io.to(alert.userId).emit("alertTriggered", {
          alertId: alert._id,
          coinId: alert.coinId,
          condition: alert.condition,
          threshold: alert.threshold,
          currentPrice,
          triggeredAt: alert.lastTriggered,
        });

        logger.info(
          `Alert triggered for ${coinId}: ${alert.condition} ${alert.threshold}`
        );
      }
    }
  } catch (error) {
    logger.error("Error checking alerts:", error);
  }
};

export const startPriceScheduler = (io: SocketIOServer) => {
  // Run every 30 seconds to avoid hitting API rate limits
  cron.schedule("*/30 * * * * *", async () => {
    try {
      const prices = await getCryptoPrices(coinsToMonitor);
      if (!prices) {
        console.error("Failed to fetch prices from CoinGecko");
        return;
      }

      // Prepare batch price updates
      const priceUpdates: Record<
        string,
        {
          price: number;
          change24h?: number;
          lastUpdated?: number;
        }
      > = {};

      // Process each coin's price data and check alerts
      for (const [coinId, priceData] of Object.entries(prices)) {
        const data = priceData as PriceData;

        priceUpdates[coinId] = {
          price: data.usd,
          change24h: data.usd_24h_change,
          lastUpdated: data.last_updated_at,
        };

        // Emit real-time price update to all clients
        io.emit("price_update", {
          coinId,
          currentPrice: data.usd,
          priceChange24h: data.usd_24h_change || 0,
        });

        // Check alerts for this coin
        await checkAlertsForCoin(coinId, data.usd, io);
      }

      // Batch update the cache with all price updates
      await setBatchPricesInCache(priceUpdates);
    } catch (error) {
      logger.error("Scheduler failed:", error);
    }
  });
};

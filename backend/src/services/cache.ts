import { redisClient } from "../config/redis";

const CACHE_KEY_PREFIX = "crypto:price:";
const HISTORY_KEY_PREFIX = "crypto:price:history:";
const CACHE_EXPIRATION_SECONDS = 60; // Cache data for 60 seconds
const HISTORY_RETENTION_HOURS = 24; // Keep 24 hours of historical data

interface PriceData {
  price: number;
  change24h?: number;
  lastUpdated?: number;
}

/**
 * Stores multiple cryptocurrency prices in Redis using a pipeline.
 * @param prices Record of coin IDs to their price data
 */
export const setBatchPricesInCache = async (
  prices: Record<string, PriceData>
): Promise<void> => {
  const pipeline = redisClient.pipeline();
  const timestamp = Date.now();

  for (const [coinId, data] of Object.entries(prices)) {
    const priceKey = `${CACHE_KEY_PREFIX}${coinId}`;
    const historyKey = `${HISTORY_KEY_PREFIX}${coinId}`;

    // Store current price with expiration
    pipeline.hset(priceKey, {
      price: data.price.toString(),
      change24h: data.change24h?.toString() || "0",
      lastUpdated: data.lastUpdated?.toString() || timestamp.toString(),
    });
    pipeline.expire(priceKey, CACHE_EXPIRATION_SECONDS);

    // Store in historical data
    pipeline.zadd(
      historyKey,
      timestamp,
      JSON.stringify({
        price: data.price,
        timestamp,
      })
    );

    // Remove old historical data (older than HISTORY_RETENTION_HOURS)
    const oldestAllowedTime = timestamp - HISTORY_RETENTION_HOURS * 3600 * 1000;
    pipeline.zremrangebyscore(historyKey, 0, oldestAllowedTime);
  }

  await pipeline.exec();
};

/**
 * Retrieves current price data for a cryptocurrency.
 * @param coinId The ID of the cryptocurrency
 * @returns The cached price data, or null if not found
 */
export const getCachedPrice = async (
  coinId: string
): Promise<PriceData | null> => {
  const key = `${CACHE_KEY_PREFIX}${coinId}`;
  const data = await redisClient.hgetall(key);

  if (!data || !data.price) {
    return null;
  }

  return {
    price: parseFloat(data.price),
    change24h: data.change24h ? parseFloat(data.change24h) : undefined,
    lastUpdated: data.lastUpdated ? parseInt(data.lastUpdated) : undefined,
  };
};

/**
 * Retrieves historical price data for a cryptocurrency.
 * @param coinId The ID of the cryptocurrency
 * @param hours Number of hours of history to retrieve (max 24)
 */
export const getPriceHistory = async (
  coinId: string,
  hours: number = 24
): Promise<Array<{ price: number; timestamp: number }>> => {
  const key = `${HISTORY_KEY_PREFIX}${coinId}`;
  const minTime =
    Date.now() - Math.min(hours, HISTORY_RETENTION_HOURS) * 3600 * 1000;

  const data = await redisClient.zrangebyscore(key, minTime, "+inf");
  return data.map((item) => JSON.parse(item));
};

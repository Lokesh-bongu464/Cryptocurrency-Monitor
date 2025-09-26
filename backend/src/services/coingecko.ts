import axios, { AxiosError } from "axios";
import { sleep } from "../utils/helpers";

const API_KEY = process.env.COINGECKO_API_KEY;
const API_BASE_URL = "https://api.coingecko.com/api/v3";
const PRO_API_BASE_URL = "https://pro-api.coingecko.com/api/v3";

interface CoinGeckoResponse {
  [key: string]: {
    usd: number;
    usd_24h_change?: number;
    last_updated_at?: number;
  };
}

/**
 * Fetches the current price and 24h change of one or more cryptocurrencies.
 * @param coinIds - An array of cryptocurrency IDs (e.g., ['bitcoin', 'ethereum']).
 * @param retryCount - Number of retries attempted (internal use).
 * @returns A promise that resolves to the price data.
 */
export const getCryptoPrices = async (
  coinIds: string[],
  retryCount = 0
): Promise<CoinGeckoResponse | null> => {
  const maxRetries = 3;
  const baseUrl = API_KEY ? PRO_API_BASE_URL : API_BASE_URL;

  try {
    const ids = coinIds.join(",");
    const url = `${baseUrl}/simple/price?ids=${ids}&vs_currencies=usd&include_24h_vol=true&include_24h_change=true&include_last_updated_at=true`;

    const headers = API_KEY ? { "X-CG-Pro-API-Key": API_KEY } : {};
    const response = await axios.get<CoinGeckoResponse>(url, { headers });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 429) {
      // Rate limit hit - implement exponential backoff
      if (retryCount < maxRetries) {
        const delayMs = Math.pow(2, retryCount) * 1000;
        console.warn(`Rate limit hit, retrying in ${delayMs}ms...`);
        await sleep(delayMs);
        return getCryptoPrices(coinIds, retryCount + 1);
      }
    }

    console.error("Error fetching prices from CoinGecko API:", {
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      message: axiosError.message,
    });

    return null;
  }
};

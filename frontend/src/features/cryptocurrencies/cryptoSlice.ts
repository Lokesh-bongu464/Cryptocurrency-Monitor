import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface PriceData {
  price: number;
  priceChange24h?: number;
  lastUpdated?: number;
}

interface CryptoState {
  prices: {
    [coinId: string]: PriceData;
  };
  loading: boolean;
  error: string | null;
}

interface UpdatePricePayload {
  coinId: string;
  price: number;
  priceChange24h?: number;
}

const initialState: CryptoState = {
  prices: {},
  loading: false,
  error: null,
};

const cryptoSlice = createSlice({
  name: "cryptocurrencies",
  initialState,
  reducers: {
    updatePrice: (state, action: PayloadAction<UpdatePricePayload>) => {
      const { coinId, price, priceChange24h } = action.payload;
      state.prices[coinId] = {
        price,
        priceChange24h,
        lastUpdated: Date.now(),
      };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { updatePrice, setLoading, setError } = cryptoSlice.actions;

export const selectCryptoPrices = (state: RootState) =>
  state.cryptocurrencies.prices;
export const selectCryptoLoading = (state: RootState) =>
  state.cryptocurrencies.loading;
export const selectCryptoError = (state: RootState) =>
  state.cryptocurrencies.error;

export default cryptoSlice.reducer;

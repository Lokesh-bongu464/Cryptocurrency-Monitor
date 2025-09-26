import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './cryptocurrencies/cryptoSlice';
import alertsReducer from './alerts/alertsSlice';

export const store = configureStore({
  reducer: {
    cryptocurrencies: cryptoReducer,
    alerts: alertsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

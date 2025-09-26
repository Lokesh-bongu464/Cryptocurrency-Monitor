import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface Alert {
  _id: string;
  coinId: string;
  threshold: number;
  condition: "above" | "below";
  isTriggered: boolean;
  lastTriggered?: Date;
}

interface AlertsState {
  activeAlerts: Alert[];
  loading: boolean;
  error: string | null;
}

const initialState: AlertsState = {
  activeAlerts: [],
  loading: false,
  error: null,
};

export interface TriggerAlertPayload {
  alertId: string;
  triggeredAt: Date;
}

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.activeAlerts = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.activeAlerts.push(action.payload);
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.activeAlerts = state.activeAlerts.filter(
        (alert) => alert._id !== action.payload
      );
    },
    triggerAlert: (state, action: PayloadAction<TriggerAlertPayload>) => {
      const alert = state.activeAlerts.find(
        (a) => a._id === action.payload.alertId
      );
      if (alert) {
        alert.isTriggered = true;
        alert.lastTriggered = action.payload.triggeredAt;
      }
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

export const {
  setAlerts,
  addAlert,
  removeAlert,
  setError,
  setLoading,
  triggerAlert,
} = alertsSlice.actions;
export default alertsSlice.reducer;

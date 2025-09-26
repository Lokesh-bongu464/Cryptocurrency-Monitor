import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export interface Alert {
  _id: string;
  userId: string;
  coinId: string;
  threshold: number;
  condition: "above" | "below";
  isTriggered: boolean;
  lastTriggered?: Date;
}

/**
 * Fetches all active alerts from the backend.
 */
export const getAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alerts`, {
      params: { userId: "test-user" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
};

/**
 * Creates a new alert.
 * @param alertData - The alert data to be sent.
 */
export const createAlert = async (
  alertData: Omit<Alert, "_id">
): Promise<Alert> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/alerts`, alertData);
    return response.data;
  } catch (error) {
    console.error("Error creating alert:", error);
    throw error;
  }
};

/**
 * Deletes an alert by its ID.
 * @param id - The ID of the alert to delete.
 */
export const deleteAlert = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/alerts/${id}`, {
      params: { userId: "test-user" },
    });
  } catch (error) {
    console.error("Error deleting alert:", error);
    throw error;
  }
};

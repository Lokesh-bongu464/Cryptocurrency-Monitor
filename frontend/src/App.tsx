import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAlerts, setError } from "./features/alerts/alertsSlice";
import Dashboard from "./components/Dashboard";
import { WebSocketManager } from "./components/WebSocketManager";
import { getAlerts } from "./api/alertApi";

// In a real application, this would come from your authentication system
const MOCK_USER_ID = "test-user";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const alerts = await getAlerts();
        dispatch(setAlerts(alerts));
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
        dispatch(
          setError(
            err instanceof Error ? err.message : "Failed to fetch alerts"
          )
        );
      }
    };
    fetchAlerts();
  }, [dispatch]);

  return (
    <>
      <WebSocketManager />
      <div className="container mx-auto px-4 py-8">
        <Dashboard userId={MOCK_USER_ID} />
      </div>
    </>
  );
};

export default App;

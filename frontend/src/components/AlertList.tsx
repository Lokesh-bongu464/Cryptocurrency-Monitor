import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAlert } from '../api/alertApi';
import { removeAlert } from '../features/alerts/alertsSlice';
import { RootState } from '../features/store';

const AlertList: React.FC = () => {
  const dispatch = useDispatch();
  const alerts = useSelector((state: RootState) => state.alerts.activeAlerts);

  const handleDelete = async (id: string) => {
    try {
      await deleteAlert(id);
      dispatch(removeAlert(id));
    } catch (error) {
      console.error('Failed to delete alert:', error);
    }
  };

  const getCoinName = (id: string) => {
    const names: { [key: string]: string } = {
      bitcoin: 'Bitcoin',
      ethereum: 'Ethereum',
      ripple: 'Ripple',
      litecoin: 'Litecoin',
      cardano: 'Cardano',
    };
    return names[id] || id.charAt(0).toUpperCase() + id.slice(1);
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-gray-700 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-100">Active Alerts</h3>
        <p className="text-gray-400">No active alerts. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-100">Active Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert._id} 
            className="flex items-center justify-between p-3 bg-gray-800 rounded-md hover:bg-gray-750 transition-colors"
          >
            <div>
              <p className="font-medium text-gray-100">
                {getCoinName(alert.coinId)} {alert.condition === 'above' ? '>' : '<'} ${alert.threshold.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">
                {alert.condition === 'above' ? 'Above' : 'Below'} ${alert.threshold.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => handleDelete(alert._id)}
              className="p-1.5 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Delete alert"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertList;

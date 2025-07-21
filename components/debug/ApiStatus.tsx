'use client';

import { useState, useEffect } from 'react';
import { checkApiHealth, buildApiUrl } from '@/lib/api-config';

export default function ApiStatus() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApi = async () => {
    setApiStatus('checking');
    const isOnline = await checkApiHealth();
    setApiStatus(isOnline ? 'online' : 'offline');
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkApi();
  }, []);

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      case 'checking':
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'online':
        return 'API en ligne';
      case 'offline':
        return 'API hors ligne';
      case 'checking':
        return 'Vérification...';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg border">
      <div className="flex items-center space-x-2">
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
        <button
          onClick={checkApi}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Actualiser
        </button>
      </div>
      {lastCheck && (
        <div className="text-xs text-gray-500 mt-1">
          Dernière vérification: {lastCheck.toLocaleTimeString()}
        </div>
      )}
      <div className="text-xs text-gray-500 mt-1">
        URL: {buildApiUrl('/health')}
      </div>
    </div>
  );
} 
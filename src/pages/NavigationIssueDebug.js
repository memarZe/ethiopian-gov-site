import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigationIssueDebug = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [navigationCount, setNavigationCount] = useState(0);
  const [navigationHistory, setNavigationHistory] = useState([]);

  useEffect(() => {
    const newEntry = {
      pathname: location.pathname,
      timestamp: new Date().toISOString(),
      count: navigationCount + 1
    };
    
    setNavigationHistory(prev => [...prev, newEntry]);
    setNavigationCount(prev => prev + 1);
    
    console.log('🔍 Navigation Debug - Route changed to:', location.pathname);
    console.log('🔍 Navigation count:', navigationCount + 1);
    
  }, [location.pathname]);

  const testNavigationSequence = () => {
    const paths = ['/services', '/users', '/ministries', '/regions', '/news'];
    
    paths.forEach((path, index) => {
      setTimeout(() => {
        console.log(`🔄 Attempting navigation ${index + 1} to:`, path);
        navigate(path);
      }, (index + 1) * 1000);
    });
  };

  const resetTest = () => {
    setNavigationHistory([]);
    setNavigationCount(0);
    navigate('/');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Navigation Issue Debug</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Status</h2>
        <div className="space-y-2">
          <p><strong>Current Path:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code></p>
          <p><strong>Navigation Count:</strong> <span className="font-mono">{navigationCount}</span></p>
          <p><strong>Browser URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{window.location.pathname}</code></p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        <div className="space-x-4">
          <button
            onClick={testNavigationSequence}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🤖 Test Sequential Navigation
          </button>
          <button
            onClick={() => navigate('/services')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Go to Services
          </button>
          <button
            onClick={() => navigate('/ministries')}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go to Ministries
          </button>
          <button
            onClick={resetTest}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reset Test
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Navigation History</h2>
        <div className="max-h-96 overflow-y-auto">
          {navigationHistory.length === 0 ? (
            <p className="text-gray-500 italic">No navigation history yet...</p>
          ) : (
            <div className="space-y-2">
              {navigationHistory.map((entry, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="text-blue-600">#{entry.count}</strong>
                      <code className="ml-2 bg-gray-200 px-2 py-1 rounded text-sm">{entry.pathname}</code>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationIssueDebug;

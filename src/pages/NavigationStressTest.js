import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigationStressTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [testLog, setTestLog] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testCount, setTestCount] = useState(0);

  const testRoutes = [
    '/',
    '/services',
    '/users',
    '/ministries', 
    '/regions',
    '/news',
    '/about',
    '/services',
    '/ministries',
    '/users',
    '/regions',
    '/news',
    '/',
    '/about'
  ];

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLog(prev => [...prev, { timestamp, message, type, count: prev.length + 1 }]);
  };

  const runStressTest = async () => {
    setIsRunning(true);
    setTestLog([]);
    setTestCount(0);
    
    addLog('🚀 Starting navigation stress test...', 'info');
    
    for (let i = 0; i < testRoutes.length; i++) {
      const route = testRoutes[i];
      const currentRoute = location.pathname;
      
      addLog(`🔄 Navigation ${i + 1}/${testRoutes.length}: ${currentRoute} → ${route}`, 'info');
      
      try {
        navigate(route);
        setTestCount(i + 1);
        
        // Wait for navigation
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if navigation was successful
        const newRoute = window.location.pathname;
        if (newRoute === route) {
          addLog(`✅ Success: Reached ${route}`, 'success');
        } else {
          addLog(`❌ Failed: Expected ${route}, got ${newRoute}`, 'error');
        }
        
      } catch (error) {
        addLog(`❌ Error: ${error.message}`, 'error');
      }
    }
    
    setIsRunning(false);
    addLog('🏁 Stress test completed!', 'success');
  };

  const quickNavTest = (route) => {
    const from = location.pathname;
    addLog(`🚀 Quick nav: ${from} → ${route}`, 'info');
    navigate(route);
  };

  useEffect(() => {
    addLog(`📍 Route changed to: ${location.pathname}`, 'info');
  }, [location.pathname]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Navigation Stress Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <strong>Current Route:</strong>
              <code className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {location.pathname}
              </code>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong>Test Progress:</strong>
              <span className="ml-2">
                {testCount}/{testRoutes.length} navigations
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong>Status:</strong>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                isRunning ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {isRunning ? '⏳ Running...' : '✅ Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="space-y-3">
            <button
              onClick={runStressTest}
              disabled={isRunning}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isRunning ? '⏳ Running Stress Test...' : '🚨 Run Stress Test'}
            </button>
            
            <div className="border-t pt-3">
              <strong className="text-sm text-gray-600">Quick Navigation Tests:</strong>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['/services', '/users', '/ministries', '/regions', '/news', '/about'].map(route => (
                  <button
                    key={route}
                    onClick={() => quickNavTest(route)}
                    disabled={isRunning}
                    className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-sm disabled:opacity-50"
                  >
                    {route.replace('/', '') || 'Home'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setTestLog([]);
                setTestCount(0);
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              🗑️ Clear Log
            </button>
          </div>
        </div>
      </div>

      {/* Test Sequence Display */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Sequence</h2>
        <div className="text-sm text-gray-600 mb-3">
          This test will navigate through these routes in sequence:
        </div>
        <div className="flex flex-wrap gap-2">
          {testRoutes.map((route, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded text-xs ${
                index < testCount 
                  ? 'bg-green-100 text-green-800' 
                  : index === testCount && isRunning
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {index + 1}. {route || '/'}
            </span>
          ))}
        </div>
      </div>

      {/* Test Log */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Log</h2>
        <div className="max-h-96 overflow-y-auto border rounded p-3 bg-gray-50">
          {testLog.length === 0 ? (
            <p className="text-gray-500 italic">No test logs yet...</p>
          ) : (
            testLog.map((entry, index) => (
              <div key={index} className={`mb-2 p-2 rounded text-sm ${
                entry.type === 'success' ? 'bg-green-100 text-green-800' :
                entry.type === 'error' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                <span className="font-mono text-xs text-gray-600">
                  [{entry.count}] [{entry.timestamp}]
                </span>
                <span className="ml-2">{entry.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationStressTest;

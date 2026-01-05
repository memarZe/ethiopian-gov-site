import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const NavigationDebugTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [navigationLog, setNavigationLog] = useState([]);
  const [testResults, setTestResults] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setNavigationLog(prev => [...prev, { timestamp, message, type }]);
  };

  const addResult = (test, result, success = true) => {
    setTestResults(prev => [...prev, {
      test,
      result,
      success,
      timestamp: new Date().toISOString()
    }]);
  };

  const testPages = [
    { name: 'Home', path: '/', description: 'Main landing page' },
    { name: 'Services', path: '/services', description: 'Government services page' },
    { name: 'Users', path: '/users', description: 'Users management page' },
    { name: 'Ministries', path: '/ministries', description: 'Government ministries page' },
    { name: 'Regions', path: '/regions', description: 'Ethiopian regions page' },
    { name: 'News', path: '/news', description: 'Government news page' },
    { name: 'About', path: '/about', description: 'About Ethiopia page' },
    { name: 'Login', path: '/login', description: 'User authentication page' },
  ];

  const testNavigationSequence = async () => {
    addLog('🚀 Starting navigation sequence test', 'info');
    addResult('Navigation Test', 'Starting automated navigation sequence', true);

    for (let i = 0; i < testPages.length; i++) {
      const page = testPages[i];
      addLog(`🔄 Testing navigation to: ${page.name}`, 'info');
      
      try {
        navigate(page.path);
        
        // Wait for navigation to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if we're on the correct page
        const currentPath = window.location.pathname;
        if (currentPath === page.path) {
          addLog(`✅ Successfully navigated to ${page.name}`, 'success');
          addResult(
            `Navigation to ${page.name}`,
            `Successfully navigated from ${location.pathname} to ${page.path}`,
            true
          );
        } else {
          addLog(`❌ Navigation to ${page.name} failed. Expected: ${page.path}, Got: ${currentPath}`, 'error');
          addResult(
            `Navigation to ${page.name}`,
            `Navigation failed. Expected: ${page.path}, Got: ${currentPath}`,
            false
          );
        }
      } catch (error) {
        addLog(`❌ Error navigating to ${page.name}: ${error.message}`, 'error');
        addResult(
          `Navigation to ${page.name}`,
          `Error: ${error.message}`,
          false
        );
      }
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    addLog('🏁 Navigation sequence test completed', 'success');
    addResult('Navigation Test', 'Automated navigation sequence completed', true);
  };

  const testSingleNavigation = (page) => {
    addLog(`🔄 Testing single navigation to: ${page.name}`, 'info');
    const currentPath = location.pathname;
    
    try {
      navigate(page.path);
      addLog(`📍 Initiated navigation from ${currentPath} to ${page.path}`, 'info');
    } catch (error) {
      addLog(`❌ Error in single navigation: ${error.message}`, 'error');
    }
  };

  const clearLogs = () => {
    setNavigationLog([]);
    setTestResults([]);
  };

  useEffect(() => {
    addLog(`📍 Component mounted on route: ${location.pathname}`, 'info');
  }, []);

  useEffect(() => {
    addLog(`🔄 Route changed to: ${location.pathname}`, 'info');
  }, [location.pathname]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Navigation Debug Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current State */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <strong>Current Route:</strong>
              <div className="mt-1 font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {location.pathname}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong>Browser URL:</strong>
              <div className="mt-1 font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded break-all">
                {window.location.href}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong>Match:</strong>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                location.pathname === window.location.pathname 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {location.pathname === window.location.pathname ? '✅ Match' : '❌ Mismatch'}
              </span>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="space-y-3">
            <button
              onClick={testNavigationSequence}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🤖 Run Automated Test
            </button>
            <button
              onClick={clearLogs}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              🗑️ Clear Logs
            </button>
            <div className="pt-2 border-t">
              <strong className="text-sm text-gray-600">Quick Navigation Tests:</strong>
              <div className="mt-2 space-y-1">
                {testPages.slice(0, 4).map((page, index) => (
                  <button
                    key={index}
                    onClick={() => testSingleNavigation(page)}
                    className="block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  >
                    {page.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Link Navigation Tests */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Link Navigation Tests</h2>
          <p className="text-sm text-gray-600 mb-4">
            Test navigation using React Router Link components:
          </p>
          <div className="space-y-2">
            {testPages.map((page, index) => (
              <Link
                key={index}
                to={page.path}
                className="block px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded text-blue-700 hover:text-blue-800 no-underline text-sm"
              >
                🔗 {page.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Page Information */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Available Pages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testPages.map((page, index) => (
            <div key={index} className="border rounded p-3">
              <div className="font-semibold text-blue-600">{page.name}</div>
              <div className="text-xs text-gray-500 font-mono mb-2">{page.path}</div>
              <div className="text-sm text-gray-600">{page.description}</div>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  location.pathname === page.path 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {location.pathname === page.path ? 'Current' : 'Available'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Log */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Navigation Log</h2>
        <div className="max-h-96 overflow-y-auto border rounded p-3 bg-gray-50">
          {navigationLog.length === 0 ? (
            <p className="text-gray-500 italic">No navigation logs yet...</p>
          ) : (
            navigationLog.map((entry, index) => (
              <div key={index} className={`mb-2 p-2 rounded text-sm ${
                entry.type === 'success' ? 'bg-green-100 text-green-800' :
                entry.type === 'error' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                <span className="font-mono text-xs text-gray-600">[{entry.timestamp}]</span>
                <span className="ml-2">{entry.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Test Results */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <div className="max-h-96 overflow-y-auto space-y-3">
          {testResults.length === 0 ? (
            <p className="text-gray-500 italic">No test results yet...</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className={`p-3 rounded border-l-4 ${
                result.success 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm">
                      {result.success ? '✅' : '❌'} {result.test}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.success ? 'PASS' : 'FAIL'}
                  </div>
                </div>
                <div className="mt-2 text-sm">{result.result}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationDebugTest;

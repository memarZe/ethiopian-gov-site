import React, { useEffect, useState } from 'react';

const LocalStorageDebugTest = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState([]);

  const addResult = (test, result, success = true) => {
    setTestResults(prev => [...prev, {
      test,
      result,
      success,
      timestamp: new Date().toISOString()
    }]);
  };

  const testLocalStorageBasic = () => {
    try {
      // Test basic localStorage functionality
      localStorage.setItem('test-key', 'test-value');
      const retrieved = localStorage.getItem('test-key');
      localStorage.removeItem('test-key');
      
      addResult(
        'Basic localStorage test',
        `Set: test-value, Retrieved: ${retrieved}`,
        retrieved === 'test-value'
      );
    } catch (error) {
      addResult('Basic localStorage test', `Error: ${error.message}`, false);
    }
  };

  const testLanguageStorage = () => {
    try {
      // Test language storage specifically
      const testLangs = ['am', 'en'];
      
      testLangs.forEach(lang => {
        localStorage.setItem('selectedLanguage', lang);
        const retrieved = localStorage.getItem('selectedLanguage');
        
        addResult(
          `Language storage test (${lang})`,
          `Set: ${lang}, Retrieved: ${retrieved}`,
          retrieved === lang
        );
      });
    } catch (error) {
      addResult('Language storage test', `Error: ${error.message}`, false);
    }
  };

  const checkAllStorageItems = () => {
    try {
      const items = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        items[key] = localStorage.getItem(key);
      }
      
      addResult(
        'All localStorage items',
        JSON.stringify(items, null, 2),
        true
      );
    } catch (error) {
      addResult('All localStorage items', `Error: ${error.message}`, false);
    }
  };

  const testStorageEvents = () => {
    // Set up storage event listener
    const handleStorageChange = (e) => {
      addResult(
        'Storage event detected',
        `Key: ${e.key}, Old: ${e.oldValue}, New: ${e.newValue}`,
        true
      );
    };

    window.addEventListener('storage', handleStorageChange);

    // Test storage event
    localStorage.setItem('selectedLanguage', 'test-event');
    
    // Clean up
    setTimeout(() => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.removeItem('selectedLanguage');
    }, 1000);
  };

  const checkBrowserInfo = () => {
    const info = {
      userAgent: navigator.userAgent,
      cookieEnabled: navigator.cookieEnabled,
      localStorage: typeof Storage !== "undefined",
      sessionStorage: typeof sessionStorage !== "undefined",
      location: window.location.href
    };
    
    setDebugInfo(info);
    addResult('Browser info collected', 'See debug info panel', true);
  };

  useEffect(() => {
    checkBrowserInfo();
    testLocalStorageBasic();
    testLanguageStorage();
    checkAllStorageItems();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">localStorage Debug Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Controls */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="space-y-3">
            <button
              onClick={testLocalStorageBasic}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Basic localStorage
            </button>
            <button
              onClick={testLanguageStorage}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test Language Storage
            </button>
            <button
              onClick={checkAllStorageItems}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Check All Storage Items
            </button>
            <button
              onClick={testStorageEvents}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Test Storage Events
            </button>
            <button
              onClick={checkBrowserInfo}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Refresh Browser Info
            </button>
            <button
              onClick={() => setTestResults([])}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Browser Debug Info</h2>
          <div className="space-y-2 text-sm">
            {Object.entries(debugInfo).map(([key, value]) => (
              <div key={key} className="p-2 bg-gray-50 rounded">
                <strong className="text-blue-600">{key}:</strong>
                <div className="ml-4 font-mono text-xs break-all">
                  {typeof value === 'boolean' ? (value ? '✅ true' : '❌ false') : String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <div className="max-h-96 overflow-y-auto space-y-2">
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
                  <div className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.success ? 'PASS' : 'FAIL'}
                  </div>
                </div>
                <div className="mt-2 text-sm font-mono bg-gray-100 p-2 rounded">
                  {result.result}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LocalStorageDebugTest;

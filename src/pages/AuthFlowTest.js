import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthFlowTest = () => {
  const [testResults, setTestResults] = useState([]);
  const { user, isAuthenticated, loading, hasRole, login } = useAuth();

  const addLog = (message, data = null) => {
    const timestamp = new Date().toISOString();
    setTestResults(prev => [...prev, { timestamp, message, data }]);
    console.log(`[${timestamp}] ${message}`, data);
  };

  useEffect(() => {
    addLog('Component mounted, initial auth state:', {
      loading,
      isAuthenticated,
      user: user ? { username: user.username, role: user.role } : null
    });
  }, []);

  useEffect(() => {
    addLog('Auth state changed:', {
      loading,
      isAuthenticated,
      user: user ? { username: user.username, role: user.role } : null,
      hasAdminRole: user ? hasRole(['ADMIN']) : 'NO_USER',
      hasEditorRole: user ? hasRole(['ADMIN', 'EDITOR']) : 'NO_USER'
    });
  }, [loading, isAuthenticated, user, hasRole]);

  const performLogin = async () => {
    addLog('Starting login process...');
    try {
      const result = await login({ username: 'admin', password: 'admin123' });
      addLog('Login result:', result);
    } catch (error) {
      addLog('Login error:', error.message);
    }
  };

  const checkLocalStorage = () => {
    addLog('LocalStorage check:', {
      token: localStorage.getItem('authToken')?.substring(0, 30) + '...',
      userData: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null
    });
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    addLog('Cleared authentication data');
    window.location.reload();
  };

  const testNavigation = () => {
    addLog('Testing navigation to /users/add...');
    // Store current state for comparison
    addLog('Pre-navigation auth state:', {
      loading,
      isAuthenticated,
      user: user ? { username: user.username, role: user.role } : null,
      localStorage: {
        token: !!localStorage.getItem('authToken'),
        userData: !!localStorage.getItem('userData')
      }
    });
    
    // Navigate after a short delay to see state
    setTimeout(() => {
      window.location.href = '/users/add';
    }, 1000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Authentication Flow Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Current State Display */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="space-y-2 text-sm">
            <div>Loading: <span className={`font-semibold ${loading ? 'text-yellow-600' : 'text-green-600'}`}>{loading.toString()}</span></div>
            <div>Authenticated: <span className={`font-semibold ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>{isAuthenticated.toString()}</span></div>
            <div>User: <span className="font-mono text-xs">{user ? `${user.username} (${user.role})` : 'null'}</span></div>
            <div>Has Admin Role: <span className={`font-semibold ${user && hasRole(['ADMIN']) ? 'text-green-600' : 'text-red-600'}`}>{user ? hasRole(['ADMIN']).toString() : 'N/A'}</span></div>
            <div>Has Editor Role: <span className={`font-semibold ${user && hasRole(['ADMIN', 'EDITOR']) ? 'text-green-600' : 'text-red-600'}`}>{user ? hasRole(['ADMIN', 'EDITOR']).toString() : 'N/A'}</span></div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-y-3">
            <button onClick={performLogin} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Login as Admin
            </button>
            <button onClick={checkLocalStorage} className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Check LocalStorage
            </button>
            <button onClick={testNavigation} className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Test Navigate to /users/add
            </button>
            <button onClick={clearAuth} className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Clear Auth & Reload
            </button>
          </div>
        </div>
      </div>

      {/* Test Results Log */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Results Log</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto text-xs font-mono">
          {testResults.map((result, index) => (
            <div key={index} className="border-b pb-2">
              <div className="text-gray-500">{result.timestamp}</div>
              <div className="font-semibold text-blue-600">{result.message}</div>
              {result.data && (
                <div className="bg-gray-50 p-2 rounded mt-1">
                  {JSON.stringify(result.data, null, 2)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthFlowTest;

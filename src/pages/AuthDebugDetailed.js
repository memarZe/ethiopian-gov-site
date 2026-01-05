import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthDebugDetailed = () => {
  const { user, isAuthenticated, loading, hasRole, login } = useAuth();
  const [testResults, setTestResults] = useState([]);

  const addResult = (test, result) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const testAdminLogin = async () => {
    try {
      addResult('Admin Login Attempt', 'Starting...');
      const result = await login({ username: 'admin', password: 'admin123' });
      addResult('Admin Login Result', JSON.stringify(result, null, 2));
    } catch (error) {
      addResult('Admin Login Error', error.message);
    }
  };

  const testRoleCheck = () => {
    addResult('Role Check - Admin', hasRole(['ADMIN']));
    addResult('Role Check - Editor', hasRole(['ADMIN', 'EDITOR']));
    addResult('Current User Role', user?.role || 'NO_USER');
  };

  const clearTests = () => {
    setTestResults([]);
  };

  useEffect(() => {
    // Log initial state
    addResult('Initial Auth State', {
      loading,
      isAuthenticated,
      user: user ? { username: user.username, role: user.role } : null
    });
  }, [loading, isAuthenticated, user]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Detailed Auth Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current State */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current Auth State</h2>
          <div className="space-y-2">
            <div>Loading: <span className={loading ? 'text-yellow-600' : 'text-green-600'}>{loading.toString()}</span></div>
            <div>Authenticated: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>{isAuthenticated.toString()}</span></div>
            <div>User: <span className="font-mono text-sm">{user ? JSON.stringify({ username: user.username, role: user.role }, null, 2) : 'null'}</span></div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="space-y-3">
            <button
              onClick={testAdminLogin}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Admin Login
            </button>
            <button
              onClick={testRoleCheck}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test Role Check
            </button>
            <button
              onClick={clearTests}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {testResults.map((result, index) => (
            <div key={index} className="border-b pb-2">
              <div className="font-medium text-sm text-gray-600">{result.timestamp}</div>
              <div className="font-semibold">{result.test}</div>
              <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                {typeof result.result === 'object' ? JSON.stringify(result.result, null, 2) : result.result.toString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Test */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/users/add'}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Navigate to /users/add
          </button>
          <button
            onClick={() => window.location.href = '/services/add'}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Navigate to /services/add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugDetailed;

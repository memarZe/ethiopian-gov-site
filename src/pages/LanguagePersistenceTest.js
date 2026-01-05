import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const LanguagePersistenceTest = () => {
  const { language, setLanguage } = useLanguage();
  const [testResults, setTestResults] = useState([]);

  const addResult = (test, result) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const testLocalStorageRead = () => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    addResult('LocalStorage Read', `Stored language: ${storedLanguage || 'null'}`);
    return storedLanguage;
  };

  const testLanguageChange = (newLanguage) => {
    addResult('Language Change', `Changing to: ${newLanguage}`);
    setLanguage(newLanguage);
    
    // Check if it was stored
    setTimeout(() => {
      const storedLanguage = localStorage.getItem('selectedLanguage');
      addResult('Language Storage Check', `After change, localStorage has: ${storedLanguage}`);
    }, 100);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  useEffect(() => {
    addResult('Component Mount', `Initial language: ${language}`);
    testLocalStorageRead();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Language Persistence Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current State */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="space-y-2">
            <div>Current Language: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{language}</span></div>
            <div>LocalStorage: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{localStorage.getItem('selectedLanguage') || 'null'}</span></div>
            <div>Match: <span className={`font-semibold ${language === localStorage.getItem('selectedLanguage') ? 'text-green-600' : 'text-red-600'}`}>
              {language === localStorage.getItem('selectedLanguage') ? '✅ Match' : '❌ Mismatch'}
            </span></div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="space-y-3">
            <button
              onClick={() => testLanguageChange('am')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Set to Amharic (am)
            </button>
            <button
              onClick={() => testLanguageChange('en')}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Set to English (en)
            </button>
            <button
              onClick={testLocalStorageRead}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Test LocalStorage Read
            </button>
            <button
              onClick={clearResults}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Results
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Test */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
        <p className="text-gray-600 mb-4">Test if language persists when navigating between pages:</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/services" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Go to Services
          </Link>
          <Link to="/users" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Go to Users
          </Link>
          <Link to="/news" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Go to News
          </Link>
          <Link to="/" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Back to Home
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Change the language above, then click these links. The language should remain the same on all pages.
        </p>
      </div>

      {/* Test Results */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {testResults.map((result, index) => (
            <div key={index} className="border-b pb-2">
              <div className="font-medium text-sm text-gray-600">{result.timestamp}</div>
              <div className="font-semibold">{result.test}</div>
              <div className="text-sm text-gray-700">{result.result}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguagePersistenceTest;

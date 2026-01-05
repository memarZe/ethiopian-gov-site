import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ComprehensiveLanguageTest = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [testLog, setTestLog] = useState([]);
  const [autoTest, setAutoTest] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLog(prev => [...prev, { timestamp, message, type }]);
  };

  const checkConsistency = () => {
    const contextLang = language;
    const storedLang = localStorage.getItem('selectedLanguage');
    const consistent = contextLang === storedLang;
    
    addLog(`Context Language: ${contextLang}`, 'info');
    addLog(`Stored Language: ${storedLang}`, 'info');
    addLog(`Consistent: ${consistent ? '✅ YES' : '❌ NO'}`, consistent ? 'success' : 'error');
    
    return consistent;
  };

  const testLanguageChange = async (newLang) => {
    addLog(`🔄 Testing language change to: ${newLang}`, 'info');
    
    // Record initial state
    const initialContext = language;
    const initialStored = localStorage.getItem('selectedLanguage');
    
    // Change language
    setLanguage(newLang);
    
    // Wait a bit for state update
    setTimeout(() => {
      const newContext = language;
      const newStored = localStorage.getItem('selectedLanguage');
      
      addLog(`Initial Context: ${initialContext}, Initial Stored: ${initialStored}`, 'info');
      addLog(`New Context: ${newContext}, New Stored: ${newStored}`, 'info');
      
      if (newContext === newLang && newStored === newLang) {
        addLog(`✅ Language change successful`, 'success');
      } else {
        addLog(`❌ Language change failed`, 'error');
      }
      
      checkConsistency();
    }, 200);
  };

  const testNavigation = (path) => {
    addLog(`🚀 Testing navigation to: ${path}`, 'info');
    const currentLang = language;
    addLog(`Language before navigation: ${currentLang}`, 'info');
    
    navigate(path);
  };

  const runAutoTest = async () => {
    setAutoTest(true);
    addLog('🤖 Starting automated test sequence', 'info');
    
    // Test 1: Check initial state
    addLog('Test 1: Initial state check', 'info');
    checkConsistency();
    
    // Test 2: Language changes
    for (const lang of ['en', 'am']) {
      await new Promise(resolve => {
        addLog(`Test 2.${lang}: Changing to ${lang}`, 'info');
        testLanguageChange(lang);
        setTimeout(resolve, 1000);
      });
    }
    
    setAutoTest(false);
    addLog('🏁 Automated test sequence completed', 'success');
  };

  useEffect(() => {
    addLog(`📍 Component mounted on route: ${location.pathname}`, 'info');
    checkConsistency();
  }, [location.pathname]);

  useEffect(() => {
    addLog(`🔄 Language context changed to: ${language}`, 'info');
  }, [language]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Comprehensive Language Persistence Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current State */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <strong>Route:</strong> {location.pathname}
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong>Context Language:</strong> 
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {language}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong>Stored Language:</strong>
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                {localStorage.getItem('selectedLanguage') || 'null'}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong>Status:</strong>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                language === localStorage.getItem('selectedLanguage') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {language === localStorage.getItem('selectedLanguage') ? '✅ Consistent' : '❌ Inconsistent'}
              </span>
            </div>
          </div>
        </div>

        {/* Manual Tests */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Manual Tests</h2>
          <div className="space-y-3">
            <button
              onClick={() => testLanguageChange('am')}
              disabled={autoTest}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Test Amharic (am)
            </button>
            <button
              onClick={() => testLanguageChange('en')}
              disabled={autoTest}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Test English (en)
            </button>
            <button
              onClick={checkConsistency}
              disabled={autoTest}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Check Consistency
            </button>
            <button
              onClick={runAutoTest}
              disabled={autoTest}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              {autoTest ? 'Running...' : 'Run Auto Test'}
            </button>
          </div>
        </div>

        {/* Navigation Tests */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Navigation Tests</h2>
          <p className="text-sm text-gray-600 mb-4">
            Change language above, then navigate. Language should persist.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => testNavigation('/')}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              🏠 Go to Home
            </button>
            <button
              onClick={() => testNavigation('/services')}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              🛠️ Go to Services
            </button>
            <button
              onClick={() => testNavigation('/users')}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              👥 Go to Users
            </button>
            <button
              onClick={() => testNavigation('/news')}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              📰 Go to News
            </button>
          </div>
        </div>
      </div>

      {/* Test Log */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Test Log</h2>
          <button
            onClick={() => setTestLog([])}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Clear Log
          </button>
        </div>
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
                <span className="font-mono text-xs text-gray-600">[{entry.timestamp}]</span>
                <span className="ml-2">{entry.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveLanguageTest;

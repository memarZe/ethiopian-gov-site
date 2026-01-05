// Comprehensive navigation sequence test
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { apiService } from '../services/api';

const NavigationSequenceDebug = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [detailedLogs, setDetailedLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const log = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
      path: location.pathname
    };
    console.log(`[${type.toUpperCase()}] ${message}`);
    setDetailedLogs(prev => [...prev.slice(-19), log]); // Keep last 20 logs
  };

  useEffect(() => {
    addLog(`Location changed to: ${location.pathname}`, 'navigation');
  }, [location.pathname]);

  const testExactSequence = async () => {
    setIsRunning(true);
    setTestResults([]);
    setDetailedLogs([]);
    setCurrentStep(-1);

    const sequence = [
      { name: 'Home', path: '/', waitTime: 1500 },
      { name: 'Services', path: '/services', waitTime: 2000 },
      { name: 'Ministries', path: '/ministries', waitTime: 2000 },
      { name: 'Regions', path: '/regions', waitTime: 3000 }
    ];

    addLog('🚀 Starting exact navigation sequence test');

    try {
      for (let i = 0; i < sequence.length; i++) {
        const step = sequence[i];
        setCurrentStep(i);
        
        addLog(`📍 Step ${i + 1}/4: Navigating to ${step.name} (${step.path})`);
        
        // Record pre-navigation state
        const preState = {
          url: window.location.href,
          pathname: window.location.pathname,
          readyState: document.readyState,
          title: document.title
        };
        
        addLog(`Pre-navigation state: ${JSON.stringify(preState)}`);

        // Navigate using React Router
        navigate(step.path);
        
        // Wait for navigation
        addLog(`⏳ Waiting ${step.waitTime}ms for navigation to complete...`);
        await new Promise(resolve => setTimeout(resolve, step.waitTime));
        
        // Record post-navigation state
        const postState = {
          url: window.location.href,
          pathname: window.location.pathname,
          readyState: document.readyState,
          title: document.title
        };
        
        addLog(`Post-navigation state: ${JSON.stringify(postState)}`);
        
        const navigationSuccess = window.location.pathname === step.path;
        
        const result = {
          step: i + 1,
          name: step.name,
          expectedPath: step.path,
          actualPath: window.location.pathname,
          success: navigationSuccess,
          preState,
          postState,
          timestamp: new Date().toISOString()
        };

        if (navigationSuccess) {
          addLog(`✅ Navigation to ${step.name} successful`, 'success');
        } else {
          addLog(`❌ Navigation to ${step.name} failed - Expected: ${step.path}, Got: ${window.location.pathname}`, 'error');
        }

        // Special detailed check for regions page
        if (step.path === '/regions') {
          addLog('🏛️ Performing detailed regions page analysis...');
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const pageAnalysis = await analyzeRegionsPage();
          result.regionsAnalysis = pageAnalysis;
          
          addLog(`Regions page analysis: ${JSON.stringify(pageAnalysis)}`);
          
          if (!pageAnalysis.hasContent) {
            addLog('❌ CRITICAL: Regions page has no content!', 'error');
          }
        }

        setTestResults(prev => [...prev, result]);

        if (!navigationSuccess) {
          addLog('💥 Test aborted due to navigation failure', 'error');
          break;
        }
      }
      
      addLog('🎯 Navigation sequence test completed');
      
    } catch (error) {
      addLog(`💥 Test failed with error: ${error.message}`, 'error');
      console.error('Navigation test error:', error);
    } finally {
      setIsRunning(false);
      setCurrentStep(-1);
    }
  };

  const analyzeRegionsPage = async () => {
    // Wait a bit more for content to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const analysis = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      pathname: window.location.pathname,
      title: document.title,
      
      // Check for key elements
      hasH1: !!document.querySelector('h1'),
      h1Text: document.querySelector('h1')?.textContent || null,
      
      hasRegionsGrid: !!document.querySelector('[class*="grid"]'),
      gridCount: document.querySelectorAll('[class*="grid"]').length,
      
      hasRegionCards: !!document.querySelector('[class*="bg-white"][class*="rounded"]'),
      cardCount: document.querySelectorAll('[class*="bg-white"][class*="rounded"]').length,
      
      hasSearchInput: !!document.querySelector('input'),
      searchInputCount: document.querySelectorAll('input').length,
      
      hasLoadingSpinner: !!document.querySelector('[class*="loading"], [class*="spinner"]'),
      
      hasErrorMessage: !!document.querySelector('[class*="error"]'),
      errorCount: document.querySelectorAll('[class*="error"]').length,
      
      bodyContentLength: document.body.innerHTML.length,
      hasContent: document.body.innerHTML.length > 10000, // Arbitrary threshold
      
      // Check for React errors
      reactErrorOverlay: !!document.querySelector('[data-reactroot] [class*="error"]'),
      
      // Check viewport
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      
      // Check for console errors
      consoleErrorCount: 0 // We'll have to check this manually
    };

    return analysis;
  };

  const testRegionsDirectly = async () => {
    addLog('🎯 Testing direct navigation to regions page...');
    
    try {
      // Test API first
      const regionsData = await apiService.getRegions();
      addLog(`✅ Regions API returned ${regionsData?.length || 0} regions`);
      
      // Navigate directly
      navigate('/regions');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = await analyzeRegionsPage();
      addLog(`Direct regions navigation analysis: ${JSON.stringify(analysis)}`);
      
      return analysis;
    } catch (error) {
      addLog(`❌ Direct regions test failed: ${error.message}`, 'error');
      return { error: error.message };
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Navigation Sequence Debug Tool</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            
            <div className="space-y-3">
              <button
                onClick={testExactSequence}
                disabled={isRunning}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {isRunning ? `Running Step ${currentStep + 1}/4...` : 'Run Exact Sequence Test'}
              </button>
              
              <button
                onClick={testRegionsDirectly}
                disabled={isRunning}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                Test Direct Regions Navigation
              </button>
              
              <div className="flex space-x-2">
                <Link to="/" className="flex-1 px-3 py-2 bg-gray-200 text-center rounded hover:bg-gray-300">Home</Link>
                <Link to="/services" className="flex-1 px-3 py-2 bg-gray-200 text-center rounded hover:bg-gray-300">Services</Link>
                <Link to="/ministries" className="flex-1 px-3 py-2 bg-gray-200 text-center rounded hover:bg-gray-300">Ministries</Link>
                <Link to="/regions" className="flex-1 px-3 py-2 bg-gray-200 text-center rounded hover:bg-gray-300">Regions</Link>
              </div>
            </div>
          </div>

          {/* Current State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Current State</h3>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">Path:</span> {location.pathname}</div>
              <div><span className="font-medium">Title:</span> {document.title}</div>
              <div><span className="font-medium">Ready:</span> {document.readyState}</div>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Debug Logs</h3>
          <div className="h-96 overflow-y-auto border rounded p-3 text-sm font-mono">
            {detailedLogs.map((log, index) => (
              <div key={index} className={`mb-1 ${
                log.type === 'error' ? 'text-red-600' :
                log.type === 'success' ? 'text-green-600' :
                log.type === 'navigation' ? 'text-blue-600' :
                'text-gray-700'
              }`}>
                <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Test Results</h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Step {result.step}: {result.name}</span>
                    <span className={`ml-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.success ? '✅' : '❌'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <div>Expected: {result.expectedPath}</div>
                  <div>Actual: {result.actualPath}</div>
                  {result.regionsAnalysis && (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-medium">Regions Analysis</summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.regionsAnalysis, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationSequenceDebug;

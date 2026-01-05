import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RegionsNavigationDebug } from '../debug/regions-navigation-debug';

const NavigationSequenceTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const navigationSequence = [
    { name: 'Home', path: '/', description: 'Navigate to home page' },
    { name: 'Services', path: '/services', description: 'Navigate to services page' },
    { name: 'Ministries', path: '/ministries', description: 'Navigate to ministries page' },
    { name: 'Regions', path: '/regions', description: 'Navigate to regions page' }
  ];

  useEffect(() => {
    console.log('📍 Navigation test - location changed to:', location.pathname);
  }, [location]);

  const runAutomaticTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    setCurrentStep(0);

    console.log('🚀 Starting automatic navigation sequence test');

    for (let i = 0; i < navigationSequence.length; i++) {
      const step = navigationSequence[i];
      console.log(`\n📍 Step ${i + 1}: ${step.name} (${step.path})`);
      
      setCurrentStep(i);
      
      // Navigate to the step
      navigate(step.path);
      
      // Wait for navigation to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if we actually navigated
      const actualPath = window.location.pathname;
      const success = actualPath === step.path;
      
      const result = {
        step: i + 1,
        name: step.name,
        expectedPath: step.path,
        actualPath: actualPath,
        success: success,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [...prev, result]);
      
      console.log(`✅ Step ${i + 1} result:`, result);
      
      // Special handling for regions page
      if (step.path === '/regions') {
        console.log('🏛️ Testing regions page specifically');
        await RegionsNavigationDebug.testRegionsAPI();
        RegionsNavigationDebug.checkRegionsPageLoad();
      }
    }
    
    setIsRunning(false);
    console.log('✅ Navigation sequence test completed');
  };

  const navigateToStep = (stepIndex) => {
    const step = navigationSequence[stepIndex];
    console.log(`🎯 Manual navigation to ${step.name} (${step.path})`);
    navigate(step.path);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Navigation Sequence Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Location</h2>
          <p className="text-lg">
            <span className="font-medium">Path:</span> {location.pathname}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-medium">Full URL:</span> {window.location.href}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Manual Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {navigationSequence.map((step, index) => (
              <button
                key={index}
                onClick={() => navigateToStep(index)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  location.pathname === step.path
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                <div className="text-sm font-medium">{step.name}</div>
                <div className="text-xs text-gray-500">{step.path}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Automatic Test</h2>
          <button
            onClick={runAutomaticTest}
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-medium ${
              isRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRunning ? 'Running Test...' : 'Run Navigation Sequence Test'}
          </button>
          
          {isRunning && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-700">
                Running Step {currentStep + 1}: {navigationSequence[currentStep]?.name}
              </p>
            </div>
          )}
        </div>

        {testResults.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    result.success
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Step {result.step}: {result.name}</span>
                      <span className={`ml-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                        {result.success ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">{result.timestamp}</div>
                  </div>
                  <div className="mt-2 text-sm">
                    <div>Expected: {result.expectedPath}</div>
                    <div>Actual: {result.actualPath}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded-lg mt-6">
          <h3 className="font-medium text-yellow-800 mb-2">Debug Instructions</h3>
          <p className="text-yellow-700 text-sm">
            Open browser developer console (F12) to see detailed debug logs during navigation.
            The regions navigation debug utility is automatically active.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavigationSequenceTest;

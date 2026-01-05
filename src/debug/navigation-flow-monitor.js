// Advanced navigation flow monitor to debug the regions page issue
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const NavigationFlowMonitor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [currentIssue, setCurrentIssue] = useState(null);

  useEffect(() => {
    // Log every navigation event
    const logNavigation = (path, method = 'unknown') => {
      const timestamp = new Date().toISOString();
      const entry = {
        timestamp,
        path,
        method,
        url: window.location.href,
        title: document.title
      };
      
      console.log('🧭 Navigation Event:', entry);
      setNavigationHistory(prev => [...prev.slice(-9), entry]); // Keep last 10
      
      // Check for specific issue pattern
      if (path === '/regions') {
        setTimeout(() => {
          const regionsTitle = document.querySelector('h1');
          const regionsContent = document.querySelector('[class*="grid"]');
          
          if (!regionsTitle || !regionsContent) {
            const issue = {
              timestamp,
              path,
              problem: 'Regions page elements not found',
              title: regionsTitle?.textContent || 'No title',
              hasGrid: !!regionsContent,
              bodyClasses: document.body.className,
              url: window.location.href
            };
            
            console.error('❌ Regions Page Issue Detected:', issue);
            setCurrentIssue(issue);
          } else {
            console.log('✅ Regions page loaded successfully');
            setCurrentIssue(null);
          }
        }, 1000);
      }
    };

    // Initial log
    logNavigation(location.pathname, 'useEffect');

    // Monitor React Router location changes
    logNavigation(location.pathname, 'location-change');

    return () => {
      // Cleanup if needed
    };
  }, [location]);

  // Test the exact navigation sequence
  const testProblematicSequence = async () => {
    console.log('🧪 Testing problematic navigation sequence...');
    
    const steps = [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Ministries', path: '/ministries' },
      { name: 'Regions', path: '/regions' }
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      console.log(`📍 Step ${i + 1}: Navigating to ${step.name}`);
      
      navigate(step.path);
      
      // Wait for navigation to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify we actually navigated
      const actualPath = window.location.pathname;
      const success = actualPath === step.path;
      
      console.log(`${success ? '✅' : '❌'} Step ${i + 1} result:`, {
        expected: step.path,
        actual: actualPath,
        success
      });

      if (!success) {
        console.error('❌ Navigation failed at step:', step.name);
        break;
      }

      // Special check for regions page
      if (step.path === '/regions') {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const pageTitle = document.querySelector('h1');
        const regionsGrid = document.querySelector('[class*="grid"]');
        const errorElements = document.querySelectorAll('[class*="error"]');
        
        console.log('🔍 Regions page verification:', {
          hasTitle: !!pageTitle,
          titleText: pageTitle?.textContent,
          hasGrid: !!regionsGrid,
          hasErrors: errorElements.length > 0,
          bodyClasses: document.body.className,
          pathname: window.location.pathname
        });
      }
    }
  };

  return null; // This is a monitoring component, no UI
};

// Hook to monitor navigation issues
export const useNavigationMonitor = () => {
  const location = useLocation();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    // Check if we're on regions page and having issues
    if (location.pathname === '/regions') {
      const checkRegionsPage = setTimeout(() => {
        const regionsTitle = document.querySelector('h1');
        const regionsContent = document.querySelector('[class*="bg-white"][class*="p-6"]');
        const loadingElements = document.querySelectorAll('[class*="loading"]');
        
        const pageState = {
          timestamp: new Date().toISOString(),
          pathname: location.pathname,
          hasTitle: !!regionsTitle,
          titleText: regionsTitle?.textContent || null,
          hasContent: !!regionsContent,
          isLoading: loadingElements.length > 0,
          bodyHTML: document.body.innerHTML.length,
          reactErrors: window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ ? 'React errors detected' : 'No React errors'
        };
        
        console.log('📊 Regions Page State Check:', pageState);
        
        // If page seems broken, record the issue
        if (!pageState.hasTitle && !pageState.isLoading) {
          const issue = {
            ...pageState,
            type: 'REGIONS_PAGE_NOT_RENDERING',
            description: 'Regions page appears to not be rendering properly'
          };
          
          setIssues(prev => [...prev.slice(-4), issue]); // Keep last 5 issues
          console.error('❌ Regions page issue detected:', issue);
        }
      }, 1500);
      
      return () => clearTimeout(checkRegionsPage);
    }
  }, [location]);

  return { issues };
};

// Global navigation debugging utilities
export const NavigationDebugUtils = {
  // Force navigation to regions page with debugging
  forceNavigateToRegions: () => {
    console.log('🎯 Force navigating to regions page...');
    
    // Clear any potential state issues
    sessionStorage.removeItem('navigationState');
    
    // Navigate directly
    window.location.href = '/regions';
  },

  // Test if regions route is properly registered
  testRegionsRoute: () => {
    console.log('🧪 Testing regions route registration...');
    
    // Try to navigate via React Router
    const navigate = window.__REACT_ROUTER_NAVIGATE__;
    if (navigate) {
      navigate('/regions');
    } else {
      console.warn('⚠️ React Router navigate function not found');
      window.location.href = '/regions';
    }
  },

  // Check for React Router issues
  diagnoseReactRouter: () => {
    console.log('🔍 Diagnosing React Router state...');
    
    const diagnosis = {
      currentPath: window.location.pathname,
      reactRouterVersion: window.__REACT_ROUTER_VERSION__ || 'unknown',
      hasHistory: !!window.history,
      historyLength: window.history.length,
      reactDevTools: !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
      errorBoundary: !!window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__
    };
    
    console.log('📋 React Router Diagnosis:', diagnosis);
    return diagnosis;
  }
};

// Auto-initialize in development
if (process.env.NODE_ENV === 'development') {
  window.NavigationDebugUtils = NavigationDebugUtils;
  console.log('🔧 Navigation Debug Utils loaded globally');
}

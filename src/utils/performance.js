// Performance monitoring utilities for the Ethiopian Government Portal
// این فایل برای نظارت بر عملکرد سایت دولتی اتیوپی استفاده می‌شود

export const PerformanceMonitor = {
  // Track page load times
  trackPageLoad: (pageName) => {
    if (window.performance && window.performance.getEntriesByType) {
      const navigationEntries = window.performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const navigation = navigationEntries[0];
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        
        console.log(`📊 Performance - ${pageName}:`, {
          loadTime: `${Math.round(loadTime)}ms`,
          domContentLoaded: `${Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart)}ms`,
          firstPaint: window.performance.getEntriesByName('first-paint')[0]?.startTime || 'N/A',
          firstContentfulPaint: window.performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 'N/A'
        });
      }
    }
  },

  // Track API response times
  trackApiCall: (endpoint, startTime, endTime, success = true) => {
    const responseTime = endTime - startTime;
    console.log(`🌐 API Performance - ${endpoint}:`, {
      responseTime: `${Math.round(responseTime)}ms`,
      status: success ? '✅ Success' : '❌ Error',
      timestamp: new Date().toISOString()
    });
  },

  // Track component render times
  trackComponentRender: (componentName, renderTime) => {
    if (renderTime > 100) { // Only log slow renders
      console.log(`⚡ Component Performance - ${componentName}:`, {
        renderTime: `${Math.round(renderTime)}ms`,
        warning: renderTime > 500 ? 'SLOW RENDER' : 'OK'
      });
    }
  },

  // Memory usage tracking
  trackMemoryUsage: () => {
    if (window.performance && window.performance.memory) {
      const memory = window.performance.memory;
      console.log('💾 Memory Usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1048576)}MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1048576)}MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`
      });
    }
  }
};

// High-order component for performance tracking
export const withPerformanceTracking = (WrappedComponent, componentName) => {
  return function PerformanceTrackedComponent(props) {
    const startTime = performance.now();
    
    // Using useEffect for lifecycle tracking
    // This would require React import at component level
    return WrappedComponent(props);
  };
};

export default PerformanceMonitor;

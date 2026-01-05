// Debug utility to monitor regions page navigation issues
import { apiService } from '../services/api';

export const RegionsNavigationDebug = {
  // Test the regions API call directly
  testRegionsAPI: async () => {
    console.log('=== REGIONS API DEBUG TEST ===');
    try {
      const result = await apiService.getRegions();
      console.log('✅ Regions API call successful:', result);
      console.log('📊 Number of regions returned:', result?.length || 0);
      console.log('🔍 First region data:', result?.[0]);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Regions API call failed:', error);
      return { success: false, error };
    }
  },

  // Monitor navigation sequence
  logNavigationSequence: () => {
    console.log('=== NAVIGATION SEQUENCE MONITOR ===');
    console.log('🏠 Starting from:', window.location.pathname);
    
    // Monitor route changes
    let navigationCount = 0;
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      navigationCount++;
      console.log(`📍 Navigation ${navigationCount}: pushState to`, args[2]);
      return originalPushState.apply(this, args);
    };
    
    window.history.replaceState = function(...args) {
      navigationCount++;
      console.log(`📍 Navigation ${navigationCount}: replaceState to`, args[2]);
      return originalReplaceState.apply(this, args);
    };
    
    // Monitor popstate events
    window.addEventListener('popstate', (event) => {
      console.log('📍 Popstate event:', window.location.pathname);
    });
  },

  // Check if regions page components are loading correctly
  checkRegionsPageLoad: () => {
    console.log('=== REGIONS PAGE LOAD CHECK ===');
    
    // Check if we're on the regions page
    const isRegionsPage = window.location.pathname === '/regions';
    console.log('📍 Is on regions page:', isRegionsPage);
    
    // Check for regions page elements
    setTimeout(() => {
      const pageTitle = document.querySelector('h1');
      const regionsGrid = document.querySelector('[class*="grid"]');
      const searchInput = document.querySelector('input[type="text"]');
      
      console.log('🔍 Page title found:', !!pageTitle, pageTitle?.textContent);
      console.log('🔍 Regions grid found:', !!regionsGrid);
      console.log('🔍 Search input found:', !!searchInput);
      
      // Check for any React error boundaries
      const errorElements = document.querySelectorAll('[class*="error"]');
      if (errorElements.length > 0) {
        console.log('⚠️ Error elements found:', errorElements);
      }
      
      // Check for loading indicators
      const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"]');
      console.log('⏳ Loading elements found:', loadingElements.length);
      
    }, 1000);
  },

  // Full navigation test sequence
  testNavigationSequence: async () => {
    console.log('=== FULL NAVIGATION SEQUENCE TEST ===');
    
    // Start monitoring
    this.logNavigationSequence();
    
    const steps = [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Ministries', path: '/ministries' },
      { name: 'Regions', path: '/regions' }
    ];
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      console.log(`\n🚀 Step ${i + 1}: Navigating to ${step.name} (${step.path})`);
      
      // Navigate programmatically
      window.history.pushState({}, '', step.path);
      
      // Trigger route change event
      window.dispatchEvent(new PopStateEvent('popstate'));
      
      // Wait for potential async operations
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check page state
      console.log('📍 Current URL:', window.location.pathname);
      console.log('📍 Document title:', document.title);
      
      // Special check for regions page
      if (step.path === '/regions') {
        this.checkRegionsPageLoad();
        await this.testRegionsAPI();
      }
    }
  }
};

// Auto-run debug if in development
if (process.env.NODE_ENV === 'development') {
  window.RegionsNavigationDebug = RegionsNavigationDebug;
  console.log('🔧 RegionsNavigationDebug available globally');
}

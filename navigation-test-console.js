// Quick navigation test for console use
// Paste this into browser console to test regions navigation

console.log('🧪 REGIONS NAVIGATION TEST STARTING...');

// Function to test navigation sequence
const testRegionsNavigation = async () => {
  console.log('📍 Testing navigation sequence: Home → Services → Ministries → Regions');
  
  const steps = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Ministries', path: '/ministries' },
    { name: 'Regions', path: '/regions' }
  ];
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    console.log(`\n🎯 Step ${i + 1}: Navigating to ${step.name} (${step.path})`);
    
    // Navigate
    window.history.pushState({}, '', step.path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    
    // Wait
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Verify
    const success = window.location.pathname === step.path;
    console.log(`${success ? '✅' : '❌'} Navigation ${success ? 'SUCCESS' : 'FAILED'}: Expected ${step.path}, Got ${window.location.pathname}`);
    
    // Special check for regions
    if (step.path === '/regions') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const hasTitle = !!document.querySelector('h1');
      const hasContent = document.body.innerHTML.length > 10000;
      
      console.log(`🏛️ Regions Page Analysis:`);
      console.log(`   - Has Title: ${hasTitle ? '✅' : '❌'}`);
      console.log(`   - Has Content: ${hasContent ? '✅' : '❌'}`);
      console.log(`   - Content Length: ${document.body.innerHTML.length} chars`);
      
      if (!hasTitle || !hasContent) {
        console.error('❌ REGIONS PAGE ISSUE DETECTED!');
        return false;
      }
    }
    
    if (!success) {
      console.error(`💥 Test FAILED at step ${i + 1}: ${step.name}`);
      return false;
    }
  }
  
  console.log('\n🎉 ALL NAVIGATION TESTS PASSED!');
  return true;
};

// Function to test direct regions navigation
const testDirectRegions = () => {
  console.log('\n🎯 Testing direct regions navigation...');
  window.location.href = '/regions';
  
  setTimeout(() => {
    const success = window.location.pathname === '/regions';
    const hasContent = document.body.innerHTML.length > 10000;
    
    console.log(`${success ? '✅' : '❌'} Direct navigation: ${success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`${hasContent ? '✅' : '❌'} Content loaded: ${hasContent ? 'SUCCESS' : 'FAILED'}`);
  }, 2000);
};

// Make functions available globally
window.testRegionsNavigation = testRegionsNavigation;
window.testDirectRegions = testDirectRegions;

console.log(`
🛠️  NAVIGATION TEST TOOLS LOADED
   
   Usage in console:
   - testRegionsNavigation()  // Test full sequence
   - testDirectRegions()      // Test direct navigation
   
   Navigate to: http://localhost:3001
   Then run tests in browser console
`);

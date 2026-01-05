// Navigation Monitoring Script
// Run this in browser console to monitor navigation events

console.log('🔍 Navigation Monitor Started');

// Monitor React Router navigation
let navigationCount = 0;
let lastPath = window.location.pathname;

// Monitor URL changes
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function(...args) {
  navigationCount++;
  console.log(`🔄 Navigation ${navigationCount}: pushState called`, args);
  console.log(`📍 Path change: ${lastPath} → ${args[2] || 'unknown'}`);
  lastPath = args[2] || window.location.pathname;
  return originalPushState.apply(this, args);
};

history.replaceState = function(...args) {
  console.log('🔄 replaceState called', args);
  return originalReplaceState.apply(this, args);
};

// Monitor popstate events
window.addEventListener('popstate', (event) => {
  console.log('🔙 popstate event', event);
});

// Monitor click events on navigation
document.addEventListener('click', (event) => {
  if (event.target.tagName === 'A' || event.target.closest('a')) {
    const link = event.target.closest('a') || event.target;
    console.log('🖱️ Link clicked:', link.href, 'pathname:', link.pathname);
  }
});

// Monitor React Router state
setInterval(() => {
  const currentPath = window.location.pathname;
  if (currentPath !== lastPath) {
    console.log(`🔍 Path mismatch detected: lastPath=${lastPath}, currentPath=${currentPath}`);
    lastPath = currentPath;
  }
}, 1000);

// Test navigation programmatically
window.testNavigation = () => {
  console.log('🧪 Testing programmatic navigation...');
  const paths = ['/services', '/users', '/ministries', '/regions', '/news'];
  
  paths.forEach((path, index) => {
    setTimeout(() => {
      console.log(`🔄 Navigating to ${path}...`);
      window.history.pushState(null, '', path);
      
      // Trigger React Router update
      const event = new PopStateEvent('popstate');
      window.dispatchEvent(event);
    }, (index + 1) * 2000);
  });
};

console.log('📋 Available commands:');
console.log('- testNavigation() - Test programmatic navigation');
console.log('- Monitor will automatically log all navigation events');

export {};

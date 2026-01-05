// Language Persistence Test Script
// Run this in the browser console to test language persistence

console.log('🧪 Starting Language Persistence Test');

// Function to check current state
function checkCurrentState() {
  const contextLanguage = document.querySelector('select')?.value;
  const storedLanguage = localStorage.getItem('selectedLanguage');
  
  console.log('📊 Current State Check:');
  console.log('  - Header dropdown value:', contextLanguage);
  console.log('  - localStorage value:', storedLanguage);
  console.log('  - Match:', contextLanguage === storedLanguage ? '✅' : '❌');
  
  return { contextLanguage, storedLanguage, match: contextLanguage === storedLanguage };
}

// Function to change language
function testLanguageChange(newLanguage) {
  console.log(`🔄 Testing language change to: ${newLanguage}`);
  
  // Find and change the select element
  const select = document.querySelector('select');
  if (select) {
    select.value = newLanguage;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    
    setTimeout(() => {
      const state = checkCurrentState();
      console.log(`✅ Language change to ${newLanguage} completed. Match: ${state.match ? '✅' : '❌'}`);
    }, 100);
  } else {
    console.log('❌ Language selector not found');
  }
}

// Function to test navigation
function testNavigation(path) {
  console.log(`🚀 Navigating to: ${path}`);
  const initialState = checkCurrentState();
  
  // Navigate
  window.location.href = path;
  
  // Note: We can't check the state after navigation in the same script
  // as the page will reload. The user needs to run checkCurrentState() 
  // manually after navigation.
}

// Initial state check
console.log('🚀 Language Persistence Test Script Loaded');
checkCurrentState();

// Expose functions globally for manual testing
window.languageTest = {
  checkCurrentState,
  testLanguageChange,
  testNavigation,
  
  // Quick test functions
  setAmharic: () => testLanguageChange('am'),
  setEnglish: () => testLanguageChange('en'), 
  
  goToServices: () => testNavigation('/services'),
  goToHome: () => testNavigation('/'),
  goToNews: () => testNavigation('/news')
};

console.log('🎯 Available test functions:');
console.log('  - languageTest.checkCurrentState()');
console.log('  - languageTest.testLanguageChange("en"|"am"|"or")');
console.log('  - languageTest.setAmharic()');
console.log('  - languageTest.setEnglish()'); 
console.log('  - languageTest.setOromo()');
console.log('  - languageTest.goToServices()');
console.log('  - languageTest.goToHome()');
console.log('  - languageTest.goToNews()');

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the language context
const LanguageContext = createContext();

// Hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage or default to Amharic
  const [language, setLanguageState] = useState(() => {
    try {
      // Check if localStorage is available
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        console.log('🔄 LanguageContext initialization - localStorage value:', savedLanguage);
        
        // Validate the saved language
        if (savedLanguage && ['am', 'en'].includes(savedLanguage)) {
          return savedLanguage;
        }
      }
      return 'am';
    } catch (error) {
      console.warn('❌ Failed to load language from localStorage:', error);
      return 'am';
    }
  });

  // Update localStorage whenever language changes
  const setLanguage = (newLanguage) => {
    try {
      // Validate input
      if (!['am', 'en'].includes(newLanguage)) {
        console.warn('❌ Invalid language code:', newLanguage);
        return;
      }

      console.log('🔄 Setting language to:', newLanguage);
      
      // Update localStorage first
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('selectedLanguage', newLanguage);
        console.log('✅ localStorage updated:', localStorage.getItem('selectedLanguage'));
      }
      
      // Then update state
      setLanguageState(newLanguage);
      console.log('✅ Language changed successfully to:', newLanguage);
      
    } catch (error) {
      console.error('❌ Failed to save language to localStorage:', error);
      // Still update state even if localStorage fails
      setLanguageState(newLanguage);
    }
  };

  // Log initial language on mount and verify consistency
  useEffect(() => {
    console.log('🚀 LanguageProvider mounted with language:', language);
    
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedValue = localStorage.getItem('selectedLanguage');
        console.log('🚀 localStorage current value:', storedValue);
        
        // Sync if there's a mismatch
        if (storedValue !== language) {
          console.log('🔧 Syncing language - Context:', language, 'Storage:', storedValue);
          if (storedValue && ['am', 'en'].includes(storedValue)) {
            setLanguageState(storedValue);
          } else {
            localStorage.setItem('selectedLanguage', language);
          }
        }
      }
    } catch (error) {
      console.warn('❌ Error during initial sync:', error);
    }
  }, []);

  // Additional useEffect to handle storage events (for multiple tabs)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'selectedLanguage' && event.newValue) {
        console.log('🔄 Language changed in another tab:', event.newValue);
        if (['am', 'en'].includes(event.newValue)) {
          setLanguageState(event.newValue);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const value = {
    language,
    setLanguage,
    isAmharic: language === 'am',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Utility function to get text based on language
export const getLocalizedText = (amharic, english, language) => {
  switch (language) {
    case 'am':
      return amharic || english;
    case 'en':
      return english || amharic;
    default:
      return amharic || english;
  }
};

export default LanguageContext;

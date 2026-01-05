import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import Chat from './Chat';

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        language={language}
        setLanguage={setLanguage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <Navigation 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {children}
      <Footer />
      <Chat />
    </div>
  );
};

export default Layout;

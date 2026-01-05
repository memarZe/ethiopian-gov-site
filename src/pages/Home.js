import React, { useState, useEffect } from 'react';
import { PerformanceMonitor } from '../utils/performance';
import Hero from '../components/Hero';
import AlertBanner from '../components/AlertBanner';
import PopularServices from '../components/PopularServices';
import GovernmentServices from '../components/GovernmentServices';
import RegionalServices from '../components/RegionalServices';
import NewsSection from '../components/NewsSection';
import Sidebar from '../components/Sidebar';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Track page load performance
    const timer = setTimeout(() => {
      PerformanceMonitor.trackPageLoad('Home');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <AlertBanner />
      <PopularServices />
      <GovernmentServices />
      <RegionalServices />
      
      {/* News and Communications */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <NewsSection />
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import AdvancedSearchComponent from './AdvancedSearch';

const Hero = ({ searchQuery, setSearchQuery }) => {
  const { language } = useLanguage();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const heroContent = {
    title: {
      amharic: 'የኢትዮጵያ መንግስት ፖርታል',
      english: 'Ethiopian Government Portal',
      oromo: 'Balbala Mootummaa Itoophiyaa'
    },
    subtitle: {
      amharic: 'ለዜጎች የተሻሻለ እና ፈጣን አገልግሎት',
      english: 'Better and Faster Services for Citizens',
      oromo: 'Tajaajila Fooyya\'aa fi Ariifataa Lammiif'
    },
    searchPlaceholder: {
      amharic: 'ፈልግ... አገልግሎቶች፣ መረጃዎች...',
      english: 'Search services, information...',
      oromo: 'Barbaadi... tajaajilaa, odeeffannoo...'
    },
    searchButton: {
      amharic: 'ፈልግ',
      english: 'Search',
      oromo: 'Barbaadi'
    }
  };
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-6xl">🦁</div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              {getLocalizedText(heroContent.title.amharic,  heroContent.title.english,  language)}
            </h1>
            <p className="text-xl md:text-2xl">
              {language === 'am' ? heroContent.title.english : heroContent.title.amharic}
            </p>
          </div>
        </div>
        <p className="text-lg md:text-xl mb-8">
          {getLocalizedText(heroContent.subtitle.amharic,  heroContent.subtitle.english,  language)}
        </p>
        
        {/* Search Box */}
        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getLocalizedText(
                heroContent.searchPlaceholder.amharic, 
                heroContent.searchPlaceholder.english, 
                heroContent.searchPlaceholder.oromo, 
                language
              )}
              className="flex-1 px-4 md:px-6 py-4 text-gray-900 text-lg focus:outline-none"
              onFocus={() => setShowAdvancedSearch(true)}
            />
            <button 
              onClick={() => setShowAdvancedSearch(true)}
              className="bg-yellow-400 text-gray-900 px-6 md:px-10 hover:bg-yellow-500 transition-colors font-bold"
              title={getLocalizedText(heroContent.searchButton.amharic,  heroContent.searchButton.english,  language)}
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Advanced Search Button */}
        <div className="mt-4">
          <button
            onClick={() => setShowAdvancedSearch(true)}
            className="flex items-center gap-2 text-sm text-white hover:text-yellow-300 transition-colors underline"
          >
            <Sparkles className="w-4 h-4" />
            {getLocalizedText('የላቀ ፍለጋ',  'Advanced Search',  language)}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="text-sm opacity-90">
            {getLocalizedText('ታዋቂ ፍለጋዎች:',  'Popular searches:',  language)}
          </span>
          <Link to="/services" className="text-sm underline hover:text-yellow-300">
            {getLocalizedText('ፓስፖርት',  'Passport',  language)}
          </Link>
          <Link to="/services" className="text-sm underline hover:text-yellow-300">
            {getLocalizedText('የንግድ ፍቃድ',  'Business License',  language)}
          </Link>
          <Link to="/services" className="text-sm underline hover:text-yellow-300">
            {getLocalizedText('የመሬት ሰርተፊኬት',  'Land Certificate',  language)}
          </Link>
        </div>
      </div>
      
      {/* Advanced Search Modal */}
      <AdvancedSearchComponent 
        isOpen={showAdvancedSearch} 
        onClose={() => setShowAdvancedSearch(false)} 
      />
    </div>
  );
};

export default Hero;

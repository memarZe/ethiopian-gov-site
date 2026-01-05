// Enhanced Search Component with Multilingual Support
// የተሻሻለ የፍለጋ አካል ከብዙ ቋንቋ ድጋፍ ጋር

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useSearch } from '../utils/search';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';

const AdvancedSearchComponent = ({ onClose, isOpen }) => {
  const { language } = useLanguage();
  const { performSearch, getSuggestions, isSearching, results, suggestions } = useSearch();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const searchRef = useRef(null);

  // Search categories with multilingual labels
  const categories = [
    { value: 'all', label: { am: 'ሁሉም', en: 'All', or: 'Hundaa' } },
    { value: 'services', label: { am: 'አገልግሎቶች', en: 'Services', or: 'Tajaajila' } },
    { value: 'news', label: { am: 'ዜና', en: 'News', or: 'Oduu' } },
    { value: 'ministries', label: { am: 'ሚኒስቴሮች', en: 'Ministries', or: 'Ministeera' } },
    { value: 'regions', label: { am: 'ክልሎች', en: 'Regions', or: 'Naannoo' } }
  ];

  // Popular search terms
  const popularSearches = [
    { am: 'ፓስፖርት', en: 'Passport', or: 'Paaspoortii' },
    { am: 'የንግድ ምዝገባ', en: 'Business Registration', or: 'Galmee Daldala' },
    { am: 'የጤና መድን', en: 'Health Insurance', or: 'Inshuraansii Fayyaa' },
    { am: 'ግብር', en: 'Tax', or: 'Gibira' },
    { am: 'የመሬት ምስክር ወረቀት', en: 'Land Certificate', or: 'Ragaa Lafa' }
  ];

  // Handle search input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 2) {
      getSuggestions(value);
      performSearch(value, {
        categories: selectedCategory === 'all' ? undefined : [selectedCategory],
        language,
        limit: 10
      });
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query, {
        categories: selectedCategory === 'all' ? undefined : [selectedCategory],
        language,
        limit: 20
      });
      setShowResults(true);
    }
  };

  // Handle clicking on popular search
  const handlePopularSearch = (searchTerm) => {
    const term = getLocalizedText(searchTerm.am,  searchTerm.en,  language);
    setQuery(term);
    performSearch(term, { language, limit: 20 });
    setShowResults(true);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div ref={searchRef} className="bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
        
        {/* Search Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {getLocalizedText('የላቀ ፍለጋ',  'Advanced Search',  language)}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={getLocalizedText(
                  'ፍለጋ... (ፓስፖርት፣ ንግድ፣ ጤና ወዘተ)',
                  'Search... (passport, business, health, etc.)',
                  'Barbaadi... (paaspoortii, daldala, fayyaa kkf)',
                  language
                )}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                autoFocus
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getLocalizedText(category.label.am,  category.label.en,  language)}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Search Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Popular Searches */}
          {!query && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">
                  {getLocalizedText('ታዋቂ ፍለጋዎች',  'Popular Searches',  language)}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(search)}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors text-sm"
                  >
                    {getLocalizedText(search.am,  search.en,  language)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {showResults && (
            <div className="p-6">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-3 text-gray-600">
                    {getLocalizedText('እፈልጋለሁ...',  'Searching...',  language)}
                  </span>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Search className="w-5 h-5 text-green-600" />
                    {results.length} {getLocalizedText('ውጤቶች ተገኝተዋል',  'results found',  language)}
                  </h3>
                  
                  {results.map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-2">
                            {result.snippet?.category}
                          </span>
                          <h4 className="font-semibold text-lg text-gray-900 mb-2">
                            {result.snippet?.title}
                          </h4>
                          <p className="text-gray-600 mb-2 line-clamp-2">
                            {result.snippet?.description}
                          </p>
                          <a 
                            href={result.snippet?.url} 
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            onClick={onClose}
                          >
                            {getLocalizedText('ተጨማሪ ይመልከቱ',  'View More',  language)} →
                          </a>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="bg-gray-100 px-2 py-1 rounded">
                            {getLocalizedText('ውጤት',  'Score',  language)}: {Math.round(result.score)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : query ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">
                      {getLocalizedText(
                        'ምንም ውጤት አልተገኘም',
                        'No results found',
                        'Bu\'aan hin argamne',
                        language
                      )}
                    </p>
                    <p className="text-sm mt-2">
                      {getLocalizedText(
                        'የተለያዩ ቃላትን በመጠቀም እንደገና ይሞክሩ',
                        'Try using different keywords',
                        'Jechootaa adda addaa fayyadamuun deebi\'ii yaali',
                        language
                      )}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchComponent;

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import AdvancedSearchComponent from './AdvancedSearch';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder, 
  onFocus, 
  className = "", 
  showAdvancedOnClick = true,
  showAdvancedOnFocus = true 
}) => {
  const { language } = useLanguage();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const defaultPlaceholder = getLocalizedText(
    'ፈልግ... አገልግሎቶች፣ መረጃዎች...',
    'Search services, information...',
    'Barbaadi... tajaajilaa, odeeffannoo...',
    language
  );

  const handleInputClick = (e) => {
    if (showAdvancedOnClick) {
      setShowAdvancedSearch(true);
    }
  };

  const handleInputFocus = (e) => {
    if (showAdvancedOnFocus) {
      setShowAdvancedSearch(true);
    }
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={value || ''}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          placeholder={placeholder || defaultPlaceholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
          readOnly={showAdvancedOnClick}
        />
      </div>

      {/* Advanced Search Modal */}
      <AdvancedSearchComponent 
        isOpen={showAdvancedSearch} 
        onClose={() => setShowAdvancedSearch(false)} 
      />
    </>
  );
};

export default SearchInput;

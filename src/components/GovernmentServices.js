import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { categories } from '../data/govData';

const GovernmentServices = () => {
  const { language } = useLanguage();

  const sectionTitle = {
    amharic: 'የመንግስት አገልግሎቶች',
    english: 'Government Services',
    oromo: 'Tajaajila Mootummaa'
  };

  const servicesLabel = {
    amharic: 'አገልግሎቶች',
    english: 'services',
    oromo: 'tajaajilootaa'
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">
        {getLocalizedText(sectionTitle.amharic,  sectionTitle.english,  language)}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          // Extract Amharic and English parts from the combined name
          const nameParts = category.name.split(' / ');
          const amharicName = nameParts[0] || category.name;
          const englishName = nameParts[1] || category.nameEn || nameParts[0];
          
          const displayName = language === 'am' ? amharicName : 
                             language === 'en' ? englishName : 
                             amharicName;

          return (
            <Link
              key={index}
              to="/services"
              className="block bg-white p-6 border-b-4 border-green-600 hover:border-yellow-500 transition-all shadow-sm hover:shadow-lg group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">{category.icon}</span>
                <div>
                  <h3 className="font-bold text-lg text-green-700 group-hover:text-green-800 group-hover:underline mb-2">
                    {displayName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.count} {getLocalizedText(servicesLabel.amharic,  servicesLabel.english,  language)}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default GovernmentServices;

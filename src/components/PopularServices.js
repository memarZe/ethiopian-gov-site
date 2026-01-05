import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { popularServices } from '../data/govData';

const PopularServices = () => {
  const { language } = useLanguage();

  const sectionTitle = {
    amharic: 'ታዋቂ አገልግሎቶች',
    english: 'Popular Services',
    oromo: 'Tajaajila Beekamoo'
  };
  return (
    <div className="bg-white border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          {getLocalizedText(sectionTitle.amharic,  sectionTitle.english,  language)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularServices.map((service, index) => {
            // Extract Amharic and English parts from the combined title
            const titleParts = service.title.split(' / ');
            const amharicTitle = titleParts[0] || service.title;
            const englishTitle = titleParts[1] || titleParts[0];
            
            const displayTitle = language === 'am' ? amharicTitle : 
                                language === 'en' ? englishTitle : 
                                amharicTitle;

            return (
              <Link
                key={index}
                to={service.link}
                className="block p-5 border-l-4 border-green-600 bg-gray-50 hover:bg-green-50 transition-colors shadow-sm hover:shadow-md"
              >
                <h3 className="font-bold text-green-700 hover:underline mb-2 text-lg">{displayTitle}</h3>
                <p className="text-sm text-gray-600">{service.category}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularServices;

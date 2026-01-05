import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useApi, useSearch } from '../hooks/useApi';
import { LoadingSpinner, LoadingCard, ErrorMessage } from '../components/LoadingComponents';
import { SearchInput } from '../components';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// Transform services data from Java backend format
const transformServicesData = (apiData) => {
  if (!Array.isArray(apiData)) return [];
  
  return apiData.map(service => ({
    id: service.id,
    name: service.nameEn || service.titleEn || service.name,
    nameAm: service.nameAm || service.titleAm,
    title: service.titleEn || service.nameEn || service.name,
    description: service.descriptionEn || service.shortDescription || service.description,
    descriptionAm: service.descriptionAm || service.shortDescriptionAm,
    category: service.category,
    ministry: service.ministry,
    url: service.url,
    viewCount: service.viewCount || 0,
    rating: service.rating || 0,
    isActive: service.isActive,
    isOnline: service.isOnline,
    isFeatured: service.isFeatured,
    processingTime: service.processingTime || 'Unknown',
    difficultyLevel: service.difficultyLevel || 'Medium'
  }));
};

// Transform service categories from Java backend format
const transformCategoriesData = (apiData) => {
  if (!Array.isArray(apiData)) {
    // If services data is provided instead, extract unique categories
    const categories = [...new Set(apiData.map(service => service.category))];
    return categories.map((category, index) => ({
      id: index + 1,
      name: category,
      nameEn: category,
      count: apiData.filter(service => service.category === category).length,
      icon: getCategoryIcon(category)
    }));
  }
  
  return apiData.map(category => ({
    id: category.id,
    name: category.nameEn || category.name,
    nameEn: category.nameEn || category.name,
    nameAm: category.nameAm,
    count: category.count || 0,
    icon: category.icon || getCategoryIcon(category.name)
  }));
};

// Helper function to get category icons
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'Business & Entrepreneurship': '💼',
    'Education & Training': '📚',
    'Health & Social Security': '🏥',
    'Land & Property': '🏠',
    'Agriculture & Rural Development': '🌾',
    'Transport & Infrastructure': '🚗',
    'Passport & Immigration': '🛂',
    'Tax & Revenue': '💰',
    'Justice & Law': '⚖️',
    'Employment & Labor': '👷'
  };
  return iconMap[categoryName] || '📋';
};

const Services = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { language } = useLanguage();
  const { isEditor } = useAuth();
  const navigate = useNavigate();
  
  console.log('Services component mounting/re-rendering at:', new Date().toISOString());
  
  // Force component refresh on mount
  useEffect(() => {
    console.log('Services: Component mounted - forcing fresh render');
    window.scrollTo(0, 0);
  }, []);
  
  // API calls - Use services data for both services and categories
  const { data: rawServices, loading: servicesLoading, error: servicesError } = useApi(apiService.getServices);
  const { query, setQuery, results: searchResults, loading: searchLoading } = useSearch(apiService.search);

  // Transform data from Java backend format
  const services = transformServicesData(rawServices || []);
  const categories = transformCategoriesData(rawServices || []);
  const popularServices = services.filter(service => service.viewCount > 500).slice(0, 6);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  // Filter services by selected categories
  const filteredServices = selectedCategories.length > 0 
    ? services.filter(service => {
        console.log('Filtering service:', service.name, 'Category:', service.category, 'Selected:', selectedCategories);
        return selectedCategories.includes(service.category);
      })
    : services;

  console.log('Services filtering result:', {
    totalServices: services.length,
    selectedCategories,
    filteredServicesCount: filteredServices.length,
    filteredServices: filteredServices.map(s => ({ name: s.name, category: s.category }))
  });

  if (servicesError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ErrorMessage 
            message="Failed to load services data. Please try again later." 
            retry={() => window.location.reload()} 
          />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              {getLocalizedText(
                'የመንግስት አገልግሎቶች',
                'Government Services', 
                'Tajaajila Mootummaa',
                language
              )}
            </h1>
            {/* Show Add Service button only for Admin and Editor roles */}
            {isEditor() && (
              <button
                onClick={() => navigate('/services/add')}
                className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus className="h-5 w-5" />
                {getLocalizedText(
                  'አገልግሎት ጨምር',
                  'Add Service',
                  'Tajaajila Dabaluu',
                  language
                )}
              </button>
            )}
          </div>
          <p className="text-lg md:text-xl opacity-90">
            {getLocalizedText(
              'ሁሉንም የመንግስት አገልግሎቶች በአንድ ቦታ ያግኙ',
              'Find all government services in one place',
              'Tajaajila mootummaa hunda bakka tokkotti argadhaa',
              language
            )}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="max-w-2xl">
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={getLocalizedText(
                'አገልግሎቶችን ፈልግ...',
                'Search for services...',
                'Tajaajila barbaadi...',
                language
              )}
              showAdvancedOnClick={true}
              showAdvancedOnFocus={true}
            />
            {searchLoading && (
              <div className="absolute right-3 top-3">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-4">
                {getLocalizedText(
                  'በዘርፍ አጣራ',
                  'Filter by Category',
                  'Akaakuu tahiin filannee',
                  language
                )}
              </h3>
              {servicesLoading ? (
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {categories?.map((category) => {
                    const serviceCount = services.filter(service => service.category === category.name).length;
                    return (
                      <label key={category.name} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          onChange={() => handleCategoryChange(category.name)}
                          className="mr-3 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm flex-1">
                          {category.name} ({serviceCount})
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            {/* Search Results */}
            {query && searchResults.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">
                  {getLocalizedText(
                    'የፍለጋ ውጤቶች',
                    'Search Results',
                    'Bu\'uuwwan barbaacha',
                    language
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            )}

            {/* Filtered Services */}
            {selectedCategories.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {getLocalizedText(
                      `በተመረጡ ዘርፎች አገልግሎቶች (${filteredServices.length})`,
                      `Services in Selected Categories (${filteredServices.length})`,
                      `Tajaajila akaakuu filatamaniiti (${filteredServices.length})`,
                      language
                    )}
                  </h2>
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full transition-colors"
                  >
                    {getLocalizedText('ሁሉንም አጽዳ',  'Clear All',  language)}
                  </button>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <span
                      key={category}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {category}
                      <button
                        onClick={() => handleCategoryChange(category)}
                        className="hover:bg-green-200 rounded-full p-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                {filteredServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredServices.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-800">
                      {getLocalizedText(
                        'በተመረጡ ዘርፎች ውስጥ ምንም አገልግሎት አልተገኘም።',
                        'No services found in the selected categories.',
                        'Akaakuu filataman keessatti tajaajila kamuu hin argamne.',
                        language
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedCategories.length === 0 && !query && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {getLocalizedText(
                      'ታዋቂ አገልግሎቶች',
                      'Popular Services',
                      'Tajaajila Beekamoo',
                      language
                    )}
                  </h2>
                  {servicesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <LoadingCard key={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {popularServices?.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    {getLocalizedText(
                      'ሁሉም የአገልግሎት ዘርፎች',
                      'All Service Categories',
                      'Akaakuu Tajaajila Hundaa',
                      language
                    )}
                  </h2>
                  {servicesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[...Array(8)].map((_, i) => (
                        <LoadingCard key={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {categories?.map((category) => (
                        <div
                          key={category.name}
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleCategoryChange(category.name)}
                        >
                          <div className="flex items-start gap-4">
                            <span className="text-3xl">{category.icon}</span>
                            <div>
                              <h3 className="font-bold text-green-700 mb-2">{category.name}</h3>
                              <p className="text-sm text-gray-600 mb-3">
                                {category.count || 0} {getLocalizedText(
                                  'አገልግሎቶች ይገኛሉ',
                                  'services available',
                                  'tajaajila ni jiru',
                                  language
                                )}
                              </p>
                              <button className="text-green-600 font-medium hover:underline">
                                {getLocalizedText(
                                  'አገልግሎቶችን ይመልከቱ →',
                                  'View Services →',
                                  'Tajaajila Ilaali →',
                                  language
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleAccessService = () => {
    navigate(`/services/${service.id}`);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-green-700 text-lg leading-tight">
          {getLocalizedText(service.nameAm,  service.title,  language)}
        </h3>
        {service.viewCount > 500 && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {getLocalizedText('ታዋቂ',  'Popular',  language)}
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {getLocalizedText(service.descriptionAm,  service.description,  language)}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span className="bg-gray-100 px-2 py-1 rounded">{service.category}</span>
        <span>{service.processingTime}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          👁️ {service.viewCount.toLocaleString()} {getLocalizedText('እይታዎች',  'views',  language)}
        </span>
        <button 
          onClick={handleAccessService}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm"
        >
          {getLocalizedText('አገልግሎት ተጠቀም',  'Access Service',  language)}
        </button>
      </div>
    </div>
  );
};

export default Services;

import React, { useState, useEffect } from 'react';
import { MapPin, Users, Building, ExternalLink } from 'lucide-react';
import { apiService } from '../services/api';
import { useApi, useSearch } from '../hooks/useApi';
import { LoadingSpinner, LoadingCard, ErrorMessage } from '../components/LoadingComponents';
import { SearchInput } from '../components';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { RegionsNavigationDebug } from '../debug/regions-navigation-debug';

// Initialize debugging in development
if (process.env.NODE_ENV === 'development') {
  RegionsNavigationDebug.logNavigationSequence();
}

// Transform regions data from Java backend format
const transformRegionsData = (apiData) => {
  if (!Array.isArray(apiData)) return [];
  
  return apiData.map(region => ({
    id: region.id,
    name: region.nameEn,
    nameAm: region.nameAm,
    code: region.code,
    type: region.code === 'AA' ? 'Federal City' : 'Regional State',
    typeAm: region.code === 'AA' ? 'የፌደራል ከተማ' : 'ክልላዊ መንግስት',
    population: region.population ? `${(region.population / 1000000).toFixed(1)} million` : 'N/A',
    area: region.areaSqKm ? `${region.areaSqKm.toLocaleString()} km²` : 'N/A',
    capital: region.capital,
    capitalAm: region.capitalAm,
    governor: region.governor,
    governorAm: region.governorAm,
    website: region.website || '#',
    description: region.descriptionEn || getRegionDescription(region.nameEn),
    descriptionAm: region.descriptionAm || getRegionDescriptionAm(region.nameAm),
    zones: getRegionZones(region.nameEn),
    majorServices: getRegionServices(region.nameEn),
    isActive: region.isActive
  }));
};

// Helper functions for additional region data
const getRegionDescription = (name) => {
  const descriptions = {
    'Addis Ababa': 'The capital and largest city of Ethiopia, serving as the political and commercial heart of the country.',
    'Oromia': 'The largest regional state by both area and population, known for agriculture and industry.',
    'Amhara': 'A regional state in northern Ethiopia, known for its historical sites and Lake Tana.',
    'Tigray': 'A regional state in northern Ethiopia, known for its ancient history and rock churches.',
    'Afar': 'A regional state in northeastern Ethiopia, known for its desert landscape and salt mining.',
    'Somali': 'A regional state in eastern Ethiopia, primarily inhabited by ethnic Somalis.',
    'Sidama': 'A regional state in southern Ethiopia, known for coffee production.'
  };
  return descriptions[name] || `Regional state of ${name} in Ethiopia.`;
};

const getRegionDescriptionAm = (nameAm) => {
  const descriptionsAm = {
    'አዲስ አበባ': 'የኢትዮጵያ ዋና ከተማ እና ትልቁ ከተማ ሲሆን የሀገሪቱ የፖለቲካና የንግድ ማዕከል ነው።',
    'ኦሮሚያ': 'በስፋትና በህዝብ ቁጥር ትልቁ ክልላዊ መንግስት ሲሆን በግብርናና ኢንዱስትሪ ይታወቃል።',
    'አማራ': 'በሰሜን ኢትዮጵያ የሚገኝ ክልላዊ መንግስት ሲሆን በታሪካዊ ቦታዎቹና በጣና ሃይቅ ይታወቃል።'
  };
  return descriptionsAm[nameAm] || `የ${nameAm} ክልላዊ መንግስት`;
};

const getRegionZones = (name) => {
  const zones = {
    'Addis Ababa': 10,
    'Oromia': 20,
    'Amhara': 11,
    'Tigray': 7,
    'Afar': 5,
    'Somali': 11,
    'Sidama': 4
  };
  return zones[name] || 8;
};

const getRegionServices = (name) => {
  const services = {
    'Addis Ababa': ['Federal Government', 'AU Headquarters', 'UNECA', 'Commercial Hub'],
    'Oromia': ['Agriculture', 'Mining', 'Tourism', 'Manufacturing'],
    'Amhara': ['Tourism', 'Agriculture', 'Education', 'Cultural Heritage'],
    'Tigray': ['Tourism', 'Mining', 'Agriculture', 'Cultural Sites'],
    'Afar': ['Salt Mining', 'Geothermal Energy', 'Pastoralism', 'Tourism'],
    'Somali': ['Pastoralism', 'Trade', 'Natural Gas', 'Border Services'],
    'Sidama': ['Coffee Production', 'Agriculture', 'Tourism', 'Education']
  };
  return services[name] || ['Government Services', 'Agriculture', 'Education', 'Healthcare'];
};

// Region Card Component
const RegionCard = ({ region }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {region.name}
          </h3>
          <h4 className="text-lg text-gray-600 mb-2">
            {region.nameAm}
          </h4>
          <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            {region.type}
          </span>
        </div>
        <a
          href={region.website}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <ExternalLink size={20} />
        </a>
      </div>
      
      {/* Key Information */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-600">Population</p>
          <p className="text-sm font-semibold">{region.population}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Area</p>
          <p className="text-sm font-semibold">{region.area}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Capital</p>
          <p className="text-sm font-semibold">{region.capital}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Zones</p>
          <p className="text-sm font-semibold">{region.zones}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-2 text-sm leading-relaxed">
        {region.description}
      </p>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
        {region.descriptionAm}
      </p>

      {/* Major Services */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Major Services:</h4>
        <div className="flex flex-wrap gap-2">
          {region.majorServices.map((service, serviceIndex) => (
            <span
              key={serviceIndex}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t">
        <a
          href={region.website}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors w-full justify-center"
        >
          Visit Regional Website
          <ExternalLink size={16} className="ml-2" />
        </a>
      </div>
    </div>
  </div>
);

const Regions = () => {
  const { language } = useLanguage();
  const [renderError, setRenderError] = useState(null);
  const [componentState, setComponentState] = useState('mounting');
  
  // Monitor component lifecycle for debugging
  useEffect(() => {
    setComponentState('mounted');
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🏛️ Regions component mounted');
      console.log('📍 Current pathname:', window.location.pathname);
      console.log('🌐 Current language:', language);
      
      // Enhanced debugging
      const debugInfo = {
        url: window.location.href,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        language: language,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      };
      
      console.log('🔍 Regions component debug info:', debugInfo);
      
      RegionsNavigationDebug.checkRegionsPageLoad();
      RegionsNavigationDebug.testRegionsAPI();
    }
    
    return () => {
      setComponentState('unmounting');
      if (process.env.NODE_ENV === 'development') {
        console.log('🏛️ Regions component unmounting');
      }
    };
  }, [language]);

  // API calls with enhanced error handling
  const { data: rawRegions, loading: regionsLoading, error: regionsError } = useApi(apiService.getRegions);
  const { query, setQuery, results: searchResults, loading: searchLoading } = useSearch(
    (q) => apiService.search(q, 'regions')
  );

  // Debug API state with more detail
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Regions API state update:', { 
        rawRegions: rawRegions ? { 
          length: rawRegions.length,
          firstItem: rawRegions[0],
          type: typeof rawRegions,
          isArray: Array.isArray(rawRegions)
        } : null, 
        loading: regionsLoading, 
        error: regionsError ? {
          message: regionsError.message,
          stack: regionsError.stack,
          name: regionsError.name
        } : null,
        componentState
      });
    }
  }, [rawRegions, regionsLoading, regionsError, componentState]);

  // Catch any rendering errors
  useEffect(() => {
    const handleError = (error) => {
      console.error('🚨 Regions component error:', error);
      setRenderError(error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // If we have a render error, display it
  if (renderError) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-4">Regions Page Error</h2>
            <p className="text-red-700 mb-2">An error occurred while rendering the regions page:</p>
            <pre className="text-sm text-red-600 bg-red-100 p-3 rounded overflow-x-auto">
              {renderError.message}
            </pre>
            <button
              onClick={() => {
                setRenderError(null);
                window.location.reload();
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Transform data from Java backend format
  const regions = transformRegionsData(rawRegions || []);
  const regionalStates = regions.filter(region => region.isActive !== false);

  if (regionsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ErrorMessage 
            message="Failed to load regions data. Please try again later." 
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {getLocalizedText(
              'ክልላዊ መንግስታት',
              'Regional States',
              'Mootummaawwan Naannoo',
              language
            )}
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            {getLocalizedText(
              'የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ ክልላዊ አስተዳደር',
              'Federal Democratic Republic of Ethiopia Regional Administration',
              'Bulchiinsa Naannoo Ripablikii Federaalaa Dimokraatawaa Itoophiyaa',
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
                'ክልሎችን ፈልግ...',
                'Search regions...',
                'Naannoo barbaadi...',
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Results */}
        {query && searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {searchResults.map((region) => (
                <RegionCard key={region.id} region={region} />
              ))}
            </div>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-600">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <MapPin className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Regional States</p>
                <p className="text-2xl font-bold text-gray-900">{regionalStates.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <Users className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Population</p>
                <p className="text-2xl font-bold text-gray-900">
                  {regionalStates.reduce((sum, r) => sum + (parseFloat(r.population) || 0), 0).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-600">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-4">
                <Building className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Administrative Zones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {regionalStates.reduce((sum, r) => sum + r.zones, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <div className="text-blue-600 text-xl">🗺️</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Area</p>
                <p className="text-2xl font-bold text-gray-900">1.1M km²</p>
              </div>
            </div>
          </div>
        </div>

        {/* Regions Grid */}
        {regionsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {regionalStates.map((region) => (
              <RegionCard key={region.id} region={region} />
            ))}
          </div>
        )}

        {/* Federal System Information */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            የፌደራል ስርዓት / Federal System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ethiopian Federalism</h3>
              <p className="text-gray-700 mb-4">
                Ethiopia operates under a federal system with constitutionally recognized regional states. 
                Each regional state has its own government with significant autonomy in local affairs, 
                while the federal government handles national issues such as defense, foreign policy, 
                and interstate commerce.
              </p>
              <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Constitutional federalism since 1995</li>
                <li>Ethnic-based regional boundaries</li>
                <li>Regional autonomy in local governance</li>
                <li>Shared federal and regional powers</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">የኢትዮጵያ ፌደራሊዝም</h3>
              <p className="text-gray-700 mb-4">
                ኢትዮጵያ በሕገ መንግስት የተረጋገጡ ክልላዊ መንግስታት ባሉበት የፌደራል ስርዓት ሥር ትሰራለች። 
                እያንዳንዱ ክልላዊ መንግስት በአካባቢያዊ ጉዳዮች ላይ ከፍተኛ ራስ ገዝነት ያለው የራሱ መንግስት ሲኖረው፣ 
                የፌደራል መንግስት እንደ መከላከያ፣ የውጭ ፖሊሲና የመካከለኛ ንግድ ያሉ ብሔራዊ ጉዳዮችን ይይዛል።
              </p>
              <h4 className="font-semibold text-gray-900 mb-2">ዋና ዋና ባህሪያት:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>ከ1995 ዓ.ም ጀምሮ የሕገ መንግስት ፌደራሊዝም</li>
                <li>በብሔር ላይ የተመሰረተ የክልል ወሰን</li>
                <li>በአካባቢያዊ አስተዳደር የክልል ራስ ገዝነት</li>
                <li>የተጋራ የፌደራልና የክልል ሥልጣን</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regions;

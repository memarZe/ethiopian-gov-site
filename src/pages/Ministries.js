import React from 'react';
import { ExternalLink, MapPin, Phone, Mail } from 'lucide-react';
import { apiService } from '../services/api';
import { useApi, useSearch } from '../hooks/useApi';
import { LoadingSpinner, LoadingCard, ErrorMessage } from '../components/LoadingComponents';
import { SearchInput } from '../components';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';

const Ministries = () => {
  const { language } = useLanguage();
  
  console.log('Ministries component mounting/re-rendering');
  
  // API calls
  const { data: ministries, loading: ministriesLoading, error: ministriesError } = useApi(apiService.getMinistries);
  const { query, setQuery, results: searchResults, loading: searchLoading } = useSearch(
    (q) => apiService.search(q, 'ministries')
  );

  // Static fallback data (will be replaced by API data)
  const federalMinistries = ministries || [
    {
      name: "Prime Minister's Office",
      nameAm: "የጠቅላይ ሚኒስቴር ቤት",
      description: "Central coordination of government policies and administration",
      descriptionAm: "የመንግስት ፖሊሲዎች እና አስተዳደር ማዕከላዊ ቅንጅት",
      website: "#",
      phone: "+251-11-155-0844",
      email: "info@pmo.gov.et",
      address: "Addis Ababa, Ethiopia"
    },
    {
      name: "Ministry of Finance",
      nameAm: "የፋይናንስ ሚኒስቴር",
      description: "Managing national budget, fiscal policy, and public financial management",
      descriptionAm: "ብሔራዊ በጀት፣ የፊስካል ፖሊሲ እና የህዝብ የፋይናንስ አስተዳደር",
      website: "#",
      phone: "+251-11-155-2400",
      email: "info@mof.gov.et",
      address: "Addis Ababa, Ethiopia"
    },
    {
      name: "Ministry of Trade and Regional Integration",
      nameAm: "የንግድ እና የክልላዊ ትስስር ሚኒስቴር",
      description: "Promoting trade, commerce, and regional economic integration",
      descriptionAm: "ንግድን፣ ንግድን እና የክልላዊ ኢኮኖሚያዊ ትስስርን ማበረታታት",
      website: "#",
      phone: "+251-11-518-0213",
      email: "info@mot.gov.et",
      address: "Addis Ababa, Ethiopia"
    },
    {
      name: "Ministry of Education",
      nameAm: "የትምህርት ሚኒስቴር",
      description: "Overseeing education policy, curriculum development, and educational institutions",
      descriptionAm: "የትምህርት ፖሊሲ፣ የስርዓተ ትምህርት ልማት እና የትምህርት ተቋማትን ክትትል",
      website: "#",
      phone: "+251-11-155-3133",
      email: "info@moe.gov.et",
      address: "Addis Ababa, Ethiopia"
    },
    {
      name: "Ministry of Health",
      nameAm: "የጤና ሚኒስቴር",
      description: "Public health policy, healthcare services, and medical regulation",
      descriptionAm: "የህዝብ ጤና ፖሊሲ፣ የጤና አገልግሎት እና የህክምና ቁጥጥር",
      website: "#",
      phone: "+251-11-551-7011",
      email: "info@moh.gov.et",
      address: "Addis Ababa, Ethiopia"
    },
    {
      name: "Ministry of Innovation and Technology",
      nameAm: "የፈጠራ እና ቴክኖሎጂ ሚኒስቴር",
      description: "Digital transformation, innovation policy, and technology development",
      descriptionAm: "ዲጂታል ለውጥ፣ የፈጠራ ፖሊሲ እና የቴክኖሎጂ ልማት",
      website: "#",
      phone: "+251-11-554-7089",
      email: "info@mint.gov.et",
      address: "Addis Ababa, Ethiopia"
    },
    {
      name: "Ministry of Agriculture",
      nameAm: "የግብርና ሚኒስቴር",
      description: "Agricultural development, food security, and rural development",
      descriptionAm: "የግብርና ልማት፣ የምግብ ዋስትና እና የገጠር ልማት",
      website: "#",
      phone: "+251-11-646-1040",
      email: "info@moa.gov.et",
      address: "Addis Ababa, Ethiopia"
    },
    {
      name: "Ministry of Transport and Logistics",
      nameAm: "የትራንስፖርት እና ሎጂስቲክስ ሚኒስቴር",
      description: "Transportation infrastructure, logistics, and mobility services",
      descriptionAm: "የትራንስፖርት መሠረተ ልማት፣ ሎጂስቲክስ እና የመንቀሳቀስ አገልግሎቶች",
      website: "#",
      phone: "+251-11-551-8855",
      email: "info@mot.gov.et",
      address: "Addis Ababa, Ethiopia"
    },
    {
      name: "Ministry of Justice",
      nameAm: "የፍትህ ሚኒስቴር",
      description: "Legal affairs, judicial administration, and law enforcement coordination",
      descriptionAm: "የሕግ ጉዳዮች፣ የፍትህ አስተዳደር እና የሕግ አስከባሪ ቅንጅት",
      website: "#",
      phone: "+251-11-551-2966",
      email: "info@moj.gov.et",
      address: "Addis Ababa, Ethiopia"
    }
  ];

  // Transform API data to match component expectations
  const transformMinistriesData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return null;
    
    return apiData.map(ministry => ({
      id: ministry.id,
      name: ministry.nameEn || ministry.name,
      nameAm: ministry.nameAm || ministry.nameAm,
      description: ministry.descriptionEn || `Official ministry responsible for ${ministry.nameEn?.toLowerCase()} affairs and policy`,
      descriptionAm: ministry.descriptionAm || `የ${ministry.nameAm} ሃላፊነት የሚወስድ ሚኒስቴር`,
      website: ministry.website || '#',
      phone: ministry.phone || '+251-11-XXX-XXXX',
      email: ministry.email || 'info@gov.et',
      address: ministry.address || ministry.addressAm || 'Addis Ababa, Ethiopia',
      code: ministry.code,
      shortName: ministry.shortName,
      isActive: ministry.isActive
    }));
  };

  // Use API data if available, otherwise use static data
  const transformedMinistries = transformMinistriesData(ministries);
  const displayMinistries = transformedMinistries || federalMinistries;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {getLocalizedText(
              'የፌደራል ሚኒስቴሮች',
              'Federal Ministries',
              'Ministeerota Federaalaa',
              language
            )}
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            {getLocalizedText(
              'የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ ሚኒስቴሮች ማውጫ',
              'Directory of Federal Democratic Republic of Ethiopia Ministries',
              'Galmee Ministeerota Ripablikii Federaalaa Dimokraatawaa Itoophiyaa',
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
                'ሚኒስቴሮችን ፈልግ...',
                'Search ministries...',
                'Ministeerota barbaadi...',
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
        {ministriesError && (
          <div className="mb-6">
            <ErrorMessage 
              message="Failed to load ministries data. Showing fallback data." 
              retry={() => window.location.reload()} 
            />
          </div>
        )}

        {/* Search Results */}
        {query && searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {getLocalizedText(
                'የፍለጋ ውጤቶች',
                'Search Results',
                'Bu\'uuwwan Barbaacha',
                language
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((ministry) => (
                <div key={ministry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h3 className="font-bold text-green-700 mb-2">
                      {getLocalizedText(ministry.nameAm,  ministry.name,  language)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {getLocalizedText(ministry.descriptionAm,  ministry.description,  language)}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{ministry.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{ministry.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-600">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <div className="text-green-600 text-xl">🏛️</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Ministries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ministriesLoading ? '...' : displayMinistries.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <div className="text-yellow-600 text-xl">⚡</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Digital Services</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-600">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-4">
                <div className="text-red-600 text-xl">📊</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold text-gray-900">2,340</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ministries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ministriesLoading ? (
            [...Array(8)].map((_, i) => (
              <LoadingCard key={i} />
            ))
          ) : (
            displayMinistries.map((ministry, index) => (
              <div key={ministry.id || index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {ministry.name}
                      </h3>
                      <h4 className="text-lg text-gray-600 mb-3">
                        {ministry.nameAm}
                      </h4>
                    </div>
                    <a
                      href={ministry.website || '#'}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                  
                  <p className="text-gray-700 mb-2 text-sm leading-relaxed">
                    {ministry.description}
                  </p>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {ministry.descriptionAm}
                  </p>

                  {/* Contact Information */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      {ministry.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone size={16} className="mr-2 text-gray-400" />
                      {ministry.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={16} className="mr-2 text-gray-400" />
                      {ministry.email}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-4 border-t">
                    <a
                      href={ministry.website || '#'}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Visit Website
                      <ExternalLink size={16} className="ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            የመንግስት መዋቅር / Government Structure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Executive Branch</h3>
              <p className="text-gray-700 mb-4">
                The Federal Democratic Republic of Ethiopia follows a parliamentary system with the Prime Minister 
                serving as the head of government. The Council of Ministers, comprised of various ministry leaders, 
                assists in governing the country.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Prime Minister's Office</li>
                <li>Deputy Prime Minister</li>
                <li>Federal Ministries</li>
                <li>Federal Agencies</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">የስራ አስፈፃሚ ክፍል</h3>
              <p className="text-gray-700 mb-4">
                የኢትዮጵያ ፌደራላዊ ዲሞክራሲያዊ ሪፐብሊክ ጠቅላይ ሚኒስትሩ የመንግስት ሃላፊ በሆነበት የፓርላማ ስርዓት ይከተላል። 
                የሚኒስትሮች ምክር ቤት በተለያዩ የሚኒስቴር መሪዎች የተዋቀረ ሲሆን ሀገሪቱን በማስተዳደር ላይ ይረዳል።
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>የጠቅላይ ሚኒስቴር ቤት</li>
                <li>ምክትል ጠቅላይ ሚኒስትር</li>
                <li>የፌደራል ሚኒስቴሮች</li>
                <li>የፌደራል ኤጀንሲዎች</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ministries;

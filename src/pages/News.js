import React, { useState } from 'react';
import { Calendar, FileText, Filter, Clock, Building, Tag } from 'lucide-react';
import { apiService } from '../services/api';
import { useApi, useSearch } from '../hooks/useApi';
import { LoadingSpinner, LoadingCard, ErrorMessage } from '../components/LoadingComponents';
import { SearchInput } from '../components';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';

const News = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { language } = useLanguage();

  console.log('News component mounting/re-rendering');

  // API calls
  const { data: newsData, loading: newsLoading, error: newsError } = useApi(apiService.getNews);
  const { query: searchQuery, setQuery: setSearchQuery, results: searchResults, loading: searchLoading } = useSearch(
    (q) => apiService.search(q, 'news')
  );

  // Static fallback data (will be replaced by API data)
  const staticNews = [
    {
      id: 1,
      title: 'የኢትዮጵያ አየር መንገድ አዲስ መዳረሻ ከፈተ / Ethiopian Airlines Opens New Terminal',
      date: '15 ታህሳስ 2017 / December 15, 2025',
      type: 'News',
      department: 'Ministry of Transport',
      summary: 'Ethiopian Airlines inaugurated its new state-of-the-art terminal at Bole International Airport, expanding capacity and improving passenger experience.',
      summaryAm: 'የኢትዮጵያ አየር መንገድ በቦሌ ዓለም አቀፍ አውሮፕላን ማረፊያ አዲስ ዘመናዊ ተርሚናል በመክፈት አቅሙን በማስፋፋት የተሳፋሪዎች ልምድ አሻሽሏል።'
    },
    {
      id: 2,
      title: 'የተማሪዎች ዩኒቨርሲቲ መግቢያ ውጤት ተገለጸ / University Entrance Results Announced',
      date: '12 ታህሳስ 2017 / December 12, 2025',
      type: 'Update',
      department: 'Ministry of Education',
      summary: 'The Ministry of Education announced the university entrance examination results with improved performance across all regions.',
      summaryAm: 'የትምህርት ሚኒስቴር በሁሉም ክልሎች የተሻሻለ አፈፃፀም ባለበት የዩኒቨርሲቲ መግቢያ ፈተና ውጤት አስታወቀ።'
    },
    {
      id: 3,
      title: 'አዲስ የህክምና መድሀኒት ፋብሪካ ተከፈተ / New Pharmaceutical Factory Opens',
      date: '10 ታህሳስ 2017 / December 10, 2025',
      type: 'News',
      department: 'Ministry of Health',
      summary: 'A new pharmaceutical manufacturing facility was inaugurated to increase local medicine production and reduce import dependency.',
      summaryAm: 'የአካባቢውን የመድሀኒት ምርት ለመጨመር እና የውጭ ገቢ ጥገኝነት ለመቀነስ አዲስ የመድሀኒት ማምረቻ ተቋም ተከፈተ።'
    },
    {
      id: 4,
      title: 'የመንግስት ዲጂታል ማንነት መታወቂያ ተጀመረ / Government Digital Identity Program Launched',
      date: '8 ታህሳስ 2017 / December 8, 2025',
      type: 'Policy',
      department: 'Ministry of Innovation and Technology',
      summary: 'The national digital identity program was officially launched to modernize citizen services and improve security.',
      summaryAm: 'የዜጎች አገልግሎትን ዘመናዊ ለማድረግ እና ደህንነትን ለማሻሻል ብሔራዊ ዲጂታል ማንነት መታወቂያ ፕሮግራም በይፋ ተጀመረ።'
    }
  ];

  // Transform API data to match component expectations
  const transformNewsData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return null;
    
    return apiData.map(item => ({
      id: item.id,
      title: `${item.titleAm || ''} / ${item.titleEn || ''}`.trim(),
      date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      }) : 'No date',
      type: item.type || 'News',
      department: item.department || item.ministry || 'Government',
      summary: item.contentEn || item.summaryEn || 'No summary available',
      summaryAm: item.contentAm || item.summaryAm || 'ማጠቃለያ አይገኝም'
    }));
  };

  // Use API data if available, otherwise use static data
  const transformedNewsData = transformNewsData(newsData);
  const extendedNews = transformedNewsData || staticNews;

  const filteredNews = extendedNews.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.type.toLowerCase() === selectedFilter;
    return matchesFilter;
  });

  // Show search results if searching
  const displayNews = searchQuery ? searchResults : filteredNews;

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'news': return 'bg-blue-100 text-blue-800';
      case 'policy': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {getLocalizedText(
              'ዜናዎች እና ማሳወቂያዎች',
              'News & Announcements',
              'Oduu fi Beeksisa',
              language
            )}
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            {getLocalizedText(
              'ስለ ዘመናዊ የመንግስት መልእክቶች እና ማሳወቂያዎች እንዲሁም መረጃዎችን ይቀበሉ',
              'Stay informed about the latest government updates and announcements',
              'Waa\'ee haaromsa mootummaa fi beeksisa haaraa beekuu',
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getLocalizedText(
                'ዜናዎችን እና ማሳወቂያዎችን ፈልግ...',
                'Search news and announcements...',
                'Oduu fi beeksisa barbaadi...',
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
        {newsError && (
          <div className="mb-6">
            <ErrorMessage 
              message="Failed to load news data. Showing fallback data."
              retry={() => window.location.reload()} 
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-600">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <FileText className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {getLocalizedText('ጠቅላላ ዜናዎች',  'Total Articles',  language)}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {newsLoading ? '...' : extendedNews.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Tag className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {getLocalizedText('ዜናዎች',  'News',  language)}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {newsLoading ? '...' : extendedNews.filter(item => item.type === 'News').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {getLocalizedText('ዝማኔዎች',  'Updates',  language)}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {newsLoading ? '...' : extendedNews.filter(item => item.type === 'Update').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-600">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <Building className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {getLocalizedText('ፖሊሲዎች',  'Policies',  language)}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {newsLoading ? '...' : extendedNews.filter(item => item.type === 'Policy').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {getLocalizedText('ዜናዎች አጣራ',  'Filter News',  language)}
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    selectedFilter === 'all'
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {getLocalizedText('ሁሉም ዜናዎች',  'All News',  language)}
                </button>
                <button
                  onClick={() => setSelectedFilter('policy')}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    selectedFilter === 'policy'
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {getLocalizedText('የፖሊሲ ዝማኔዎች',  'Policy Updates',  language)}
                </button>
                <button
                  onClick={() => setSelectedFilter('news')}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    selectedFilter === 'news'
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {getLocalizedText('ዜናዎች',  'News',  language)}
                </button>
                <button
                  onClick={() => setSelectedFilter('update')}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    selectedFilter === 'update'
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {getLocalizedText('ዝማኔዎች',  'Updates',  language)}
                </button>
              </div>
            </div>
          </div>

          {/* News List */}
          <div className="lg:col-span-3">
            {searchQuery && searchResults.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">
                  {getLocalizedText(
                    `የፍለጋ ውጤቶች (${searchResults.length})`,
                    `Search Results (${searchResults.length})`,
                    `Bu'uuwwan Barbaacha (${searchResults.length})`,
                    language
                  )}
                </h2>
              </div>
            )}
            
            {newsLoading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {displayNews.map((item, index) => (
                  <article
                    key={item.id || index}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <FileText className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                            {item.type}
                          </span>
                          <span className="text-sm text-gray-500">{item.department}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-green-700 cursor-pointer">
                          {getLocalizedText(
                            item.titleAm || item.title, 
                            item.titleEn || item.title, 
                            item.titleOr || item.title, 
                            language
                          )}
                        </h2>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Calendar className="w-4 h-4 mr-2" />
                          {item.date}
                        </div>
                        <p className="text-gray-600 mb-4">
                          {getLocalizedText(
                            item.summaryAm || item.summary || item.contentAm,
                            item.summaryEn || item.summary || item.contentEn,
                            item.summaryOr || item.summary,
                            language
                          ) || getLocalizedText(
                            'ይህ ዜና በቅርቡ ይወጣል',
                            'This news will be available soon',
                            'Oduun kun dhiyoo bahaa',
                            language
                          )}
                        </p>
                        <button className="text-green-600 font-medium hover:underline">
                          {getLocalizedText(
                            'ሙሉ ዜናውን ያንብቡ →',
                            'Read Full Article →',
                            'Kitaaba guutuu dubbisi →',
                            language
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-2 bg-green-600 text-white rounded">1</button>
                <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">2</button>
                <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">3</button>
                <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
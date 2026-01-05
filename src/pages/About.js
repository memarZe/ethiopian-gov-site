import React from 'react';
import { MapPin, Users, Building2, Globe, Calendar, Mountain, Coffee, Landmark } from 'lucide-react';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';
import { ErrorMessage } from '../components/LoadingComponents';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';

const About = () => {
  const { language } = useLanguage();
  
  // API call for statistics
  const { data: apiStats, loading: statsLoading, error: statsError } = useApi(apiService.getStatistics);
  
  // Static fallback data
  const stats = apiStats || [
    { 
      icon: Users, 
      label: getLocalizedText('ሕዝብ',  'Population',  language), 
      value: getLocalizedText('120+ ሚሊዮን',  '120+ Million',  language), 
      description: getLocalizedText('በአፍሪካ ሁለተኛ በሕዝብ ብዛት',  'Second most populous in Africa',  language)
    },
    { 
      icon: MapPin, 
      label: getLocalizedText('ስፋት',  'Area',  language), 
      value: '1.1M km²', 
      description: getLocalizedText('በዓለም አቀፍ ደረጃ 27ኛ የሆነ ሰፊ ሀገር',  '27th largest country globally',  language)
    },
    { 
      icon: Building2, 
      label: getLocalizedText('ክልሎች',  'Regions',  language), 
      value: getLocalizedText('11 ክልሎች',  '11 States',  language), 
      description: getLocalizedText('የፌዴራል ዲሞክራሲያዊ ሥርዓት',  'Federal democratic system',  language)
    },
    { 
      icon: Globe, 
      label: getLocalizedText('ቋንቋዎች',  'Languages',  language), 
      value: getLocalizedText('90+ ቋንቋዎች',  '90+ Languages',  language), 
      description: getLocalizedText('በጣም ሰፊ የቋንቋ ብዝሀነት',  'Rich linguistic diversity',  language)
    },
  ];

  const highlights = [
    {
      icon: Mountain,
      title: 'Cradle of Humanity',
      titleAm: 'የሰው ልጅ ቤት',
      titleOr: 'Mana Ilmaan Namaa',
      description: 'Home to some of the oldest hominid fossils, including Lucy (Dinkinesh)',
      descriptionAm: 'እንደ ሉሲ (ድንቅነሽ) ያሉ በጣም ጥንታዊ የሰው ልጅ ቅሪቶች የሚገኙበት',
      descriptionOr: 'Akka Luusii (Dinqinesh) fakkaatan lafee namaa durii argaman'
    },
    {
      icon: Calendar,
      title: 'Ancient Independence',
      titleAm: 'ጥንታዊ ነፃነት',
      titleOr: 'Bilisummaa Durii',
      description: 'Never fully colonized, maintaining sovereignty throughout history',
      descriptionAm: 'ሙሉ በሙሉ ቅኝ ተገዢ ያልሆነች፣ በታሪክ ዘመን ሉአላዊነቷን ያስጠበቀች',
      descriptionOr: 'Gonkumaa guutuu garboomtee hin beektu, seenaa keessatti walabummaa ishee eegdee'
    },
    {
      icon: Coffee,
      title: 'Origin of Coffee',
      titleAm: 'የቡና አገር',
      titleOr: 'Biyya Bunaa',
      description: 'Birthplace of coffee, discovered in the highlands of Kaffa',
      descriptionAm: 'የቡናው ሀገር፣ በካፋ ኮረብታዎች ላይ የተገኘ',
      descriptionOr: 'Iddoo bunni itti dhalatee, tulluuwwan Kafaa irratti argamee'
    },
    {
      icon: Landmark,
      title: 'Ancient Civilization',
      titleAm: 'ጥንታዊ ሥልጣኔ',
      titleOr: 'Aadaa Durii',
      description: 'Home to ancient kingdoms including Aksum, one of the great ancient civilizations',
      descriptionAm: 'እንደ አክሱም ያሉ ጥንታዊ መንግስታትን ያፈራ፣ ከታላላቅ ጥንታዊ ሥልጣኔዎች አንዱ',
      descriptionOr: 'Mootummaawwan durii akka Aksum of keessaa qabu, aadaa guddaa durii keessaa tokko'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {getLocalizedText(
              'ስለ ኢትዮጵያ',
              'About Ethiopia',
              'Waa\'ee Itoophiyaa',
              language
            )}
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            {getLocalizedText(
              'የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ - የመነሻ ምድር',
              'The Federal Democratic Republic of Ethiopia - Land of Origins',
              'Ripablikii Federaalaa Dimokraatawaa Itoophiyaa - Biyya Kalkaawwanii',
              language
            )}
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">🦁</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {getLocalizedText(
                'የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ',
                'Federal Democratic Republic of Ethiopia',
                'Ripablikii Federaalaa Dimokraatawaa Itoophiyaa',
                language
              )}
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600">
              {getLocalizedText(
                'የመነሻ ምድር፣ በአፍሪካ ቀንድ ውስጥ ጥንታዊ ባህል ከዘመናዊ እድገት ጋር የተጋበዘበት',
                'The Land of Origins, where ancient heritage meets modern progress in the Horn of Africa',
                'Biyya Jalqabaa, aadaa durii fi guddina ammayyaa walitti dhufan Gaanfa Afrikaa keessatti',
                language
              )}
            </p>
          </div>

          {/* Ethiopian Flag */}
          <div className="h-8 flex rounded-lg overflow-hidden shadow-md max-w-md mx-auto mb-12">
            <div className="flex-1 bg-green-600"></div>
            <div className="flex-1 bg-yellow-400"></div>
            <div className="flex-1 bg-red-600"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {statsError && (
            <div className="mb-6">
              <ErrorMessage 
                message="Failed to load statistics. Showing default data." 
                retry={() => window.location.reload()} 
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="p-3 bg-gray-200 rounded-lg inline-flex items-center justify-center mb-4 animate-pulse">
                    <div className="w-8 h-8 bg-gray-300 rounded" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              ))
            ) : (
              stats.map((stat, index) => {
                const IconComponent = stat.icon || Users;
                return (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="p-3 bg-green-100 rounded-lg inline-flex items-center justify-center mb-4">
                      <IconComponent className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.description}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              የኢትዮጵያ ልዩ ባህሪያት / Ethiopia's Unique Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover what makes Ethiopia a truly unique nation in Africa and the world
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {highlights.map((highlight, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <highlight.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{highlight.title}</h3>
                    <h4 className="text-lg text-gray-600 mb-3">{highlight.titleAm}</h4>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{highlight.description}</p>
                <p className="text-gray-600">{highlight.descriptionAm}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Government Structure */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              የመንግስት መዋቅር / Government Structure
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ethiopia operates as a federal democratic republic with a parliamentary system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-green-600">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Executive Branch</h3>
                <h4 className="text-md text-gray-600 mb-4">የስራ አስፈፃሚ ክፍል</h4>
                <ul className="text-gray-700 space-y-2 text-sm text-left">
                  <li>• Prime Minister (Head of Government)</li>
                  <li>• Council of Ministers</li>
                  <li>• Federal Ministries</li>
                  <li>• Regional Governments</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-yellow-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Legislative Branch</h3>
                <h4 className="text-md text-gray-600 mb-4">የህግ አውጭ ክፍል</h4>
                <ul className="text-gray-700 space-y-2 text-sm text-left">
                  <li>• House of Peoples' Representatives</li>
                  <li>• House of Federation</li>
                  <li>• Federal Parliament</li>
                  <li>• Regional Councils</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-red-600">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Landmark className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Judicial Branch</h3>
                <h4 className="text-md text-gray-600 mb-4">የፍትህ ክፍል</h4>
                <ul className="text-gray-700 space-y-2 text-sm text-left">
                  <li>• Federal Supreme Court</li>
                  <li>• Federal High Court</li>
                  <li>• Regional Courts</li>
                  <li>• Specialized Courts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ
          </h2>
          <h3 className="text-xl mb-6">Federal Democratic Republic of Ethiopia</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Capital: Addis Ababa / አዲስ አበባ
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Official Languages: Amharic, English
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Founded: Ancient times, Modern constitution: 1995
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

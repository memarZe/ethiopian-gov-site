import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { LoadingSpinner } from '../components/LoadingComponents';

const AddService = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titleAm: '',
    titleEn: '',
    descriptionAm: '',
    descriptionEn: '',
    shortDescriptionAm: '',
    shortDescriptionEn: '',
    requirementsAm: '',
    requirementsEn: '',
    processAm: '',
    processEn: '',
    category: '',
    ministry: '',
    ministryId: '',
    url: '',
    externalUrl: '',
    durationDays: '',
    feeAmount: '',
    feeCurrency: 'ETB',
    priority: 0,
    processingTime: '',
    difficultyLevel: 'Medium',
    isActive: true,
    isOnline: true,
    isFeatured: false
  });

  // State for dynamic language field display
  const [selectedLanguageView, setSelectedLanguageView] = useState('am');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Predefined categories for consistency with multilingual support
  const getCategories = (lang) => {
    const categoriesData = [
      {
        en: 'Business & Entrepreneurship',
        am: 'ንግድ እና ስራ ፈጠራ'
      },
      {
        en: 'Education & Training',
        am: 'ትምህርት እና ስልጠና'
      },
      {
        en: 'Health & Social Security',
        am: 'ጤና እና ማህበራዊ ዋስትና'
      },
      {
        en: 'Land & Property',
        am: 'መሬት እና ንብረት'
      },
      {
        en: 'Agriculture & Rural Development',
        am: 'ግብርና እና የገጠር ልማት'
      },
      {
        en: 'Transport & Infrastructure',
        am: 'መጓጓዣ እና መሠረተ ልማት'
      },
      {
        en: 'Passport & Immigration',
        am: 'ፓስፖርት እና ስደተኝነት'
      },
      {
        en: 'Tax & Revenue',
        am: 'ግብር እና ገቢ'
      },
      {
        en: 'Justice & Law',
        am: 'ፍትህ እና ህግ'
      },
      {
        en: 'Employment & Labor',
        am: 'ስራ እና ሰራተኛ'
      }
    ];
    
    return categoriesData.map(cat => ({
      value: cat.en, // Always use English as value for database consistency
      label: lang === 'am' ? cat.am : cat.en
    }));
  };

  // Predefined ministries with multilingual support
  const getMinistries = (lang) => {
    const ministriesData = [
      {
        en: 'Ministry of Health',
        am: 'የጤና ሚኒስቴር'
      },
      {
        en: 'Ministry of Education',
        am: 'የትምህርት ሚኒስቴር'
      },
      {
        en: 'Ministry of Justice',
        am: 'የፍትህ ሚኒስቴር'
      },
      {
        en: 'Ministry of Agriculture',
        am: 'የግብርና ሚኒስቴር'
      },
      {
        en: 'Ministry of Finance',
        am: 'የፋይናንስ ሚኒስቴር'
      },
      {
        en: 'Ministry of Transport',
        am: 'የመጓጓዣ ሚኒስቴር'
      },
      {
        en: 'Ministry of Labor',
        am: 'የሰራተኛ ሚኒስቴር'
      },
      {
        en: 'Ministry of Interior',
        am: 'የውስጥ ሚኒስቴር'
      },
      {
        en: 'Other',
        am: 'ሌላ'
      }
    ];
    
    return ministriesData.map(ministry => ({
      value: ministry.en, // Always use English as value for database consistency
      label: lang === 'am' ? ministry.am : ministry.en
    }));
  };

  // Difficulty levels with multilingual support
  const getDifficultyLevels = (lang) => {
    const difficultyData = [
      {
        en: 'Easy',
        am: 'ቀላል'
      },
      {
        en: 'Medium',
        am: 'መካከለኛ'
      },
      {
        en: 'Hard',
        am: 'ከባድ'
      }
    ];
    
    return difficultyData.map(level => ({
      value: level.en, // Always use English as value for database consistency
      label: lang === 'am' ? level.am : level.en
    }));
  };

  // Processing times with multilingual support
  const getProcessingTimes = (lang) => {
    const processingData = [
      {
        en: 'Immediate',
        am: 'ወዲያውኑ'
      },
      {
        en: 'Within 1 day',
        am: 'በ1 ቀን ውስጥ'
      },
      {
        en: 'Within 1 week',
        am: 'በ1 ሳምንት ውስጥ'
      },
      {
        en: 'Within 1 month',
        am: 'በ1 ወር ውስጥ'
      },
      {
        en: '1-3 months',
        am: '1-3 ወሮች'
      },
      {
        en: 'More than 3 months',
        am: 'ከ3 ወር በላይ'
      }
    ];
    
    return processingData.map(time => ({
      value: time.en, // Always use English as value for database consistency
      label: lang === 'am' ? time.am : time.en
    }));
  };

  // Helper function to get language labels and placeholders
  const getLanguageConfig = (lang) => {
    const configs = {
      am: {
        label: 'አማርኛ (Amharic)',
        titleLabel: 'ርዕስ (አማርኛ)',
        titlePlaceholder: 'የአገልግሎቱ ርዕስ በአማርኛ',
        descLabel: 'መግለጫ (አማርኛ)',
        descPlaceholder: 'የአገልግሎቱ ዝርዝር መግለጫ በአማርኛ',
        reqLabel: 'መስፈርቶች (አማርኛ)',
        reqPlaceholder: 'የአገልግሎቱን ለማግኘት የሚያስፈልጉ መስፈርቶች በአማርኛ ዝርዝር...',
        processLabel: 'ሂደት (አማርኛ)',
        processPlaceholder: 'የአገልግሎቱን ለማግኘት የሚደረጉ ደረጃዎች በአማርኛ ዝርዝር...'
      },
      en: {
        label: 'English',
        titleLabel: 'Title (English)',
        titlePlaceholder: 'Service title in English',
        descLabel: 'Description (English)',
        descPlaceholder: 'Detailed service description in English',
        reqLabel: 'Requirements (English)',
        reqPlaceholder: 'List of requirements needed to access this service...',
        processLabel: 'Process (English)',
        processPlaceholder: 'Step-by-step process to access this service...'
      }
    };
    return configs[lang];
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Selected language view is required
    if (!selectedLanguageView) {
      newErrors.selectedLanguageView = getLocalizedText(
        'ቋንቋ መምረጥ አለበት',
        'Language must be selected',
        language
      );
    }

    // Title is required for selected language
    if (selectedLanguageView) {
      const titleField = `title${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`;
      if (!formData[titleField]?.trim()) {
        newErrors[titleField] = getLocalizedText(
          'ርዕስ ሲሰጥ አይጣም',
          'Title is required',
          language
        );
      }
    }
    
    // Description is required for selected language
    if (selectedLanguageView) {
      const descField = `description${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`;
      if (!formData[descField]?.trim()) {
        newErrors[descField] = getLocalizedText(
          'መግለጫ ሲሰጥ አይጣም',
          'Description is required',
          language
        );
      }
    }

    // Category is required
    if (!formData.category?.trim()) {
      newErrors.category = getLocalizedText(
        'ምድብ መምረጥ አለበት',
        'Category must be selected',
        language
      );
    }

    // Ministry is required
    if (!formData.ministry?.trim()) {
      newErrors.ministry = getLocalizedText(
        'ሚኒስቴር መምረጥ አለበት',
        'Ministry must be selected',
        language
      );
    }

    // Processing time is required
    if (!formData.processingTime?.trim()) {
      newErrors.processingTime = getLocalizedText(
        'የሂደት ጊዜ መምረጥ አለበት',
        'Processing time must be selected',
        language
      );
    }

    // Duration days validation (if provided)
    if (formData.durationDays && (isNaN(formData.durationDays) || parseInt(formData.durationDays) < 0)) {
      newErrors.durationDays = getLocalizedText(
        'ትክክለኛ የቀን ብዛት ያስገቡ',
        'Please enter a valid number of days',
        language
      );
    }

    // Fee amount validation (if provided)
    if (formData.feeAmount && (isNaN(formData.feeAmount) || parseFloat(formData.feeAmount) < 0)) {
      newErrors.feeAmount = getLocalizedText(
        'ትክክለኛ የክፍያ መጠን ያስገቡ',
        'Please enter a valid fee amount',
        language
      );
    }

    // URL validation (if provided)
    if (formData.url?.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlPattern.test(formData.url.trim())) {
        newErrors.url = getLocalizedText(
          'ትክክለኛ የድር አድራሻ ያስገቡ',
          'Please enter a valid URL',
          language
        );
      }
    }

    // External URL validation (if provided)
    if (formData.externalUrl?.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlPattern.test(formData.externalUrl.trim())) {
        newErrors.externalUrl = getLocalizedText(
          'ትክክለኛ የውጫዊ ድር አድራሻ ያስገቡ',
          'Please enter a valid external URL',
          language
        );
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate unique service code based on category and timestamp
      const generateServiceCode = () => {
        const categoryCode = formData.category.toUpperCase().substring(0, 3);
        const timestamp = Date.now().toString().slice(-6);
        return `${categoryCode}${timestamp}`;
      };

      // Prepare data for API submission
      const serviceData = {
        code: generateServiceCode(),
        title_am: formData.titleAm,
        title_en: formData.titleEn,
        description_am: formData.descriptionAm,
        description_en: formData.descriptionEn,
        requirements_am: formData.requirementsAm,
        requirements_en: formData.requirementsEn,
        process_am: formData.processAm,
        process_en: formData.processEn,
        category: formData.category,
        ministry: formData.ministry,
        ministry_id: formData.ministryId || null,
        url: formData.url || null,
        external_url: formData.externalUrl || null,
        duration_days: formData.durationDays ? parseInt(formData.durationDays) : null,
        fee_amount: formData.feeAmount ? parseFloat(formData.feeAmount) : null,
        fee_currency: formData.feeCurrency,
        priority: parseInt(formData.priority) || 0,
        is_active: formData.isActive,
        is_online: formData.isOnline,
        is_featured: formData.isFeatured,
        view_count: 0,
        rating: 0.00,
        rating_count: 0,
        // Legacy fields for backward compatibility
        nameAm: formData.titleAm,
        nameEn: formData.titleEn,
        titleAm: formData.titleAm,
        titleEn: formData.titleEn,
        descriptionAm: formData.descriptionAm,
        descriptionEn: formData.descriptionEn,
        processingTime: formData.processingTime,
        difficultyLevel: formData.difficultyLevel,
        isActive: formData.isActive,
        isOnline: formData.isOnline,
        isFeatured: formData.isFeatured,
        viewCount: 0
      };

      await apiService.post('/services', serviceData);
      
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/services');
      }, 2000);
    } catch (error) {
      console.error('Error creating service:', error);
      setErrors({ 
        submit: getLocalizedText(
          'አገልግሎት ሲፈጠር ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።',
          'Error creating service. Please try again.',
          language
        )
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/services')}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold">
              {getLocalizedText(
                'አዲስ አገልግሎት ጨምር',
                'Add New Service',
                language
              )}
            </h1>
          </div>
          <p className="text-lg md:text-xl opacity-90">
            {getLocalizedText(
              'አዲስ የመንግስት አገልግሎት በሁሉም ቋንቋዎች ይፍጠሩ',
              'Create a new government service in all languages',
              language
            )}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Success Message */}
          {submitSuccess && (
            <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-green-800">
                {getLocalizedText(
                  'አገልግሎት በተሳካ ሁኔታ ተፈጥሯል! ወደ አገልግሎቶች ገጽ በቅርቡ ይሄዳሉ...',
                  'Service created successfully! Redirecting to services page...',
                  language
                )}
              </span>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <span className="text-red-800">{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {getLocalizedText(
                  'መሰረታዊ መረጃ',
                  'Basic Information',
                  selectedLanguageView || language
                )}
              </h3>
              
              <div className="max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getLocalizedText(
                      'ቋንቋ ይምረጡ',
                      'Select Language',
                      selectedLanguageView || language
                    )} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedLanguageView}
                    onChange={(e) => setSelectedLanguageView(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.selectedLanguageView ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">
                      {getLocalizedText('ቋንቋ ይምረጡ', 'Select Language', selectedLanguageView || language)}
                    </option>
                    <option value="am">🇪🇹 አማርኛ (Amharic)</option>
                    <option value="en">🇬🇧 English</option>
                  </select>
                  {errors.selectedLanguageView && (
                    <p className="text-red-500 text-xs mt-1">{errors.selectedLanguageView}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {getLocalizedText(
                      'የተመረጠው ቋንቋ የሚታዩ መስኮችን ይወስናል',
                      'Selected language determines which fields are shown',
                      selectedLanguageView || language
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Title Fields - Show only selected language */}
            {selectedLanguageView && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {getLocalizedText(
                    'አገልግሎት ርዕስ',
                    'Service Title',
                    selectedLanguageView || language
                  )}
                  <span className="text-sm text-blue-600 ml-2 font-normal">
                    ({selectedLanguageView === 'am' ? 'አማርኛ' : 'English'})
                  </span>
                </h3>
                
                <div className="max-w-2xl">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedLanguageView === 'am' ? (
                      getLocalizedText('ርዕስ (አማርኛ)', 'Title (Amharic)', selectedLanguageView)
                    ) : (
                      getLocalizedText('ርዕስ (እንግሊዝኛ)', 'Title (English)', selectedLanguageView)
                    )}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name={`title${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`}
                    value={formData[`title${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`]}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors[`title${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={selectedLanguageView === 'am' ? 
                      getLocalizedText('የአገልግሎቱ ርዕስ በአማርኛ', 'Service title in Amharic', selectedLanguageView) :
                      getLocalizedText('የአገልግሎቱ ርዕስ በእንግሊዝኛ', 'Service title in English', selectedLanguageView)
                    }
                    required
                  />
                  {errors[`title${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`title${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`]}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Description Fields - Show only selected language */}
            {selectedLanguageView && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {getLocalizedText(
                    'የአገልግሎት መግለጫ',
                    'Service Description',
                    selectedLanguageView || language
                  )}
                  <span className="text-sm text-blue-600 ml-2 font-normal">
                    ({selectedLanguageView === 'am' ? 'አማርኛ' : 'English'})
                  </span>
                </h3>
                
                <div className="max-w-4xl">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedLanguageView === 'am' ? (
                      getLocalizedText('መግለጫ (አማርኛ)', 'Description (Amharic)', selectedLanguageView)
                    ) : (
                      getLocalizedText('መግለጫ (እንግሊዝኛ)', 'Description (English)', selectedLanguageView)
                    )}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name={`description${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`}
                    value={formData[`description${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`]}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors[`description${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={selectedLanguageView === 'am' ?
                      getLocalizedText('የአገልግሎቱ ዝርዝር መግለጫ በአማርኛ', 'Detailed service description in Amharic', selectedLanguageView) :
                      getLocalizedText('የአገልግሎቱ ዝርዝር መግለጫ በእንግሊዝኛ', 'Detailed service description in English', selectedLanguageView)
                    }
                    required
                  />
                  {errors[`description${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`description${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`]}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Short Description Fields - Show only selected language */}
            {selectedLanguageView && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {getLocalizedText(
                    'አጭር መግለጫ (አማራጭ)',
                    'Short Description (Optional)',
                    selectedLanguageView || language
                  )}
                  <span className="text-sm text-blue-600 ml-2 font-normal">
                    ({selectedLanguageView === 'am' ? 'አማርኛ' : 'English'})
                  </span>
                </h3>
                
                <div className="max-w-2xl">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedLanguageView === 'am' ? (
                      getLocalizedText('አጭር መግለጫ (አማርኛ)', 'Short Description (Amharic)', selectedLanguageView)
                    ) : (
                      getLocalizedText('አጭር መግለጫ (እንግሊዝኛ)', 'Short Description (English)', selectedLanguageView)
                    )}
                  </label>
                  <input
                    type="text"
                    name={`shortDescription${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`}
                    value={formData[`shortDescription${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={selectedLanguageView === 'am' ? 
                      getLocalizedText('አጭር መግለጫ በአማርኛ', 'Brief service summary in Amharic', selectedLanguageView) :
                      getLocalizedText('አጭር መግለጫ በእንግሊዝኛ', 'Brief service summary in English', selectedLanguageView)
                    }
                  />
                </div>
              </div>
            )}

            {/* Requirements Fields - Controlled by Main Language Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {getLocalizedText(
                  'የአገልግሎት መስፈርቶች',
                  'Service Requirements',
                  selectedLanguageView || language
                )}
                <span className="text-sm text-blue-600 ml-2 font-normal">
                  ({getLanguageConfig(selectedLanguageView).label})
                </span>
              </h3>
              
              {/* Single Dynamic Requirements Field */}
              {(selectedLanguageView === 'am' || selectedLanguageView === 'en') && (
                <div className="max-w-4xl">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText(
                      `መስፈርቶች (${selectedLanguageView === 'am' ? 'አማርኛ' : 'English'})`,
                      `Requirements (${selectedLanguageView === 'am' ? 'Amharic' : 'English'})`,
                      selectedLanguageView
                    )}
                  </label>
                  <textarea
                    name={`requirements${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`}
                    value={formData[`requirements${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`]}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={getLocalizedText(
                      selectedLanguageView === 'am' ? 'የአገልግሎቱን ለማግኘት የሚያስፈልጉ መስፈርቶች በአማርኛ ዝርዝር...' : 'List of requirements needed to access this service...',
                      selectedLanguageView === 'am' ? 'List of requirements needed to access this service in Amharic...' : 'List of requirements needed to access this service...',
                      selectedLanguageView
                    )}
                  />
                </div>
              )}
            </div>

            {/* Process Fields - Controlled by Main Language Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {getLocalizedText(
                  'የአገልግሎት ሂደት',
                  'Service Process',
                  selectedLanguageView || language
                )}
                <span className="text-sm text-blue-600 ml-2 font-normal">
                  ({getLanguageConfig(selectedLanguageView).label})
                </span>
              </h3>
              
              {/* Single Dynamic Process Field */}
              {(selectedLanguageView === 'am' || selectedLanguageView === 'en') && (
                <div className="max-w-4xl">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText(
                      `ሂደት (${selectedLanguageView === 'am' ? 'አማርኛ' : 'English'})`,
                      `Process (${selectedLanguageView === 'am' ? 'Amharic' : 'English'})`,
                      selectedLanguageView
                    )}
                  </label>
                  <textarea
                    name={`process${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`}
                    value={formData[`process${selectedLanguageView.charAt(0).toUpperCase()}${selectedLanguageView.slice(1)}`]}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={getLocalizedText(
                      selectedLanguageView === 'am' ? 'የአገልግሎቱን ለማግኘት የሚደረጉ ደረጃዎች በአማርኛ ዝርዝር...' : 'Step-by-step process to access this service...',
                      selectedLanguageView === 'am' ? 'Step-by-step process to access this service in Amharic...' : 'Step-by-step process to access this service...',
                      selectedLanguageView
                    )}
                  />
                </div>
              )}
            </div>

            {/* Service Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {getLocalizedText(
                  'የአገልግሎት ዝርዝሮች',
                  'Service Details',
                  selectedLanguageView || language
                )}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ምድብ',  'Category', selectedLanguageView || language)} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">
                      {getLocalizedText('ምድብ ይምረጡ',  'Select Category', selectedLanguageView || language)}
                    </option>
                    {getCategories(selectedLanguageView || language).map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ሚኒስቴር',  'Ministry', selectedLanguageView || language)} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="ministry"
                    value={formData.ministry}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.ministry ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">
                      {getLocalizedText('ሚኒስቴር ይምረጡ',  'Select Ministry', selectedLanguageView || language)}
                    </option>
                    {getMinistries(selectedLanguageView || language).map(min => (
                      <option key={min.value} value={min.value}>{min.label}</option>
                    ))}
                  </select>
                  {errors.ministry && <p className="text-red-500 text-xs mt-1">{errors.ministry}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('የሂደት ጊዜ',  'Processing Time', selectedLanguageView || language)} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="processingTime"
                    value={formData.processingTime}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.processingTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">
                      {getLocalizedText('ጊዜ ይምረጡ',  'Select Time', selectedLanguageView || language)}
                    </option>
                    {getProcessingTimes(selectedLanguageView || language).map(time => (
                      <option key={time.value} value={time.value}>{time.label}</option>
                    ))}
                  </select>
                  {errors.processingTime && <p className="text-red-500 text-xs mt-1">{errors.processingTime}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ይቅርታ ደረጃ',  'Difficulty Level', selectedLanguageView || language)}
                  </label>
                  <select
                    name="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {getDifficultyLevels(selectedLanguageView || language).map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('የድር አድራሻ (URL)',  'Service URL', selectedLanguageView || language)}
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.url ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://example.gov.et/service"
                  />
                  {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ውጫዊ ድር አድራሻ',  'External URL', selectedLanguageView || language)}
                  </label>
                  <input
                    type="url"
                    name="externalUrl"
                    value={formData.externalUrl}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.externalUrl ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://external-service.gov.et"
                  />
                  {errors.externalUrl && <p className="text-red-500 text-xs mt-1">{errors.externalUrl}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ቀናት ርቀት',  'Duration (Days)', selectedLanguageView || language)}
                  </label>
                  <input
                    type="number"
                    name="durationDays"
                    value={formData.durationDays}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.durationDays ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="7"
                  />
                  {errors.durationDays && <p className="text-red-500 text-xs mt-1">{errors.durationDays}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {getLocalizedText('የአገልግሎቱ የሚፈጅ ቀናት',  'Service processing days', selectedLanguageView || language)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ክፍያ መጠን',  'Fee Amount', selectedLanguageView || language)}
                  </label>
                  <input
                    type="number"
                    name="feeAmount"
                    value={formData.feeAmount}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.feeAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.feeAmount && <p className="text-red-500 text-xs mt-1">{errors.feeAmount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ምንዛሬ',  'Currency', selectedLanguageView || language)}
                  </label>
                  <select
                    name="feeCurrency"
                    value={formData.feeCurrency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="ETB">ብር (ETB)</option>
                    <option value="USD">ዶላር (USD)</option>
                    <option value="EUR">ዩሮ (EUR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('የሚኒስቴር መለያ',  'Ministry ID', selectedLanguageView || language)}
                  </label>
                  <input
                    type="text"
                    name="ministryId"
                    value={formData.ministryId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="MIN001"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {getLocalizedText('የሚኒስቴር መለያ ቁጥር',  'Ministry reference ID', selectedLanguageView || language)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ቅድሚያ ደረጃ',  'Priority Level', selectedLanguageView || language)}
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="0">{getLocalizedText('መደበኛ',  'Normal', selectedLanguageView || language)}</option>
                    <option value="1">{getLocalizedText('ዝቅተኛ',  'Low', selectedLanguageView || language)}</option>
                    <option value="2">{getLocalizedText('መካከለኛ',  'Medium', selectedLanguageView || language)}</option>
                    <option value="3">{getLocalizedText('ከፍተኛ',  'High', selectedLanguageView || language)}</option>
                    <option value="4">{getLocalizedText('በጣም አስፈላጊ',  'Critical', selectedLanguageView || language)}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Service Flags */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {getLocalizedText('የአገልግሎት ሁኔታ',  'Service Status', selectedLanguageView || language)}
              </h3>
              
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">
                    {getLocalizedText('ንቁ',  'Active', selectedLanguageView || language)}
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isOnline"
                    checked={formData.isOnline}
                    onChange={handleInputChange}
                    className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">
                    {getLocalizedText('የመስመር ላይ አገልግሎት',  'Online Service', selectedLanguageView || language)}
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">
                    {getLocalizedText('ተለይቶ የሚቀርብ',  'Featured Service', selectedLanguageView || language)}
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/services')}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {getLocalizedText('ሰረዝ',  'Cancel', selectedLanguageView || language)}
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">
                      {getLocalizedText('እየተሰራ ነው...',  'Saving...', selectedLanguageView || language)}
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {getLocalizedText('አገልግሎት አስቀምጥ',  'Save Service', selectedLanguageView || language)}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddService;

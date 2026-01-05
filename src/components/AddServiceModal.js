// Add Service Component - Multilingual Service Creation Form
// የአገልግሎት መጨመር ክፍል - ባለብዙ ቋንቋ የአገልግሎት መፍጠሪያ ቅጽ

import React, { useState } from 'react';
import { 
  Plus, 
  Save, 
  X, 
  Globe, 
  Building2, 
  FileText, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';

const AddServiceModal = ({ isOpen, onClose, onServiceAdded }) => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    titleEn: '',
    titleAm: '',
    titleOr: '',
    descriptionEn: '',
    descriptionAm: '',
    descriptionOr: '',
    shortDescriptionEn: '',
    shortDescriptionAm: '',
    shortDescriptionOr: '',
    category: '',
    ministry: '',
    url: '',
    requirementsEn: '',
    requirementsAm: '',
    requirementsOr: '',
    stepsEn: '',
    stepsAm: '',
    stepsOr: '',
    fees: '',
    processingTime: '',
    difficultyLevel: 'Medium',
    isOnline: false,
    isDigital: false,
    isFeatured: false,
    primaryLanguage: 'am' // Language for primary input
  });

  // Predefined options
  const categories = [
    'Passport & Immigration',
    'Business & Entrepreneurship', 
    'Tax & Revenue',
    'Land & Property',
    'Health & Social Security',
    'Transport & Infrastructure',
    'Education & Training',
    'Legal & Justice',
    'Agriculture & Environment'
  ];

  const ministries = [
    'Ministry of Foreign Affairs',
    'Ministry of Trade and Regional Integration',
    'Ministry of Finance',
    'Ministry of Education',
    'Ministry of Health',
    'Ministry of Transport and Communications',
    'Ministry of Agriculture',
    'Ministry of Justice',
    'Prime Minister\'s Office'
  ];

  const difficultyLevels = [
    { value: 'Easy', label: { am: 'ቀላል', en: 'Easy', or: 'Salphaa' } },
    { value: 'Medium', label: { am: 'መካከለኛ', en: 'Medium', or: 'Gidduu' } },
    { value: 'Hard', label: { am: 'አስቸጋሪ', en: 'Hard', or: 'Rakkisaa' } }
  ];

  const processingTimes = [
    '1-2 days',
    '3-5 days', 
    '1-2 weeks',
    '2-4 weeks',
    '1-2 months',
    'Unknown'
  ];

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Required fields based on primary language
    const primaryLang = formData.primaryLanguage;
    const titleField = `title${primaryLang.charAt(0).toUpperCase() + primaryLang.slice(1)}`;
    const descField = `description${primaryLang.charAt(0).toUpperCase() + primaryLang.slice(1)}`;

    if (!formData.code.trim()) {
      newErrors.code = getLocalizedText('የአገልግሎት ኮድ ያስፈልጋል',  'Service code is required',  language);
    }

    if (!formData[titleField]?.trim()) {
      newErrors[titleField] = getLocalizedText('አርእስት ያስፈልጋል',  'Title is required',  language);
    }

    if (!formData[descField]?.trim()) {
      newErrors[descField] = getLocalizedText('መግለጫ ያስፈልጋል',  'Description is required',  language);
    }

    if (!formData.category) {
      newErrors.category = getLocalizedText('ምድብ ይምረጡ',  'Please select a category',  language);
    }

    if (!formData.ministry) {
      newErrors.ministry = getLocalizedText('ሚኒስቴር ይምረጡ',  'Please select a ministry',  language);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare data for API
      const serviceData = {
        code: formData.code.trim().toUpperCase(),
        titleEn: formData.titleEn?.trim() || null,
        titleAm: formData.titleAm?.trim() || null,
        titleOr: formData.titleOr?.trim() || null,
        descriptionEn: formData.descriptionEn?.trim() || null,
        descriptionAm: formData.descriptionAm?.trim() || null,
        descriptionOr: formData.descriptionOr?.trim() || null,
        shortDescriptionEn: formData.shortDescriptionEn?.trim() || null,
        shortDescriptionAm: formData.shortDescriptionAm?.trim() || null,
        shortDescriptionOr: formData.shortDescriptionOr?.trim() || null,
        category: formData.category,
        ministry: formData.ministry,
        url: formData.url?.trim() || `/services/${formData.code.toLowerCase()}`,
        requirementsEn: formData.requirementsEn?.trim() || null,
        requirementsAm: formData.requirementsAm?.trim() || null,
        requirementsOr: formData.requirementsOr?.trim() || null,
        stepsEn: formData.stepsEn?.trim() || null,
        stepsAm: formData.stepsAm?.trim() || null,
        stepsOr: formData.stepsOr?.trim() || null,
        fees: formData.fees?.trim() || null,
        processingTime: formData.processingTime || 'Unknown',
        difficultyLevel: formData.difficultyLevel,
        isOnline: formData.isOnline,
        isDigital: formData.isDigital,
        isFeatured: formData.isFeatured,
        isActive: true,
        viewCount: 0,
        rating: 0.0
      };

      // Make API call to add service
      const response = await fetch('http://localhost:8080/api/v1/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const result = await response.json();
      console.log('Service added successfully:', result);

      setSubmitStatus('success');
      
      // Notify parent component
      if (onServiceAdded) {
        onServiceAdded(result);
      }

      // Auto-close after success
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error adding service:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      code: '',
      titleEn: '',
      titleAm: '',
      titleOr: '',
      descriptionEn: '',
      descriptionAm: '',
      descriptionOr: '',
      shortDescriptionEn: '',
      shortDescriptionAm: '',
      shortDescriptionOr: '',
      category: '',
      ministry: '',
      url: '',
      requirementsEn: '',
      requirementsAm: '',
      requirementsOr: '',
      stepsEn: '',
      stepsAm: '',
      stepsOr: '',
      fees: '',
      processingTime: '',
      difficultyLevel: 'Medium',
      isOnline: false,
      isDigital: false,
      isFeatured: false,
      primaryLanguage: 'am'
    });
    setErrors({});
    setSubmitStatus(null);
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-green-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Plus className="w-6 h-6" />
            <h2 className="text-2xl font-bold">
              {getLocalizedText(
                'አዲስ አገልግሎት መጨመር',
                'Add New Service',
                'Tajaajila Haaraa Dabali',
                language
              )}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="text-white hover:bg-green-700 p-2 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          
          {/* Language Selection */}
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              {getLocalizedText(
                'ዋና ቋንቋ ይምረጡ',
                'Select Primary Language',
                'Afaan Jalqabaa Filadhu',
                language
              )}
            </label>
            <select
              value={formData.primaryLanguage}
              onChange={(e) => handleInputChange('primaryLanguage', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="am">አማርኛ (Amharic)</option>
              <option value="en">English</option>
              <option value="or">Afaan Oromoo (Oromo)</option>
            </select>
            <p className="text-sm text-gray-600 mt-2">
              {getLocalizedText(
                'በዋናነት የሚጠቀሙትን ቋንቋ ይምረጡ። ሌሎች ቋንቋዎች አማራጭ ናቸው።',
                'Choose the primary language for data entry. Other languages are optional.',
                'Afaan itti fayyadamtan jalqabaa filadhu. Afaanota biroon filmaata.',
                language
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Service Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getLocalizedText('የአገልግሎት ኮድ',  'Service Code',  language)} *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  placeholder="SRV001"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.code}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getLocalizedText('ምድብ',  'Category',  language)} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">
                    {getLocalizedText('ምድብ ይምረጡ',  'Select Category',  language)}
                  </option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            {/* Ministry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                {getLocalizedText('ሚኒስቴር',  'Ministry',  language)} *
              </label>
              <select
                value={formData.ministry}
                onChange={(e) => handleInputChange('ministry', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.ministry ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">
                  {getLocalizedText('ሚኒስቴር ይምረጡ',  'Select Ministry',  language)}
                </option>
                {ministries.map(ministry => (
                  <option key={ministry} value={ministry}>{ministry}</option>
                ))}
              </select>
              {errors.ministry && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.ministry}
                </p>
              )}
            </div>

            {/* Titles Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {getLocalizedText('አገልግሎት አርዕስቶች',  'Service Titles',  language)}
              </h3>
              
              <div className="space-y-4">
                {/* Primary Language Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.primaryLanguage === 'am' && 'አማርኛ አርዕስት *'}
                    {formData.primaryLanguage === 'en' && 'English Title *'}
                  </label>
                  <input
                    type="text"
                    value={formData[`title${formData.primaryLanguage.charAt(0).toUpperCase() + formData.primaryLanguage.slice(1)}`]}
                    onChange={(e) => handleInputChange(`title${formData.primaryLanguage.charAt(0).toUpperCase() + formData.primaryLanguage.slice(1)}`, e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors[`title${formData.primaryLanguage.charAt(0).toUpperCase() + formData.primaryLanguage.slice(1)}`] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[`title${formData.primaryLanguage.charAt(0).toUpperCase() + formData.primaryLanguage.slice(1)}`] && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors[`title${formData.primaryLanguage.charAt(0).toUpperCase() + formData.primaryLanguage.slice(1)}`]}
                    </p>
                  )}
                </div>

                {/* Other Language Titles */}
                {formData.primaryLanguage !== 'am' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      አማርኛ አርዕስት (አማራጭ)
                    </label>
                    <input
                      type="text"
                      value={formData.titleAm}
                      onChange={(e) => handleInputChange('titleAm', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                )}

                {formData.primaryLanguage !== 'en' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      English Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => handleInputChange('titleEn', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Descriptions Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                {getLocalizedText('አገልግሎት መግለጫዎች',  'Service Descriptions',  language)}
              </h3>
              
              <div className="space-y-4">
                {/* Primary Language Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.primaryLanguage === 'am' && 'ዝርዝር መግለጫ (አማርኛ) *'}
                    {formData.primaryLanguage === 'en' && 'Detailed Description (English) *'}
                  </label>
                  <textarea
                    rows={4}
                    value={formData[`description${formData.primaryLanguage.charAt(0).toUpperCase() + formData.primaryLanguage.slice(1)}`]}
                    onChange={(e) => handleInputChange(`description${formData.primaryLanguage.charAt(0).toUpperCase() + formData.primaryLanguage.slice(1)}`, e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors[`description${formData.primaryLanguage.charAt(0).toUpperCase() + formData.primaryLanguage.slice(1)}`] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[`description${formData.primaryLanguage.charAt(0).toUpperCase() + formData.primaryLanguage.slice(1)}`] && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors[`description${formData.primaryLanguage.charAt(0).toUpperCase() + formData.primaryLanguage.slice(1)}`]}
                    </p>
                  )}
                </div>

                {/* Short Description in Primary Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.primaryLanguage === 'am' && 'አጭር መግለጫ (አማርኛ)'}
                    {formData.primaryLanguage === 'en' && 'Short Description (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData[`shortDescription${formData.primaryLanguage.charAt(0).toUpperCase() + formData.primaryLanguage.slice(1)}`]}
                    onChange={(e) => handleInputChange(`shortDescription${formData.primaryLanguage.charAt(0).toUpperCase() + formData.primaryLanguage.slice(1)}`, e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  {getLocalizedText('ማቀናጀት ጊዜ',  'Processing Time',  language)}
                </label>
                <select
                  value={formData.processingTime}
                  onChange={(e) => handleInputChange('processingTime', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">
                    {getLocalizedText('ጊዜ ይምረጡ',  'Select Time',  language)}
                  </option>
                  {processingTimes.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getLocalizedText('አስቸጋሪነት ደረጃ',  'Difficulty Level',  language)}
                </label>
                <select
                  value={formData.difficultyLevel}
                  onChange={(e) => handleInputChange('difficultyLevel', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {difficultyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {getLocalizedText(level.label.am,  level.label.en,  language)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Options */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                {getLocalizedText('የአገልግሎት አማራጮች',  'Service Options',  language)}
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isOnline}
                    onChange={(e) => handleInputChange('isOnline', e.target.checked)}
                    className="mr-3 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {getLocalizedText('በመስመር ላይ አገልግሎት',  'Online Service',  language)}
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isDigital}
                    onChange={(e) => handleInputChange('isDigital', e.target.checked)}
                    className="mr-3 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {getLocalizedText('ዲጂታል አገልግሎት',  'Digital Service',  language)}
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="mr-3 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {getLocalizedText('ታዋቂ አገልግሎት',  'Featured Service',  language)}
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Status */}
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-green-800 font-medium">
                  {getLocalizedText(
                    'አገልግሎቱ በተሳካ ሁኔታ ተጨምሯል!',
                    'Service added successfully!',
                    'Tajaajilli milkaa\'inaan dabalamee!',
                    language
                  )}
                </span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <span className="text-red-800 font-medium">
                  {getLocalizedText(
                    'አገልግሎቱን ማከል አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
                    'Failed to add service. Please try again.',
                    'Tajaajila dabaluun hin milkaa\'ine. Deebi\'ii yaali.',
                    language
                  )}
                </span>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {getLocalizedText('ሰርዝ',  'Cancel',  language)}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {getLocalizedText('እየተላከ...',  'Adding...',  language)}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {getLocalizedText('አገልግሎት ጨምር',  'Add Service',  language)}
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

export default AddServiceModal;

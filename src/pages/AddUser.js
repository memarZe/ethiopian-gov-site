import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../services/api';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { LoadingSpinner } from '../components/LoadingComponents';

const AddUser = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    firstNameAm: '',
    lastNameAm: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    region: '',
    isActive: true,
    isVerified: false,
    emailVerified: false,
    phoneVerified: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regions, setRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(true);

  // Predefined roles
  const roles = [
    'USER',
    'ADMIN',
    'MODERATOR',
    'EDITOR',
    'VIEWER'
  ];

  // Load regions from API
  useEffect(() => {
    const loadRegions = async () => {
      try {
        setLoadingRegions(true);
        const regionsData = await apiService.getRegions();
        setRegions(regionsData || []);
      } catch (error) {
        console.error('Failed to load regions:', error);
        setRegions([]); // Fallback to empty array
      } finally {
        setLoadingRegions(false);
      }
    };
    
    loadRegions();
  }, []);

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
    
    // Username is required
    if (!formData.username?.trim()) {
      newErrors.username = getLocalizedText(
        'የተጠቃሚ ስም ሲሰጥ አይጣም',
        'Username is required',
        'Maqaa fayyadamaa barbaachisaadha',
        language
      );
    } else if (formData.username.length < 3) {
      newErrors.username = getLocalizedText(
        'የተጠቃሚ ስም ቢያንስ 3 ቁምፊዎች ሊኖረው ይገባል',
        'Username must be at least 3 characters',
        'Maqaan fayyadamaa yoo xinnaate qubee 3 qabaachuu qaba',
        language
      );
    }

    // Email is required and must be valid
    if (!formData.email?.trim()) {
      newErrors.email = getLocalizedText(
        'ኢሜይል ሲሰጥ አይጣም',
        'Email is required',
        'Imeelii barbaachisaadha',
        language
      );
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email.trim())) {
        newErrors.email = getLocalizedText(
          'ትክክለኛ ኢሜይል አድራሻ ያስገቡ',
          'Please enter a valid email address',
          'Teessoo imeelii sirrii galchi',
          language
        );
      }
    }

    // First name is required
    if (!formData.firstName?.trim()) {
      newErrors.firstName = getLocalizedText(
        'ስም ሲሰጥ አይጣም',
        'First name is required',
        'Maqaa jalqabaa barbaachisaadha',
        language
      );
    }

    // Last name is required
    if (!formData.lastName?.trim()) {
      newErrors.lastName = getLocalizedText(
        'የአባት ስም ሲሰጥ አይጣም',
        'Last name is required',
        'Maqaa abbaa barbaachisaadha',
        language
      );
    }

    // Password validation
    if (!formData.password?.trim()) {
      newErrors.password = getLocalizedText(
        'መክፈቻ ቃል ሲሰጥ አይጣም',
        'Password is required',
        'Jecha icciitii barbaachisaadha',
        language
      );
    } else if (formData.password.length < 6) {
      newErrors.password = getLocalizedText(
        'መክፈቻ ቃል ቢያንስ 6 ቁምፊዎች ሊኖረው ይገባል',
        'Password must be at least 6 characters',
        'Jecha icciitii yoo xinnaate qubee 6 qabaachuu qaba',
        language
      );
    }

    // Confirm password validation
    if (!formData.confirmPassword?.trim()) {
      newErrors.confirmPassword = getLocalizedText(
        'መክፈቻ ቃል ማረጋገጫ ሲሰጥ አይጣም',
        'Password confirmation is required',
        'Mirkanaanessu jecha icciitii barbaachisaadha',
        language
      );
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = getLocalizedText(
        'መክፈቻ ቃሎች አይመሳሰሉም',
        'Passwords do not match',
        'Jechoonni icciitii wal hin simatan',
        language
      );
    }

    // Phone validation (if provided)
    if (formData.phone?.trim()) {
      const phonePattern = /^(\+251|0)[0-9]{9}$/;
      if (!phonePattern.test(formData.phone.trim().replace(/\s/g, ''))) {
        newErrors.phone = getLocalizedText(
          'ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ (መ.ዳ: +251912345678)',
          'Please enter a valid Ethiopian phone number (e.g., +251912345678)',
          'Lakkoofsa bilbilaa Itoophiyaa sirrii galchi (fkf: +251912345678)',
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
      // Prepare data for API submission
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        firstNameAm: formData.firstNameAm?.trim() || null,
        lastNameAm: formData.lastNameAm?.trim() || null,
        phone: formData.phone?.trim() || null,
        passwordHash: formData.password, // Backend will hash this
        role: formData.role,
        region: formData.region ? { id: parseInt(formData.region) } : null, // Send region as entity with ID
        isActive: formData.isActive,
        isVerified: formData.isVerified,
        emailVerified: formData.emailVerified,
        phoneVerified: formData.phoneVerified
      };

      await apiService.createUser(userData);
      
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/users'); // We'll create a users list page
      }, 2000);
    } catch (error) {
      console.error('Error creating user:', error);
      const errorMessage = error.response?.data?.message || error.message;
      setErrors({ 
        submit: getLocalizedText(
          `ተጠቃሚ ሲፈጠር ስህተት ተፈጥሯል። ${errorMessage}`,
          `Error creating user: ${errorMessage}`,
          `Dogongora fayyadamaa uumuu keessatti: ${errorMessage}`,
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/users')}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold">
              {getLocalizedText(
                'አዲስ ተጠቃሚ ጨምር',
                'Add New User',
                'Fayyadamaa Haaraa Dabali',
                language
              )}
            </h1>
          </div>
          <p className="text-lg md:text-xl opacity-90">
            {getLocalizedText(
              'የመንግስት ፖርታል አዲስ ተጠቃሚ ይፍጠሩ',
              'Create a new government portal user',
              'Fayyadamaa haaraa karaa mootummaa uumi',
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
                  'ተጠቃሚ በተሳካ ሁኔታ ተፈጥሯል! ወደ ተጠቃሚዎች ገጽ በቅርቡ ይሄዳሉ...',
                  'User created successfully! Redirecting to users page...',
                  'Fayyadamaan milkaa\'inaan uumameera! Gara fuula fayyadamtoota geessamaa jira...',
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
                <User className="inline h-5 w-5 mr-2" />
                {getLocalizedText(
                  'መሰረታዊ መረጃ',
                  'Basic Information',
                  'Odeeffannoo Bu\'uuraa',
                  language
                )}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('የተጠቃሚ ስም',  'Username',  language)} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={getLocalizedText('የተጠቃሚ ስም',  'Username',  language)}
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ኢሜይል',  'Email',  language)} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="user@gov.et"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {getLocalizedText(
                  'የግል መረጃ',
                  'Personal Information',
                  'Odeeffannoo Dhuunfaa',
                  language
                )}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ስም',  'First Name',  language)} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={getLocalizedText('ስም',  'First Name',  language)}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('የአባት ስም',  'Last Name',  language)} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={getLocalizedText('የአባት ስም',  'Last Name',  language)}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ስም (አማርኛ)',  'First Name (Amharic)',  language)}
                  </label>
                  <input
                    type="text"
                    name="firstNameAm"
                    value={formData.firstNameAm}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ስም በአማርኛ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('የአባት ስም (አማርኛ)',  'Last Name (Amharic)',  language)}
                  </label>
                  <input
                    type="text"
                    name="lastNameAm"
                    value={formData.lastNameAm}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="የአባት ስም በአማርኛ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ስልክ ቁጥር',  'Phone Number',  language)}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+251912345678"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ክልል',  'Region',  language)}
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loadingRegions}
                  >
                    <option value="">
                      {loadingRegions 
                        ? getLocalizedText('እየተጫነ ነው...',  'Loading...',  language)
                        : getLocalizedText('ክልል ይምረጡ',  'Select Region',  language)
                      }
                    </option>
                    {regions.map(region => (
                      <option key={region.id} value={region.id}>
                        {language === 'amharic' && region.nameAm 
                          ? region.nameAm 
                          : region.nameEn
                        }
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {getLocalizedText(
                  'የደህንነት መረጃ',
                  'Security Information',
                  'Odeeffannoo Nageenyaa',
                  language
                )}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('መክፈቻ ቃል',  'Password',  language)} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={getLocalizedText('መክፈቻ ቃል',  'Password',  language)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('መክፈቻ ቃል ማረጋገጫ',  'Confirm Password',  language)} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={getLocalizedText('መክፈቻ ቃል ማረጋገጫ',  'Confirm Password',  language)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* User Role and Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {getLocalizedText(
                  'ሚና እና ሁኔታ',
                  'Role and Status',
                  'Gahee fi Haala',
                  language
                )}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getLocalizedText('ሚና',  'Role',  language)}
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>
                        {getLocalizedText(
                          role === 'USER' ? 'ተጠቃሚ' :
                          role === 'ADMIN' ? 'አስተዳዳሪ' :
                          role === 'MODERATOR' ? 'ሞዴሬተር' :
                          role === 'EDITOR' ? 'ሰነድ አርታዒ' :
                          role === 'VIEWER' ? 'ተመልካች' : role,
                          role,
                          role === 'USER' ? 'Fayyadamaa' :
                          role === 'ADMIN' ? 'Bulchaa' :
                          role === 'MODERATOR' ? 'Modaretera' :
                          role === 'EDITOR' ? 'Gulaala' :
                          role === 'VIEWER' ? 'Ilaalcha' : role,
                          language
                        )}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">
                    {getLocalizedText('ንቁ ተጠቃሚ',  'Active User',  language)}
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleInputChange}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">
                    {getLocalizedText('የተረጋገጠ ተጠቃሚ',  'Verified User',  language)}
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="emailVerified"
                    checked={formData.emailVerified}
                    onChange={handleInputChange}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">
                    {getLocalizedText('የተረጋገጠ ኢሜይል',  'Email Verified',  language)}
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="phoneVerified"
                    checked={formData.phoneVerified}
                    onChange={handleInputChange}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">
                    {getLocalizedText('የተረጋገጠ ስልክ',  'Phone Verified',  language)}
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/users')}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {getLocalizedText('ሰረዝ',  'Cancel',  language)}
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">
                      {getLocalizedText('እየተሰራ ነው...',  'Creating...',  language)}
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {getLocalizedText('ተጠቃሚ ፍጠር',  'Create User',  language)}
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

export default AddUser;

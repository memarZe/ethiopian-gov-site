import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Clock, Users, Star, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getServiceById(id);
        
        if (response?.data) {
          setService(response.data);
        } else {
          throw new Error('Service not found');
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  const getLocalizedText = (amharic, english) => {
    if (language === 'am' && amharic) return amharic;
    return english || amharic;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error || "Service not found"}
                </h3>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-600 hover:text-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAccessService = () => {
    if (service.url) {
      window.open(service.url, '_blank');
    } else {
      alert(language === 'am' ? 'ይህ አገልግሎት በቅርቡ ይጀመራል' : 'This service will be available soon');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-green-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            {language === 'am' ? 'ወደ አገልግሎቶች ተመለስ' : 'Back to Services'}
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {getLocalizedText(service.nameAm, service.name, service.nameOr)}
              </h1>
              <div className="flex items-center gap-4 text-green-100">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {service.viewCount?.toLocaleString() || 0} {language === 'am' ? 'እይታዎች' : 'views'}
                </span>
                {service.rating && service.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    {service.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {service.isOnline && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  {language === 'am' ? 'ኦንላይን' : 'Online'}
                </span>
              )}
              {service.isFeatured && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                  {language === 'am' ? 'ተወዳጅ' : 'Featured'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                {language === 'am' ? 'የአገልግሎት መግለጫ' : 'Service Description'}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {getLocalizedText(service.descriptionAm, service.description, service.descriptionOr)}
              </p>
            </div>

            {/* Requirements */}
            {service.requirements && service.requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  {language === 'am' ? 'መስፈርቶች' : 'Requirements'}
                </h2>
                <ul className="space-y-2">
                  {service.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Process Steps */}
            {service.steps && service.steps.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  {language === 'am' ? 'ሂደት' : 'Process Steps'}
                </h2>
                <div className="space-y-4">
                  {service.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-gray-700">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Required Documents */}
            {service.documents && service.documents.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  {language === 'am' ? 'የሚያስፈልጉ ሰነዶች' : 'Required Documents'}
                </h2>
                <ul className="space-y-2">
                  {service.documents.map((document, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{document}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Access */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <button
                onClick={handleAccessService}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-5 w-5" />
                {language === 'am' ? 'አገልግሎት ተጠቀም' : 'Access Service'}
              </button>
            </div>

            {/* Service Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                {language === 'am' ? 'የአገልግሎት መረጃ' : 'Service Information'}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'am' ? 'ምድብ' : 'Category'}:
                  </span>
                  <span className="font-medium">{service.category}</span>
                </div>
                
                {service.ministry && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'am' ? 'ሚኒስቴር' : 'Ministry'}:
                    </span>
                    <span className="font-medium">{service.ministry}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'am' ? 'የመስራት ጊዜ' : 'Processing Time'}:
                  </span>
                  <span className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {service.processingTime}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'am' ? 'የችግር ደረጃ' : 'Difficulty'}:
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(service.difficultyLevel)}`}>
                    {service.difficultyLevel}
                  </span>
                </div>
                
                {service.fees && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'am' ? 'ክፍያ' : 'Fees'}:
                    </span>
                    <span className="font-medium">{service.fees}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {language === 'am' ? 'ሁኔታ' : 'Status'}:
                  </span>
                  <span className={`flex items-center gap-1 ${service.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    <Shield className="h-4 w-4" />
                    {service.isActive 
                      ? (language === 'am' ? 'ንቁ' : 'Active')
                      : (language === 'am' ? 'ጥሩ አይደለም' : 'Inactive')
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {service.contact && Object.keys(service.contact).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  {language === 'am' ? 'የመገናኛ መረጃ' : 'Contact Information'}
                </h3>
                <div className="space-y-2 text-sm">
                  {service.contact.phone && (
                    <div>
                      <span className="text-gray-600">{language === 'am' ? 'ስልክ' : 'Phone'}:</span>
                      <p className="font-medium">{service.contact.phone}</p>
                    </div>
                  )}
                  {service.contact.email && (
                    <div>
                      <span className="text-gray-600">{language === 'am' ? 'ኢሜይል' : 'Email'}:</span>
                      <p className="font-medium">{service.contact.email}</p>
                    </div>
                  )}
                  {service.contact.address && (
                    <div>
                      <span className="text-gray-600">{language === 'am' ? 'አድራሻ' : 'Address'}:</span>
                      <p className="font-medium">{service.contact.address}</p>
                    </div>
                  )}
                  {service.contact.workingHours && (
                    <div>
                      <span className="text-gray-600">{language === 'am' ? 'የሥራ ሰአታት' : 'Working Hours'}:</span>
                      <p className="font-medium">{service.contact.workingHours}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;

// Enhanced Navigation component with improved routing reliability
import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { LogIn, LogOut, User, ChevronDown, Shield } from 'lucide-react';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const NavigationEnhanced = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated, user, logout, isEditor } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const navItems = [
    { 
      amharic: 'አገልግሎቶች', 
      english: 'Services',
      oromo: 'Tajaajila',
      href: '/services' 
    },
    { 
      amharic: 'ተጠቃሚዎች', 
      english: 'Users',
      oromo: 'Fayyadamtoota',
      href: '/users' 
    },
    { 
      amharic: 'ሚኒስቴሮች', 
      english: 'Ministries',
      oromo: 'Ministeerileelee',
      href: '/ministries' 
    },
    { 
      amharic: 'ክልሎች', 
      english: 'Regions',
      oromo: 'Nannoolee',
      href: '/regions' 
    },
    { 
      amharic: 'ዜናዎች', 
      english: 'News',
      oromo: 'Oduu',
      href: '/news' 
    },
    { 
      amharic: 'ስለ ኢትዮጵያ', 
      english: 'About Ethiopia',
      oromo: 'Waaʼee Itoophiyaa',
      href: '/about' 
    },
    { 
      amharic: 'ውይይት', 
      english: 'Chat',
      oromo: 'Marii',
      href: '/chat' 
    },
  ];

  // Enhanced navigation handler with debugging and reliability improvements
  const handleNavigation = useCallback((path, itemName) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🧭 Navigation clicked: ${itemName} -> ${path}`);
      console.log('📍 Current location:', location.pathname);
      console.log('🎯 Target path:', path);
    }

    // Close mobile menu
    setMobileMenuOpen(false);
    
    // Close user menu
    setUserMenuOpen(false);
    
    // Clear any potential navigation state issues
    try {
      // For regions page specifically, add extra reliability measures
      if (path === '/regions') {
        if (process.env.NODE_ENV === 'development') {
          console.log('🏛️ Special handling for regions navigation');
        }
        
        // Clear any cached state that might interfere
        sessionStorage.removeItem('regionsPageState');
        
        // Force a clean navigation
        setTimeout(() => {
          navigate(path, { replace: false });
          
          // Double-check navigation after a short delay
          setTimeout(() => {
            if (window.location.pathname !== path) {
              console.warn('⚠️ Navigation verification failed, attempting fallback');
              window.location.href = path;
            }
          }, 100);
        }, 0);
      } else {
        // Standard navigation for other pages
        navigate(path);
      }
      
      // Scroll to top after navigation
      setTimeout(() => window.scrollTo(0, 0), 0);
      
    } catch (error) {
      console.error('❌ Navigation error:', error);
      // Fallback to window.location for critical failures
      window.location.href = path;
    }
  }, [navigate, location.pathname, setMobileMenuOpen, setUserMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    
    // Use Amharic name if available and language is Amharic
    if (language === 'amharic' && user.firstNameAm && user.lastNameAm) {
      return `${user.firstNameAm} ${user.lastNameAm}`;
    }
    
    // Fallback to English name
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'ADMIN': {
        amharic: 'አስተዳዳሪ',
        english: 'Administrator',
        oromo: 'Bulchaa'
      },
      'EDITOR': {
        amharic: 'አርታዒ',
        english: 'Editor', 
        oromo: 'Gulaala'
      },
      'MODERATOR': {
        amharic: 'ሞዴሬተር',
        english: 'Moderator',
        oromo: 'Modaretera'
      },
      'USER': {
        amharic: 'ተጠቃሚ',
        english: 'User',
        oromo: 'Fayyadamaa'
      }
    };
    
    return getLocalizedText(
      roleNames[role]?.amharic || role,
      roleNames[role]?.english || role,
      roleNames[role]?.oromo || role,
      language
    );
  };

  const getLinkClassName = (href, isMobile = false) => {
    const baseClasses = isMobile 
      ? "block py-2 font-medium transition-colors duration-200 no-underline"
      : "py-2 font-medium transition-colors duration-200 no-underline";
    
    const activeClasses = location.pathname === href
      ? "text-green-700 underline bg-green-50 px-2 rounded"
      : "text-gray-700 hover:text-green-700 hover:underline";
    
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <nav className="bg-white border-b-2 border-green-600">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Navigation - Always visible on large screens */}
        <div className="hidden lg:flex lg:justify-between lg:items-center py-4">
          {/* Navigation Links */}
          <div className="flex gap-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.href, item.english)}
                className={`${getLinkClassName(item.href)} cursor-pointer border-none bg-transparent`}
                type="button"
              >
                {getLocalizedText(item.amharic,  item.english,  language)}
              </button>
            ))}
          </div>

          {/* Authentication Section */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative">
                {/* User Menu Button */}
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      {getRoleDisplayName(user?.role)}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-900">
                        {getUserDisplayName()}
                      </div>
                      <div className="text-xs text-gray-600">{user?.email}</div>
                      <div className="text-xs text-blue-600 font-medium mt-1">
                        {getRoleDisplayName(user?.role)}
                      </div>
                    </div>
                    
                    {/* Admin/Editor Actions */}
                    {isEditor() && (
                      <div className="p-2 border-b border-gray-200">
                        <button
                          onClick={() => handleNavigation('/services/add', 'Add Service')}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          {getLocalizedText(
                            'አገልግሎት ጨምር',
                            'Add Service',
                            'Tajaajila Dabaluu',
                            language
                          )}
                        </button>
                        <button
                          onClick={() => handleNavigation('/users/add', 'Add User')}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          {getLocalizedText(
                            'ተጠቃሚ ጨምር',
                            'Add User',
                            'Fayyadamaa Dabaluu',
                            language
                          )}
                        </button>
                      </div>
                    )}
                    
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {getLocalizedText('ውጣ',  'Logout',  language)}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium no-underline"
              >
                <LogIn className="h-4 w-4" />
                <span>{getLocalizedText('ግባ',  'Login',  language)}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'} py-4 border-t border-gray-200`}>
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.href, item.english)}
                className={`${getLinkClassName(item.href, true)} w-full text-left border-none bg-transparent`}
                type="button"
              >
                {getLocalizedText(item.amharic,  item.english,  language)}
              </button>
            ))}
            
            <div className="border-t border-gray-200 pt-2 mt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 px-2">
                    {getUserDisplayName()} ({getRoleDisplayName(user?.role)})
                  </div>
                  {isEditor() && (
                    <>
                      <button
                        onClick={() => handleNavigation('/services/add', 'Add Service')}
                        className="block w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        {getLocalizedText('አገልግሎት ጨምር',  'Add Service',  language)}
                      </button>
                      <button
                        onClick={() => handleNavigation('/users/add', 'Add User')}
                        className="block w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        {getLocalizedText('ተጠቃሚ ጨምር',  'Add User',  language)}
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {getLocalizedText('ውጣ',  'Logout',  language)}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium no-underline"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{getLocalizedText('ግባ',  'Login',  language)}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationEnhanced;

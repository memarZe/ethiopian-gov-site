import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, ChevronDown, Shield } from 'lucide-react';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Navigation = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated, user, logout, isEditor } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const navItems = [
    { 
      amharic: 'መነሻ', 
      english: 'Home',
      oromo: 'Mana',
      href: '/' 
    },
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

  // Enhanced navigation handler for all pages
  const handleNavigation = (path, pageName) => {
    console.log(`🧭 Navigating to ${pageName} (${path})`);
    
    // Close menus
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    
    try {
      // Method 1: Try React Router navigate first
      navigate(path, { replace: false });
      
      // Method 2: Verify navigation worked, fallback if needed
      setTimeout(() => {
        if (window.location.pathname !== path) {
          console.warn(`⚠️ React Router navigation failed for ${pageName}, using fallback`);
          // Force navigation using window.location as ultimate fallback
          window.location.href = path;
        } else {
          console.log(`✅ Successfully navigated to ${pageName}`);
        }
      }, 50); // Reduced timeout for faster fallback
      
    } catch (error) {
      console.error(`❌ Navigation error for ${pageName}:`, error);
      // Immediate fallback on error
      window.location.href = path;
    }
    
    // Scroll to top after navigation
    setTimeout(() => window.scrollTo(0, 0), 100);
  };

  const getLinkClassName = (href, isMobile = false) => {
    const baseClasses = isMobile 
      ? "block py-2 font-medium transition-colors duration-200 no-underline cursor-pointer"
      : "py-2 font-medium transition-colors duration-200 no-underline cursor-pointer";
    
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
                className={getLinkClassName(item.href)}
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
                        className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {getLocalizedText('ውጣ',  'Sign Out',  language)}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigation('/login', 'Sign In')}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                type="button"
              >
                <LogIn className="h-4 w-4" />
                <span>
                  {getLocalizedText('ግባ',  'Sign In',  language)}
                </span>
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation - Toggle based on mobileMenuOpen */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:hidden py-4`}>
          {/* Navigation Links */}
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.href, item.english)}
              className={getLinkClassName(item.href, true)}
              type="button"
            >
              {getLocalizedText(item.amharic,  item.english,  language)}
            </button>
          ))}
          
          {/* Mobile Authentication */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="bg-blue-50 p-3 rounded-lg">
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
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigation('/services/add', 'Add Service')}
                      className="block w-full text-left py-2 text-sm text-gray-700 hover:text-green-700 cursor-pointer"
                      type="button"
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
                      className="block w-full text-left py-2 text-sm text-gray-700 hover:text-green-700 cursor-pointer"
                      type="button"
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
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-sm text-red-600 hover:text-red-700 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {getLocalizedText('ውጣ',  'Sign Out',  language)}
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation('/login', 'Sign In')}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                type="button"
              >
                <LogIn className="h-4 w-4" />
                <span>
                  {getLocalizedText('ግባ',  'Sign In',  language)}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

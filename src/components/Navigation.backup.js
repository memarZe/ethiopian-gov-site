import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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
              <Link
                key={index}
                to={item.href}
                className={getLinkClassName(item.href)}
                onClick={() => {
                  setUserMenuOpen(false);
                  setTimeout(() => window.scrollTo(0, 0), 0);
                }}
              >
                {getLocalizedText(item.amharic,  item.english,  language)}
              </Link>
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
                        <Link
                          to="/services/add"
                          onClick={() => setUserMenuOpen(false)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded no-underline"
                        >
                          {getLocalizedText(
                            'አገልግሎት ጨምር',
                            'Add Service',
                            'Tajaajila Dabaluu',
                            language
                          )}
                        </Link>
                        <Link
                          to="/users/add"
                          onClick={() => setUserMenuOpen(false)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded no-underline"
                        >
                          {getLocalizedText(
                            'ተጠቃሚ ጨምር',
                            'Add User',
                            'Fayyadamaa Dabaluu',
                            language
                          )}
                        </Link>
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
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors no-underline"
              >
                <LogIn className="h-4 w-4" />
                <span>
                  {getLocalizedText('ግባ',  'Sign In',  language)}
                </span>
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation - Toggle based on mobileMenuOpen */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:hidden py-4`}>
          {/* Navigation Links */}
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={getLinkClassName(item.href, true)}
              onClick={() => {
                setMobileMenuOpen(false);
                setUserMenuOpen(false);
                setTimeout(() => window.scrollTo(0, 0), 0);
              }}
            >
              {getLocalizedText(item.amharic,  item.english,  language)}
            </Link>
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
                    <Link
                      to="/services/add"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-left py-2 text-sm text-gray-700 hover:text-green-700 no-underline"
                    >
                      {getLocalizedText(
                        'አገልግሎት ጨምር',
                        'Add Service',
                        'Tajaajila Dabaluu',
                        language
                      )}
                    </Link>
                    <Link
                      to="/users/add"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-left py-2 text-sm text-gray-700 hover:text-green-700 no-underline"
                    >
                      {getLocalizedText(
                        'ተጠቃሚ ጨምር',
                        'Add User',
                        'Fayyadamaa Dabaluu',
                        language
                      )}
                    </Link>
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
              <Link
                to="/login"
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors no-underline"
              >
                <LogIn className="h-4 w-4" />
                <span>
                  {getLocalizedText('ግባ',  'Sign In',  language)}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

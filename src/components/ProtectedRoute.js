import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { LoadingSpinner } from '../components/LoadingComponents';

// Protected Route Component - requires authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Verifying authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Role-based Protected Route Component with localStorage fallback
export const RoleProtectedRoute = ({ children, roles, fallbackPath = '/' }) => {
  const { isAuthenticated, loading, user, hasRole } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();

  // Enhanced debug logging
  console.log('🔒 RoleProtectedRoute Debug:', {
    path: location.pathname,
    timestamp: new Date().toISOString(),
    loading,
    isAuthenticated,
    user: user ? { username: user.username, role: user.role, id: user.id } : null,
    requiredRoles: roles,
    authContextValues: {
      userState: !!user,
      authState: isAuthenticated,
      loadingState: loading
    }
  });

  // CRITICAL FIX: Double-check localStorage for authentication state
  // This handles cases where React context might not be fully initialized
  const localStorageCheck = () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        console.log('🔍 LocalStorage fallback check:', {
          hasToken: !!token,
          user: { username: parsedUser.username, role: parsedUser.role },
          requiredRoles: roles,
          roleCheck: Array.isArray(roles) ? roles.includes(parsedUser.role) : parsedUser.role === roles
        });
        
        return {
          isAuth: true,
          user: parsedUser,
          hasRequiredRole: Array.isArray(roles) ? roles.includes(parsedUser.role) : parsedUser.role === roles
        };
      }
    } catch (error) {
      console.error('LocalStorage check failed:', error);
    }
    
    return {
      isAuth: false,
      user: null,
      hasRequiredRole: false
    };
  };

  // If still loading, show loading spinner
  if (loading) {
    console.log('⏳ Auth still loading, showing spinner...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Verifying permissions..." />
      </div>
    );
  }

  // Primary authentication check using React context
  if (!isAuthenticated || !user) {
    // Fallback: Check localStorage directly
    const localCheck = localStorageCheck();
    
    if (!localCheck.isAuth) {
      console.log('❌ Not authenticated (both context and localStorage), redirecting to login');
      return <Navigate to="/login" state={{ from: location }} replace />;
    } else {
      console.log('⚠️ Context not ready but localStorage has valid auth, checking roles...');
      
      if (!localCheck.hasRequiredRole) {
        console.log('🚫 LocalStorage user lacks required role');
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full">
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Access Denied
                </h2>
                <p className="text-gray-600 mb-6">
                  You need {Array.isArray(roles) ? roles.join(' or ') : roles} role to access this page.
                </p>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Your current role:</strong> {localCheck.user?.role || 'USER'}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Required role:</strong> {Array.isArray(roles) ? roles.join(', ') : roles}
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => window.history.back()}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => window.location.href = fallbackPath}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        console.log('✅ LocalStorage user has required role, allowing access');
        return children;
      }
    }
  }

  // Standard role check using React context
  const userHasRole = hasRole(roles);
  if (!userHasRole) {
    console.log('🚫 User lacks required role:', {
      userRole: user?.role,
      requiredRoles: roles,
      hasRoleResult: userHasRole
    });
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {getLocalizedText(
                'ፍቃድ አልተሰጠም',
                'Access Denied',
                'Hayyama Dhowwame',
                language
              )}
            </h2>
            <p className="text-gray-600 mb-6">
              {getLocalizedText(
                `ይህንን ገጽ ለማየት የ${Array.isArray(roles) ? roles.join(', ') : roles} ሚና ያስፈልግዎታል።`,
                `You need ${Array.isArray(roles) ? roles.join(' or ') : roles} role to access this page.`,
                `Fuula kana ilaaluuf gahee ${Array.isArray(roles) ? roles.join(' ykn ') : roles} si barbaachisa.`,
                language
              )}
            </p>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>
                    {getLocalizedText('አሁን የእርስዎ ሚና',  'Your current role',  language)}:
                  </strong> {user?.role || 'USER'}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>
                    {getLocalizedText('የሚያስፈልግ ሚና',  'Required role',  language)}:
                  </strong> {Array.isArray(roles) ? roles.join(', ') : roles}
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {getLocalizedText('ተመለስ',  'Go Back',  language)}
              </button>
              <button
                onClick={() => window.location.href = fallbackPath}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {getLocalizedText('ወደ ቤት ገጽ ሂድ',  'Go to Home',  language)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ All checks passed, rendering protected content');
  return children;
};

// Admin Only Route
export const AdminRoute = ({ children }) => (
  <RoleProtectedRoute roles={['ADMIN']}>
    {children}
  </RoleProtectedRoute>
);

// Editor or Admin Route
export const EditorRoute = ({ children }) => (
  <RoleProtectedRoute roles={['ADMIN', 'EDITOR']}>
    {children}
  </RoleProtectedRoute>
);

// Moderator, Editor, or Admin Route  
export const ModeratorRoute = ({ children }) => (
  <RoleProtectedRoute roles={['ADMIN', 'EDITOR', 'MODERATOR']}>
    {children}
  </RoleProtectedRoute>
);

export default ProtectedRoute;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🚀 Initializing authentication...');
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        console.log('💾 LocalStorage check:', { 
          hasToken: !!token, 
          hasUserData: !!userData,
          tokenPreview: token ? token.substring(0, 20) + '...' : null
        });
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          console.log('👤 Setting user from localStorage:', { 
            username: parsedUser.username, 
            role: parsedUser.role 
          });
          
          // CRITICAL FIX: Set user and auth state BEFORE token verification
          // This prevents race conditions where routes check auth before initialization completes
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Now verify token in background - if it fails, we'll clear the state
          try {
            console.log('🔐 Verifying token...');
            await apiService.verifyToken();
            console.log('✅ Token verification successful');
          } catch (error) {
            console.warn('❌ Token verification failed:', error);
            // Token is invalid, clear auth state
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log('❌ No valid token/userData found');
          // Ensure clean state when no auth data exists
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('💥 Error initializing auth:', error);
        // Clear auth state on any error
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        console.log('🏁 Auth initialization complete, loading=false');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔑 Login attempt:', { username: credentials.username });
      setLoading(true);
      const response = await apiService.login(credentials);
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        
        console.log('✅ Login successful:', { 
          username: userData.username, 
          role: userData.role,
          token: token.substring(0, 20) + '...'
        });
        
        // Store in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        
        console.log('💾 Auth state updated and stored');
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please check your credentials.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API if available
      try {
        await apiService.logout();
      } catch (error) {
        // Ignore logout API errors, still clear local state
        console.warn('Logout API call failed:', error);
      }
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Clear state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const hasRole = (roles) => {
    console.log('🔍 hasRole called with:', {
      requestedRoles: roles,
      currentUser: user,
      isAuthenticated,
      loading,
      timestamp: new Date().toISOString()
    });
    
    const result = {
      user: user ? { username: user.username, role: user.role } : null,
      requiredRoles: roles,
      hasRole: false,
      debugInfo: {
        userExists: !!user,
        userHasRole: !!(user && user.role),
        isAuthenticated,
        loading
      }
    };
    
    if (!user || !user.role) {
      console.log('🔍 hasRole check failed: No user or role', result);
      return false;
    }
    
    if (Array.isArray(roles)) {
      result.hasRole = roles.includes(user.role);
    } else {
      result.hasRole = user.role === roles;
    }
    
    console.log('🔍 hasRole check result:', result);
    return result.hasRole;
  };

  const isAdmin = () => hasRole(['ADMIN']);
  const isEditor = () => hasRole(['ADMIN', 'EDITOR']);
  const isModerator = () => hasRole(['ADMIN', 'MODERATOR', 'EDITOR']);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasRole,
    isAdmin,
    isEditor,
    isModerator
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

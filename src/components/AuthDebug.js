import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AuthDebug = () => {
  const { isAuthenticated, user, loading, hasRole, isEditor, isAdmin } = useAuth();
  const { language } = useLanguage();

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Authentication Debug Info</h3>
      <div className="space-y-2 text-sm">
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        <div><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</div>
        <div><strong>User Role:</strong> {user?.role || 'None'}</div>
        <div><strong>Is Admin:</strong> {isAdmin() ? 'Yes' : 'No'}</div>
        <div><strong>Is Editor:</strong> {isEditor() ? 'Yes' : 'No'}</div>
        <div><strong>Has Admin Role:</strong> {hasRole(['ADMIN']) ? 'Yes' : 'No'}</div>
        <div><strong>Has Editor Role:</strong> {hasRole(['ADMIN', 'EDITOR']) ? 'Yes' : 'No'}</div>
        <div><strong>Current Language:</strong> {language}</div>
        <div><strong>Local Storage Token:</strong> {localStorage.getItem('authToken') || 'None'}</div>
        <div><strong>Local Storage User:</strong> {localStorage.getItem('userData') || 'None'}</div>
      </div>
    </div>
  );
};

export default AuthDebug;

import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthTestPage = () => {
  const { isAuthenticated, user, loading, hasRole, isEditor, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Authentication State</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Loading:</strong> <span className={loading ? 'text-yellow-600' : 'text-green-600'}>{loading ? 'Yes' : 'No'}</span></div>
                <div><strong>Authenticated:</strong> <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>{isAuthenticated ? 'Yes' : 'No'}</span></div>
                <div><strong>User exists:</strong> <span className={user ? 'text-green-600' : 'text-red-600'}>{user ? 'Yes' : 'No'}</span></div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">User Information</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Username:</strong> {user?.username || 'None'}</div>
                <div><strong>Role:</strong> {user?.role || 'None'}</div>
                <div><strong>Email:</strong> {user?.email || 'None'}</div>
                <div><strong>Full Name:</strong> {user ? `${user.firstName} ${user.lastName}` : 'None'}</div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">Role Permissions</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div><strong>Is Admin:</strong> <span className={isAdmin() ? 'text-green-600' : 'text-red-600'}>{isAdmin() ? 'Yes' : 'No'}</span></div>
                <div><strong>Is Editor:</strong> <span className={isEditor() ? 'text-green-600' : 'text-red-600'}>{isEditor() ? 'Yes' : 'No'}</span></div>
              </div>
              <div>
                <div><strong>Has ADMIN role:</strong> <span className={hasRole(['ADMIN']) ? 'text-green-600' : 'text-red-600'}>{hasRole(['ADMIN']) ? 'Yes' : 'No'}</span></div>
                <div><strong>Has EDITOR role:</strong> <span className={hasRole(['EDITOR']) ? 'text-green-600' : 'text-red-600'}>{hasRole(['EDITOR']) ? 'Yes' : 'No'}</span></div>
              </div>
              <div>
                <div><strong>Has ADMIN or EDITOR:</strong> <span className={hasRole(['ADMIN', 'EDITOR']) ? 'text-green-600' : 'text-red-600'}>{hasRole(['ADMIN', 'EDITOR']) ? 'Yes' : 'No'}</span></div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">Local Storage</h3>
            <div className="space-y-2 text-sm bg-gray-50 p-3 rounded">
              <div><strong>Auth Token:</strong> {localStorage.getItem('authToken') || 'None'}</div>
              <div><strong>User Data:</strong> {localStorage.getItem('userData') || 'None'}</div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">Test Actions</h3>
            <div className="space-x-4">
              <button 
                onClick={() => window.location.href = '/login'}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Go to Login
              </button>
              <button 
                onClick={() => window.location.href = '/services/add'}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Try Add Service
              </button>
              <button 
                onClick={() => window.location.href = '/users/add'}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Try Add User
              </button>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear Auth & Reload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;

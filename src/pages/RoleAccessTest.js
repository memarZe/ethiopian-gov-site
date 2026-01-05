import React from 'react';

// Simple test component to verify role-based access
const RoleAccessTest = () => {
  // Simulate what EditorRoute does
  const testRoleAccess = () => {
    console.log('=== ROLE ACCESS TEST ===');
    
    // Check localStorage directly
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    console.log('1. LocalStorage Check:', {
      hasToken: !!token,
      hasUserData: !!userData,
      token: token?.substring(0, 30) + '...',
      userData: userData
    });
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('2. Parsed User:', user);
        
        // Test role checks
        const requiredRoles = ['ADMIN', 'EDITOR'];
        const userRole = user.role;
        const hasAccess = requiredRoles.includes(userRole);
        
        console.log('3. Role Check:', {
          userRole,
          requiredRoles,
          hasAccess,
          isAdmin: userRole === 'ADMIN',
          isEditor: userRole === 'EDITOR',
          isUser: userRole === 'USER'
        });
        
        return {
          success: true,
          hasAccess,
          user,
          userRole
        };
      } catch (error) {
        console.error('4. JSON Parse Error:', error);
        return {
          success: false,
          error: error.message
        };
      }
    } else {
      console.log('2. No user data found');
      return {
        success: false,
        error: 'No user data'
      };
    }
  };

  const setupAdminAuth = () => {
    console.log('Setting up admin authentication...');
    const token = 'mock-jwt-token-' + Date.now();
    const userData = {
      id: 1,
      username: 'admin',
      email: 'admin@gov.et',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
      isActive: true,
      isVerified: true
    };
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    console.log('Admin auth setup complete:', { token: token.substring(0, 30) + '...', userData });
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    console.log('Authentication cleared');
  };

  const runTest = () => {
    const result = testRoleAccess();
    
    // Display result in UI
    const resultDiv = document.getElementById('test-result');
    if (resultDiv) {
      resultDiv.innerHTML = `
        <div class="bg-gray-50 p-4 rounded">
          <h3 class="font-bold text-lg mb-2">Test Result:</h3>
          <pre class="text-sm">${JSON.stringify(result, null, 2)}</pre>
        </div>
      `;
    }
    
    return result;
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Role Access Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={setupAdminAuth}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Setup Admin Auth
        </button>
        
        <button
          onClick={runTest}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test Role Access
        </button>
        
        <button
          onClick={clearAuth}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear Auth
        </button>
        
        <button
          onClick={() => window.location.href = '/users/add'}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Navigate to /users/add
        </button>
      </div>
      
      <div id="test-result" className="mt-6"></div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p>Open browser console to see detailed logs.</p>
      </div>
    </div>
  );
};

export default RoleAccessTest;

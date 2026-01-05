import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigationTest = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [navigationMethod, setNavigationMethod] = useState('router'); // 'router' or 'reload'
  
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Ministries', href: '/ministries' },
    { label: 'News', href: '/news' },
  ];

  const handleNavigation = (href, method = navigationMethod) => {
    console.log(`Navigation Test: Going to ${href} using method: ${method}`);
    
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }

    switch (method) {
      case 'router':
        // Standard React Router navigation
        navigate(href);
        break;
      
      case 'reload':
        // Force full page reload
        window.location.href = href;
        break;
      
      case 'replace':
        // Replace current history entry
        navigate(href, { replace: true });
        break;
      
      case 'pushstate':
        // Manual pushState (for testing)
        window.history.pushState({}, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
        break;
      
      default:
        navigate(href);
    }
  };

  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 p-4 m-4 rounded">
      <h3 className="font-bold mb-2">🧪 Navigation Test Panel</h3>
      
      {/* Method Selector */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Navigation Method:</label>
        <select 
          value={navigationMethod} 
          onChange={(e) => setNavigationMethod(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="router">React Router (navigate)</option>
          <option value="reload">Full Page Reload</option>
          <option value="replace">Router Replace</option>
          <option value="pushstate">Manual PushState</option>
        </select>
      </div>

      {/* Test Navigation Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(item.href)}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              location.pathname === item.href
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Quick Test All Methods */}
      <div className="text-xs">
        <strong>Current Path:</strong> {location.pathname}
        <br />
        <button 
          onClick={() => handleNavigation('/services', 'reload')}
          className="bg-red-500 text-white px-2 py-1 rounded text-xs mt-1 mr-2"
        >
          🔄 Force Reload to Services
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs mt-1"
        >
          🔄 Refresh Current Page
        </button>
      </div>
    </div>
  );
};

export default NavigationTest;

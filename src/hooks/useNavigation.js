import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Custom hook to handle navigation effects
export const useNavigationEffect = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Log navigation for debugging
    console.log('Navigation to:', location.pathname);
    
    // Force a small delay to ensure proper rendering
    const timer = setTimeout(() => {
      // Trigger a small re-render by dispatching a custom event
      window.dispatchEvent(new Event('navigationComplete'));
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return location;
};

// Navigation guard hook
export const useRouteGuard = (routeName) => {
  const location = useLocation();
  
  useEffect(() => {
    console.log(`${routeName} component activated for route:`, location.pathname);
    
    return () => {
      console.log(`${routeName} component deactivated`);
    };
  }, [location.pathname, routeName]);
};

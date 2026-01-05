import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Higher-order component to ensure page components fully re-render on navigation
const withPageRefresh = (WrappedComponent, pageName) => {
  const PageComponent = (props) => {
    const location = useLocation();
    
    useEffect(() => {
      console.log(`${pageName}: Component mounted/updated for route ${location.pathname}`);
      
      // Force DOM updates
      document.body.className = `page-${pageName.toLowerCase()}`;
      document.title = `${pageName} - Ethiopian Government Website`;
      
      // Scroll to top
      window.scrollTo(0, 0);
      
      // Force a re-render by dispatching a custom event
      const event = new CustomEvent('pageChange', { 
        detail: { page: pageName, path: location.pathname } 
      });
      window.dispatchEvent(event);
      
      return () => {
        console.log(`${pageName}: Component unmounting`);
      };
    }, [location.pathname]);
    
    // Use location pathname as key to force complete re-rendering
    const uniqueKey = `${pageName}-${location.pathname}-${Math.random()}`;
    
    return (
      <div key={uniqueKey} className="page-container" data-page={pageName}>
        <WrappedComponent {...props} />
      </div>
    );
  };
  
  PageComponent.displayName = `withPageRefresh(${pageName})`;
  return PageComponent;
};

export default withPageRefresh;

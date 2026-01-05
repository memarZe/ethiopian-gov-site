// Application constants
export const APP_NAME = 'Ethiopian Government Portal';
export const APP_NAME_AMHARIC = 'የኢትዮጵያ መንግስት ፖርታል';

// Contact information
export const CONTACT_INFO = {
  phone: '8080',
  email: 'info@ethiopia.gov.et',
  address: 'Addis Ababa, Ethiopia'
};

// Social media links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/ethiopiangovernment',
  twitter: 'https://twitter.com/ethiopiangovernment',
  youtube: 'https://youtube.com/ethiopiangovernment'
};

// API endpoints (if needed)
export const API_ENDPOINTS = {
  base: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1',
  services: '/services',
  news: '/news',
  regions: '/regions',
  ministries: '/ministries',
  search: '/search',
  statistics: '/statistics',
  serviceCategories: '/services/categories',
  popularServices: '/services/popular'
};

// Language codes
export const LANGUAGES = {
  ENGLISH: 'en',
  AMHARIC: 'am'
};

// Theme colors matching Ethiopian flag
export const THEME_COLORS = {
  green: {
    50: '#f0f9f5',
    500: '#16a34a',
    600: '#15803d',
    700: '#166534'
  },
  yellow: {
    400: '#facc15',
    500: '#eab308'
  },
  red: {
    600: '#dc2626'
  }
};

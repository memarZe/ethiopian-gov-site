// Date utilities for Ethiopian calendar conversion
export const formatDate = (date) => {
  // This would normally convert between Gregorian and Ethiopian calendar
  // For now, returning the input date
  return date;
};

// Language utilities
export const getLanguageText = (amharic, english, language = 'en') => {
  switch (language) {
    case 'am':
      return amharic;
    case 'en':
    default:
      return english;
  }
};

// Search utilities
export const searchItems = (items, query, fields = ['title', 'name']) => {
  if (!query) return items;
  
  const lowercaseQuery = query.toLowerCase();
  return items.filter(item => 
    fields.some(field => 
      item[field] && item[field].toLowerCase().includes(lowercaseQuery)
    )
  );
};

// URL utilities
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Validation utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

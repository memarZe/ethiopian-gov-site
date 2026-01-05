// Comprehensive search functionality for Ethiopian Government Portal
// የኢትዮጵያ መንግስት ፖርታል የፍለጋ ስርዓት

import React from 'react';
import { apiService } from '../services/api';

export class SearchEngine {
  constructor() {
    this.searchIndex = new Map();
    this.isInitialized = false;
  }

  // Initialize search index with all available data
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🔍 SearchEngine: Initializing search index...');
      
      // Fetch all data for indexing
      const [news, services, ministries, regions] = await Promise.all([
        apiService.getNews().catch(() => []),
        apiService.getServices().catch(() => []),
        apiService.getMinistries().catch(() => []),
        apiService.getRegions().catch(() => [])
      ]);

      // Index news articles
      news.forEach(item => {
        this.addToIndex('news', item, [
          item.titleEn, item.titleAm, item.contentEn, item.contentAm,
          item.department, item.type
        ]);
      });

      // Index services
      services.forEach(item => {
        this.addToIndex('services', item, [
          item.titleEn, item.titleAm, item.nameEn, item.nameAm,
          item.descriptionEn, item.descriptionAm, item.category, item.ministry
        ]);
      });

      // Index ministries
      ministries.forEach(item => {
        this.addToIndex('ministries', item, [
          item.nameEn, item.nameAm, item.descriptionEn, item.descriptionAm,
          item.websiteUrl, item.emailAddress
        ]);
      });

      // Index regions
      regions.forEach(item => {
        this.addToIndex('regions', item, [
          item.nameEn, item.nameAm, item.capitalEn, item.capitalAm,
          item.description
        ]);
      });

      this.isInitialized = true;
      console.log(`🔍 SearchEngine: Indexed ${this.searchIndex.size} items`);
    } catch (error) {
      console.error('SearchEngine initialization error:', error);
    }
  }

  // Add item to search index
  addToIndex(category, item, searchableFields) {
    const searchText = searchableFields
      .filter(field => field && typeof field === 'string')
      .join(' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics

    const indexEntry = {
      category,
      item,
      searchText,
      keywords: this.extractKeywords(searchText)
    };

    const key = `${category}_${item.id || item.nameEn}`;
    this.searchIndex.set(key, indexEntry);
  }

  // Extract keywords from text
  extractKeywords(text) {
    return text
      .split(/\s+/)
      .filter(word => word.length > 2)
      .map(word => word.replace(/[^\w\u1200-\u137F]/g, '')) // Keep Amharic characters
      .filter(word => word.length > 1);
  }

  // Perform multilingual search
  async search(query, options = {}) {
    const {
      categories = ['news', 'services', 'ministries', 'regions'],
      limit = 20,
      includeSnippets = true,
      language = 'am'
    } = options;

    if (!this.isInitialized) {
      await this.initialize();
    }

    const normalizedQuery = query.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    
    const queryWords = this.extractKeywords(normalizedQuery);
    const results = [];

    for (const [key, entry] of this.searchIndex) {
      if (!categories.includes(entry.category)) continue;

      const score = this.calculateRelevanceScore(queryWords, entry, normalizedQuery);
      
      if (score > 0) {
        results.push({
          ...entry,
          score,
          snippet: includeSnippets ? this.generateSnippet(entry, query, language) : null
        });
      }
    }

    // Sort by relevance score and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Calculate relevance score
  calculateRelevanceScore(queryWords, entry, fullQuery) {
    let score = 0;

    // Exact phrase match (highest score)
    if (entry.searchText.includes(fullQuery)) {
      score += 100;
    }

    // Word matches
    queryWords.forEach(word => {
      if (entry.searchText.includes(word)) {
        score += 10;
      }
      
      // Partial matches
      entry.keywords.forEach(keyword => {
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 5;
        }
      });
    });

    // Category-specific boosts
    if (entry.category === 'services') score *= 1.2;
    if (entry.category === 'news') score *= 1.1;

    return score;
  }

  // Generate search result snippet
  generateSnippet(entry, query, language) {
    const { item, category } = entry;
    
    let title = '';
    let description = '';

    switch (category) {
      case 'news':
        title = language === 'am' ? (item.titleAm || item.titleEn) : (item.titleEn || item.titleAm);
        description = language === 'am' ? (item.contentAm || item.contentEn) : (item.contentEn || item.contentAm);
        break;
      case 'services':
        title = language === 'am' ? (item.titleAm || item.nameAm || item.titleEn) : (item.titleEn || item.nameEn || item.titleAm);
        description = language === 'am' ? (item.descriptionAm || item.descriptionEn) : (item.descriptionEn || item.descriptionAm);
        break;
      case 'ministries':
        title = language === 'am' ? (item.nameAm || item.nameEn) : (item.nameEn || item.nameAm);
        description = language === 'am' ? (item.descriptionAm || item.descriptionEn) : (item.descriptionEn || item.descriptionAm);
        break;
      case 'regions':
        title = language === 'am' ? (item.nameAm || item.nameEn) : (item.nameEn || item.nameAm);
        description = item.description || '';
        break;
    }

    // Truncate description and highlight query terms
    const truncatedDesc = description ? description.substring(0, 150) + '...' : '';
    
    return {
      title: title || 'Untitled',
      description: truncatedDesc,
      category: this.getCategoryLabel(category, language),
      url: this.generateUrl(category, item)
    };
  }

  // Get category label in current language
  getCategoryLabel(category, language) {
    const labels = {
      news: { am: 'ዜና', en: 'News' },
      services: { am: 'አገልግሎቶች', en: 'Services' },
      ministries: { am: 'ሚኒስቴሮች', en: 'Ministries' },
      regions: { am: 'ክልሎች', en: 'Regions' }
    };
    
    return labels[category]?.[language] || labels[category]?.en || category;
  }

  // Generate URL for search result
  generateUrl(category, item) {
    switch (category) {
      case 'news':
        return `/news`;
      case 'services':
        return `/services`;
      case 'ministries':
        return `/ministries`;
      case 'regions':
        return `/regions`;
      default:
        return '/';
    }
  }

  // Get search suggestions
  getSuggestions(query, limit = 5) {
    if (!query || query.length < 2) return [];

    const suggestions = new Set();
    const normalizedQuery = query.toLowerCase();

    for (const [, entry] of this.searchIndex) {
      entry.keywords.forEach(keyword => {
        if (keyword.startsWith(normalizedQuery) && keyword.length > query.length) {
          suggestions.add(keyword);
        }
      });
      
      if (suggestions.size >= limit) break;
    }

    return Array.from(suggestions).slice(0, limit);
  }

  // Clear search index
  clear() {
    this.searchIndex.clear();
    this.isInitialized = false;
  }
}

// Create singleton instance
export const searchEngine = new SearchEngine();

// Search hook for React components
export const useSearch = () => {
  const [isSearching, setIsSearching] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [suggestions, setSuggestions] = React.useState([]);

  const performSearch = React.useCallback(async (query, options) => {
    if (!query.trim()) {
      setResults([]);
      return [];
    }

    setIsSearching(true);
    try {
      const searchResults = await searchEngine.search(query, options);
      setResults(searchResults);
      return searchResults;
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  const getSuggestions = React.useCallback((query) => {
    const newSuggestions = searchEngine.getSuggestions(query);
    setSuggestions(newSuggestions);
    return newSuggestions;
  }, []);

  return {
    performSearch,
    getSuggestions,
    isSearching,
    results,
    suggestions
  };
};

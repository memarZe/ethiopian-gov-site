import { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls with loading and error states
export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      console.log('useApi: Starting API fetch');
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      console.log('useApi: API fetch successful', result);
      setData(result);
    } catch (err) {
      console.error('useApi: API Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    console.log('useApi: Effect triggered, fetching data...');
    fetchData();
  }, [fetchData]);

  const refetch = async () => {
    console.log('useApi: Manual refetch triggered');
    await fetchData();
  };

  return { data, loading, error, refetch };
};

// Custom hook for API calls with parameters
export const useApiWithParams = (apiFunction, initialParams = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (params = initialParams) => {
    if (!params) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(params);
      setData(result);
    } catch (err) {
      setError(err);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, initialParams]);

  useEffect(() => {
    if (initialParams) {
      fetchData(initialParams);
    }
  }, [fetchData, initialParams]);

  return { data, loading, error, fetchData };
};

// Custom hook for search functionality
export const useSearch = (apiSearchFunction, debounceMs = 300) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const searchResults = await apiSearchFunction(query);
        setResults(searchResults);
      } catch (err) {
        setError(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, apiSearchFunction, debounceMs]);

  return { query, setQuery, results, loading, error };
};

import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const CategoryFilterTest = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading services data...');
        const servicesData = await apiService.getServices();
        console.log('Services loaded:', servicesData);
        setServices(servicesData || []);

        // Extract unique categories
        const uniqueCategories = [...new Set((servicesData || []).map(service => service.category).filter(Boolean))];
        console.log('Unique categories:', uniqueCategories);
        setCategories(uniqueCategories);
        setFilteredServices(servicesData || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategoryFilter = (category) => {
    console.log('Filtering by category:', category);
    setSelectedCategory(category);
    
    if (category === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service => service.category === category);
      console.log('Filtered services:', filtered);
      setFilteredServices(filtered);
    }
  };

  const testAllCategories = () => {
    console.log('=== TESTING ALL CATEGORIES ===');
    categories.forEach(category => {
      const filtered = services.filter(service => service.category === category);
      console.log(`Category "${category}": ${filtered.length} services`);
      filtered.forEach(service => {
        console.log(`  - ${service.name} (${service.category})`);
      });
    });
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Category Filter Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filter Controls */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Filter Controls</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category} ({services.filter(s => s.category === category).length})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={testAllCategories}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test All Categories
          </button>
          
          <div className="mt-4 text-sm text-gray-600">
            <div>Total Services: {services.length}</div>
            <div>Total Categories: {categories.length}</div>
            <div>Filtered Services: {filteredServices.length}</div>
            <div>Selected: {selectedCategory || 'All'}</div>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map(category => {
              const count = services.filter(s => s.category === category).length;
              return (
                <div
                  key={category}
                  className={`p-2 rounded cursor-pointer ${
                    selectedCategory === category ? 'bg-green-100 border-green-300' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCategoryFilter(category)}
                >
                  <div className="font-medium text-sm">{category}</div>
                  <div className="text-xs text-gray-500">{count} services</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filtered Results */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Filtered Results ({filteredServices.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <div key={service.id} className="border-b pb-3">
                  <div className="font-medium text-sm">{service.name}</div>
                  <div className="text-xs text-gray-600">Category: {service.category}</div>
                  <div className="text-xs text-gray-500">Views: {service.viewCount}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">No services found</div>
            )}
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-8 bg-gray-900 text-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <div className="text-xs space-y-1">
          <div>Current Filter: "{selectedCategory}"</div>
          <div>Filter Function Working: {filteredServices.length !== services.length ? 'YES' : 'NO FILTER APPLIED'}</div>
          <div>Services with Categories: {services.filter(s => s.category).length}/{services.length}</div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilterTest;

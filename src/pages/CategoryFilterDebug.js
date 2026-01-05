import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const CategoryFilterDebug = () => {
  const [rawServices, setRawServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const services = await apiService.getServices();
        console.log('Raw services data:', services);
        setRawServices(services);
        
        // Extract categories
        if (services && Array.isArray(services)) {
          const uniqueCategories = [...new Set(services.map(service => service.category).filter(Boolean))];
          console.log('Unique categories found:', uniqueCategories);
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filtering
    if (selectedCategories.length > 0) {
      const filtered = rawServices.filter(service => 
        selectedCategories.includes(service.category)
      );
      console.log('Filtering with categories:', selectedCategories);
      console.log('Filtered services:', filtered);
      setFilteredServices(filtered);
    } else {
      setFilteredServices(rawServices);
    }
  }, [selectedCategories, rawServices]);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(categoryName) 
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName];
      console.log('Category selection changed:', newSelection);
      return newSelection;
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Category Filter Debug</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Categories ({categories.length})</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="mr-3"
                />
                <span className="text-sm">
                  {category} ({rawServices.filter(s => s.category === category).length})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Raw Data Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Raw Data Info</h2>
          <div className="space-y-2 text-sm">
            <div>Total Services: {rawServices.length}</div>
            <div>Selected Categories: {selectedCategories.length}</div>
            <div>Filtered Services: {filteredServices.length}</div>
          </div>
          
          <h3 className="font-semibold mt-4 mb-2">Sample Service Data:</h3>
          <div className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">
            <pre>{JSON.stringify(rawServices.slice(0, 2), null, 2)}</pre>
          </div>
        </div>

        {/* Filtered Results */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Filtered Services ({filteredServices.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredServices.map((service, index) => (
              <div key={service.id || index} className="border-b pb-2">
                <div className="font-medium text-sm">{service.name || service.title}</div>
                <div className="text-xs text-gray-600">Category: {service.category}</div>
                {service.nameAm && (
                  <div className="text-xs text-gray-500">Amharic: {service.nameAm}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Debug Console */}
      <div className="mt-8 bg-gray-900 text-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Console:</h3>
        <div className="text-xs">
          <div>Selected Categories: {JSON.stringify(selectedCategories)}</div>
          <div>Categories Available: {JSON.stringify(categories)}</div>
          <div>Filter Function Result: {filteredServices.length} services</div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilterDebug;

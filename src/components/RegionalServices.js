import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { regions } from '../data/govData';

const RegionalServices = () => {
  return (
    <div className="bg-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">የክልል አገልግሎቶች / Regional Services</h2>
        <p className="text-gray-700 mb-6">Access services specific to your region</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {regions.map((region, index) => (
            <Link
              key={index}
              to="/regions"
              className="bg-white p-4 text-center rounded-lg shadow hover:shadow-md transition-all hover:bg-green-100 border border-green-200"
            >
              <MapPin className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <span className="font-medium text-gray-800">{region}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionalServices;

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Phone, Mail, AlertCircle, ExternalLink } from 'lucide-react';
import { ministries } from '../data/govData';

const Sidebar = () => {
  return (
    <div className="space-y-6">
      {/* Ministries */}
      <div className="bg-white p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4">ሚኒስቴሮች / Ministries</h2>
        <div className="space-y-3">
          {ministries.map((ministry, index) => (
            <Link 
              key={index} 
              to="/ministries" 
              className="block text-green-700 font-medium hover:underline"
            >
              {ministry.name}
            </Link>
          ))}
          
          <Link to="/ministries" className="inline-flex items-center gap-2 text-green-700 font-bold hover:underline pt-3 border-t">
            ሁሉንም ሚኒስቴሮች / All ministries
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Help and Support */}
      <div className="bg-yellow-50 border-2 border-yellow-400 p-6">
        <h3 className="text-xl font-bold mb-4">እገዛ እና ድጋፍ / Help & Support</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-800 hover:text-green-700 cursor-pointer">
            <Phone className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium">Call Center</div>
              <div className="text-sm">8080 (Toll Free)</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-800 hover:text-green-700 cursor-pointer">
            <Mail className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium">Email Support</div>
              <div className="text-sm">info@ethiopia.gov.et</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-800 hover:text-green-700 cursor-pointer">
            <AlertCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium">Emergency Services</span>
          </div>
        </div>
      </div>

      {/* Digital Ethiopia */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-3">🚀 Digital Ethiopia 2025</h3>
        <p className="text-sm mb-4">Ethiopia's digital transformation initiative for modern e-government services</p>
        <Link to="/about" className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded font-bold hover:bg-yellow-500 transition-colors">
          Learn More
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

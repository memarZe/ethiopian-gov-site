import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, ChevronRight } from 'lucide-react';
import { newsItems } from '../data/govData';

const NewsSection = () => {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-3xl font-bold mb-6">አዳዲስ ዜናዎች / Latest Updates</h2>
      <div className="space-y-6">
        {newsItems.map((item, index) => (
          <div key={index} className="bg-white p-6 border-l-4 border-green-600 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <FileText className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <span className="inline-block bg-green-600 text-white text-xs px-3 py-1 rounded mb-3 font-medium">
                  {item.type}
                </span>
                <h3 className="text-xl font-bold text-green-700 hover:underline mb-2">
                  <Link to="/news">{item.title}</Link>
                </h3>
                <p className="text-sm text-gray-600 mb-2">{item.department}</p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {item.date}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        <Link to="/news" className="inline-flex items-center gap-2 text-green-700 font-bold hover:underline text-lg">
          ሁሉንም ዜናዎች ይመልከቱ / See all updates
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default NewsSection;

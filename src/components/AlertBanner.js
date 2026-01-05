import React from 'react';
import { AlertCircle } from 'lucide-react';

const AlertBanner = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-900">አስፈላጊ ማስታወቂያ / Important Notice</h3>
            <p className="text-yellow-800">All government offices will be closed on January 7, 2026 for Ethiopian Christmas (ገና). Emergency services remain available.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;

import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = ({ language, setLanguage, mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <>
      {/* Header */}
      <header className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="flex flex-col items-center">
                <div className="text-3xl">🦁</div>
              </div>
              <div>
                <h1 className="font-bold text-xl md:text-2xl">የኢትዮጵያ መንግስት</h1>
                <p className="text-sm opacity-90">Federal Government of Ethiopia</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-green-800 text-white px-3 py-1 rounded border border-green-600 text-sm"
              >
                <option value="am">አማርኛ</option>
                <option value="en">English</option>
              </select>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Ethiopian Flag Colors Banner */}
      <div className="h-2 flex">
        <div className="flex-1 bg-green-600"></div>
        <div className="flex-1 bg-yellow-400"></div>
        <div className="flex-1 bg-red-600"></div>
      </div>
    </>
  );
};

export default Header;

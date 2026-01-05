import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { footerLinks } from '../data/govData';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">አገልግሎቶች / Services</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a href={link.link} className="hover:text-yellow-400">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">ስለ መንግስት / About Government</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.government.map((link, index) => (
                <li key={index}>
                  <a href={link.link} className="hover:text-yellow-400">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">መረጃ / Information</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.information.map((link, index) => (
                <li key={index}>
                  <a href={link.link} className="hover:text-yellow-400">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">ግንኙነት / Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>8080 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@ethiopia.gov.et</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🦁</div>
              <div className="text-sm">
                <p className="font-bold">Federal Democratic Republic of Ethiopia</p>
                <p className="text-gray-400">የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              {footerLinks.legal.map((link, index) => (
                <a key={index} href={link.link} className="hover:text-yellow-400">{link.name}</a>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center">
            <div className="h-1 flex max-w-md mx-auto mb-4">
              <div className="flex-1 bg-green-600"></div>
              <div className="flex-1 bg-yellow-400"></div>
              <div className="flex-1 bg-red-600"></div>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 Federal Government of Ethiopia. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Powered by Ministry of Innovation and Technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

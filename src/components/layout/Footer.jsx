import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-makin-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="text-2xl font-bold text-makin-orange mb-4">
              MAKIN
            </div>
            <p className="text-gray-300 text-sm">
              Heavy machinery rental platform connecting equipment owners with contractors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search" className="text-gray-300 hover:text-makin-orange">Find Equipment</Link></li>
              <li><Link to="/results" className="text-gray-300 hover:text-makin-orange">Browse All</Link></li>
              <li><Link to="/auth" className="text-gray-300 hover:text-makin-orange">Sign Up</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-300">Excavators</span></li>
              <li><span className="text-gray-300">Bulldozers</span></li>
              <li><span className="text-gray-300">Cranes</span></li>
              <li><span className="text-gray-300">Loaders</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>support@makin.com</li>
              <li>1-800-MAKIN-01</li>
              <li>Mon-Fri 8AM-6PM EST</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Makin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

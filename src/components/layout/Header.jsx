import React from 'react';
import { Link } from 'react-router-dom';
import { User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-makin-orange">
              MAKIN
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/search" className="text-gray-600 hover:text-makin-orange transition-colors">
              Find Equipment
            </Link>
            <Link to="/results" className="text-gray-600 hover:text-makin-orange transition-colors">
              Browse
            </Link>
            <Link to="/components" className="text-gray-600 hover:text-makin-orange transition-colors">
              Components
            </Link>
            <Link to="/map-demo" className="text-gray-600 hover:text-makin-orange transition-colors">
              Map Demo
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-makin-orange">
                  <User className="h-5 w-5" />
                  <span>{user?.name || 'Profile'}</span>
                </Link>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth?mode=login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

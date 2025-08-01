import React from 'react';
import BookingCard from '../components/booking/BookingCard';

const SearchPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Heavy Machinery
          </h1>
          <p className="text-lg text-gray-600">
            Search for construction equipment rentals in your area
          </p>
        </div>
        
        <div className="flex justify-center">
          <BookingCard />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

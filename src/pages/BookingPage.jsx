import React from 'react';
import { useParams } from 'react-router-dom';

const BookingPage = () => {
  const { equipmentId } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Book Equipment
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Equipment ID: {equipmentId}
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="h-64 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                <span className="text-6xl">🚜</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">CAT 320 Excavator</h2>
              <p className="text-gray-600 mb-4">
                Professional grade excavator perfect for construction, demolition, and earthmoving projects.
              </p>
              <div className="text-3xl font-bold text-makin-orange mb-6">$400/day</div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rental Period</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="date" className="border border-gray-300 rounded-lg px-3 py-2" />
                    <input type="date" className="border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                  <input type="text" placeholder="Enter pickup address" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <button className="w-full bg-makin-orange text-white py-3 rounded-lg font-semibold hover:bg-makin-deep-orange transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

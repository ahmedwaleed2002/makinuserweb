import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import VehicleCategories from '../components/booking/VehicleCategories';
import VehicleCategoriesDemo from '../components/booking/VehicleCategoriesDemo';

const BookingPage = () => {
  const { equipmentId } = useParams();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const datesSelected = startDate && endDate;

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
                    <input 
                      type="date" 
                      className="border border-gray-300 rounded-lg px-3 py-2" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="Start Date"
                    />
                    <input 
                      type="date" 
                      className="border border-gray-300 rounded-lg px-3 py-2" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="End Date"
                      min={startDate}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                  <input type="text" placeholder="Enter pickup address" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                {/* Show VehicleCategories only after dates are selected */}
                {datesSelected && (
                  <div className="mb-4">
                    {/* Use VehicleCategoriesDemo for testing, switch to VehicleCategories when database is ready */}
                    <VehicleCategoriesDemo 
                      onCategorySelect={setSelectedCategory} 
                      selectedCategory={selectedCategory} 
                    />
                  </div>
                )}

                <button 
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    datesSelected && selectedCategory 
                      ? 'bg-makin-orange text-white hover:bg-makin-deep-orange' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!datesSelected || !selectedCategory}
                >
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

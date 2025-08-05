import React, { useState } from 'react';
import BookingCard from '../components/booking/BookingCard';
import MapComponent from '../components/maps/MapComponent';

const Homepage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const mockMarkers = [
    {
      id: '1',
      position: { lat: 40.7589, lng: -73.9851 },
      title: 'Equipment Location 1'
    },
    {
      id: '2',
      position: { lat: 40.7505, lng: -73.9934 },
      title: 'Equipment Location 2'
    },
    {
      id: '3',
      position: { lat: 40.7614, lng: -73.9776 },
      title: 'Equipment Location 3'
    }
  ];

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    console.log('Selected location:', location);
  };

  return (
    <div className="relative min-h-screen">
      {/* Map Background */}
      <div className="absolute inset-0">
        <MapComponent
          center={{ lat: 40.7128, lng: -74.0060 }}
          zoom={12}
          markers={mockMarkers}
          onSelectLocation={handleLocationSelect}
          height="100vh"
          className="w-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          {/* Hero Text */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Heavy Machinery
              <br />
              <span className="text-makin-orange">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-lg mx-auto">
              Find and rent construction equipment from verified providers in your area. 
              Get your project moving today.
            </p>
          </div>

          {/* Booking Card */}
          <BookingCard selectedLocation={selectedLocation} />

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
            <div className="text-center text-white">
              <div className="w-12 h-12 bg-makin-orange rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">🚜</span>
              </div>
              <h3 className="font-semibold mb-2">Verified Equipment</h3>
              <p className="text-sm text-gray-300">
                All machinery is inspected and maintained to industry standards
              </p>
            </div>
            
            <div className="text-center text-white">
              <div className="w-12 h-12 bg-makin-orange rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="font-semibold mb-2">Local Providers</h3>
              <p className="text-sm text-gray-300">
                Connect with equipment owners and rental companies near you
              </p>
            </div>
            
            <div className="text-center text-white">
              <div className="w-12 h-12 bg-makin-orange rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-sm text-gray-300">
                No hidden fees. See exactly what you'll pay upfront
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

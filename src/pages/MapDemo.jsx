import React, { useState } from 'react';
import MapComponent from '../components/maps/MapComponent';

const MapDemo = () => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Equipment locations around New York City
  const equipmentLocations = [
    {
      id: '1',
      position: { lat: 40.7589, lng: -73.9851 },
      title: 'CAT 320 Excavator',
      price: '$400/day',
      available: true
    },
    {
      id: '2',
      position: { lat: 40.7505, lng: -73.9934 },
      title: 'John Deere 850K Bulldozer',
      price: '$550/day',
      available: true
    },
    {
      id: '3',
      position: { lat: 40.7614, lng: -73.9776 },
      title: 'Komatsu PC200 Crane',
      price: '$750/day',
      available: false
    },
    {
      id: '4',
      position: { lat: 40.7282, lng: -74.0776 },
      title: 'Volvo L120H Loader',
      price: '$350/day',
      available: true
    },
    {
      id: '5',
      position: { lat: 40.7829, lng: -73.9654 },
      title: 'Caterpillar 966M Loader',
      price: '$450/day',
      available: true
    }
  ];

  const handleMarkerClick = (equipmentId) => {
    const equipment = equipmentLocations.find(eq => eq.id === equipmentId);
    setSelectedEquipment(equipment);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Equipment Location Map
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Find heavy machinery rentals near you using our interactive map
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Interactive Equipment Map
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Click on orange markers to view equipment details
                </p>
              </div>
              
              <div className="h-96">
                <MapComponent
                  center={{ lat: 40.7128, lng: -74.0060 }}
                  zoom={12}
                  markers={equipmentLocations}
                  onMarkerClick={handleMarkerClick}
                  height="100%"
                />
              </div>
            </div>

            {/* Map Features */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Map Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-makin-orange rounded-full border-2 border-white shadow-md flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Equipment Locations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-700">Available Equipment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-700">Unavailable Equipment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-700">Your Location</span>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Equipment Details
                </h2>
              </div>
              
              <div className="p-4">
                {selectedEquipment ? (
                  <div>
                    <div className="h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-4xl">🚜</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedEquipment.title}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="text-sm font-medium text-makin-orange">
                          {selectedEquipment.price}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`text-sm font-medium ${
                          selectedEquipment.available ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {selectedEquipment.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="text-sm text-gray-900">
                          {selectedEquipment.position.lat.toFixed(4)}, {selectedEquipment.position.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      className={`w-full mt-4 py-2 px-4 rounded-lg font-medium ${
                        selectedEquipment.available
                          ? 'bg-makin-orange text-white hover:bg-makin-deep-orange'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!selectedEquipment.available}
                    >
                      {selectedEquipment.available ? 'Book Now' : 'Unavailable'}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🗺️</div>
                    <p className="text-gray-500">
                      Click on a marker on the map to view equipment details
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Available Equipment List */}
            <div className="mt-6 bg-white rounded-lg shadow-lg">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Available Equipment
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {equipmentLocations.filter(eq => eq.available).map((equipment) => (
                    <div 
                      key={equipment.id}
                      className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedEquipment(equipment)}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {equipment.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {equipment.price}
                        </p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDemo;

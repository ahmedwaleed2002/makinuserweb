import React, { useEffect, useRef, useState } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

const MapComponent = ({
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 10,
  markers = [],
  onMarkerClick,
  height = '400px',
  className = ''
}) => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate Google Maps loading
    // In a real implementation, you would load the Google Maps JavaScript API
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div 
        className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-2 text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600">
          <p>Unable to load map</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef}
      className={`relative bg-gray-200 rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Mock Map Interface */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
        {/* Mock Streets */}
        <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-400 opacity-60" />
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400 opacity-60" />
        <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-400 opacity-60" />
        <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-gray-400 opacity-60" />
        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-400 opacity-60" />
        <div className="absolute top-0 bottom-0 left-3/4 w-1 bg-gray-400 opacity-60" />
        
        {/* Mock Markers */}
        {markers.map((marker, index) => (
          <div
            key={marker.id}
            className="absolute w-6 h-6 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${30 + (index * 15)}%`,
              top: `${40 + (index * 10)}%`
            }}
            onClick={() => onMarkerClick?.(marker.id)}
            title={marker.title}
          >
            <div className="w-6 h-6 bg-makin-orange rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        ))}
        
        {/* Center Marker */}
        <div className="absolute top-1/2 left-1/2 w-8 h-8 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-makin-deep-orange rounded-full border-3 border-white shadow-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Mock Google Maps Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md">
        <button className="p-2 hover:bg-gray-50 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-600">+</span>
        </button>
        <button className="p-2 hover:bg-gray-50">
          <span className="text-lg font-bold text-gray-600">−</span>
        </button>
      </div>
      
      {/* Attribution */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white bg-opacity-75 px-2 py-1 rounded">
        Mock Google Maps - Replace with actual API
      </div>
    </div>
  );
};

export default MapComponent;

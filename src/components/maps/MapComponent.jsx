import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Search, Mic, User } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';
import Button from '../ui/Button.jsx';
import { loadGoogleMapsSimple } from '../../utils/simpleGoogleMapsLoader';
import { getCurrentPosition, isGeolocationSupported } from '../../utils/gpsHelper';

const MapComponent = ({
  center = { lat: 31.5204, lng: 74.3587 }, // Default to Lahore, Pakistan
  zoom = 10,
  markers = [],
  onMarkerClick,
  onSelectLocation,
  showLocationButton = true,
  height = '400px',
  className = ''
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [selectedLocationMarker, setSelectedLocationMarker] = useState(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        console.log('MapComponent: Starting Google Maps initialization...');
        
        // Wait for container to be ready
        if (!mapRef.current) {
          console.log('MapComponent: Waiting for map container...');
          // Wait a bit for the ref to be set
          await new Promise(resolve => setTimeout(resolve, 100));
          if (!mapRef.current) {
            console.error('MapComponent: Map container not available after waiting');
            setError('Map container not available');
            setIsLoading(false);
            return;
          }
        }
        
        // Try to load Google Maps
        const google = await loadGoogleMapsSimple();
        console.log('MapComponent: Google Maps loaded successfully', google);
        
        // Double-check container is still available
        if (!mapRef.current) {
          console.error('MapComponent: Map container lost during initialization');
          setError('Map container lost during initialization');
          setIsLoading(false);
          return;
        }
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom: zoom || 15, // Higher default zoom for street-level view
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          
          // Ride-app style controls (minimal UI)
          mapTypeControl: false, // Hide map type switcher
          streetViewControl: false, // Hide street view
          rotateControl: false, // Hide rotation control
          fullscreenControl: false, // Hide fullscreen
          scaleControl: false, // Hide scale
          
          // Keep only zoom controls
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
            style: google.maps.ZoomControlStyle.SMALL
          },
          
          // Smooth interactions like ride apps
          gestureHandling: 'greedy',
          
          // Ride-app style options
          disableDoubleClickZoom: false,
          draggable: true,
          scrollwheel: true,
          
          // Custom styling for clean look
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }] // Hide point of interest labels for cleaner look
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }] // Hide transit labels
            }
          ]
        });

        // Add click listener for location selection
        mapInstance.addListener('click', (mapsMouseEvent) => {
          const latLng = mapsMouseEvent.latLng.toJSON();
          
          // Remove existing selected location marker
          if (selectedLocationMarker) {
            selectedLocationMarker.setMap(null);
          }
          
          // Add new marker at clicked location (ride-app style)
          const marker = new google.maps.Marker({
            position: latLng,
            map: mapInstance,
            title: 'Selected Location',
            animation: google.maps.Animation.DROP,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#FF6B35', // Orange color like your brand
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 3,
              strokeOpacity: 1
            },
            zIndex: 1000
          });
          
          // Add a small pulse animation circle around the marker
          const pulseCircle = new google.maps.Circle({
            strokeColor: '#FF6B35',
            strokeOpacity: 0.3,
            strokeWeight: 2,
            fillColor: '#FF6B35',
            fillOpacity: 0.1,
            map: mapInstance,
            center: latLng,
            radius: 50, // 50 meters radius
          });
          
          setSelectedLocationMarker(marker);
          
          if (onSelectLocation) {
            onSelectLocation(latLng);
          }
        });

        // Add existing markers
        markers.forEach((marker) => {
          new google.maps.Marker({
            position: marker.position,
            map: mapInstance,
            title: marker.title,
          });
        });

        console.log('MapComponent: Map instance created successfully');
        setMap(mapInstance);
        setIsLoading(false);
        
      } catch (err) {
        console.error('Google Maps loading error:', err);
        console.error('Error details:', {
          message: err.message,
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing',
          windowGoogle: !!window.google
        });
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    initializeMap();

    // Cleanup function to remove listeners and markers
    return () => {
      if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
      }
      if (selectedLocationMarker) {
        selectedLocationMarker.setMap(null);
      }
      if (window.google && window.google.maps && map) {
        window.google.maps.event.clearInstanceListeners(map);
      }
    };
  }, [center, zoom, onSelectLocation, markers]);

  // Function to get current location
  const handleGetCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const position = await getCurrentPosition();
      
      // If we have a real Google Maps instance
      if (map && window.google && window.google.maps) {
        // Center map on current location
        map.setCenter(position);
        map.setZoom(15);
        
        // Remove existing current location marker
        if (currentLocationMarker) {
          currentLocationMarker.setMap(null);
        }
        
        // Add current location marker (ride-app style)
        const marker = new window.google.maps.Marker({
          position,
          map,
          title: 'Your Current Location',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285F4', // Blue for current location
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
          zIndex: 2000 // Higher than selected location
        });
        
        // Add accuracy circle around current location
        const accuracyCircle = new window.google.maps.Circle({
          strokeColor: '#4285F4',
          strokeOpacity: 0.2,
          strokeWeight: 1,
          fillColor: '#4285F4',
          fillOpacity: 0.1,
          map,
          center: position,
          radius: 100, // 100 meters accuracy radius
        });
        
        setCurrentLocationMarker(marker);
      }
      
      // Call onSelectLocation with current position (works for both real and fallback map)
      if (onSelectLocation) {
        onSelectLocation(position);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      // Don't set error here, let the map fallback handle it
    } finally {
      setGettingLocation(false);
    }
  };

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
    // Show fallback map with clickable functionality
    return (
      <div className="relative">
        <div 
          className={`relative bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden cursor-crosshair ${className}`}
          style={{ height }}
          onClick={(e) => {
            if (onSelectLocation) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 360 - 180;
              const y = 90 - ((e.clientY - rect.top) / rect.height) * 180;
              onSelectLocation({ lat: y, lng: x });
            }
          }}
        >
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
              onClick={(e) => {
                e.stopPropagation();
                onMarkerClick?.(marker.id);
              }}
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
          
          {/* Error Notice */}
          <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 text-sm text-yellow-800">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span>Map Preview Mode - Click to select location</span>
            </div>
          </div>
        </div>
        
        {/* Current Location Button */}
        {showLocationButton && isGeolocationSupported() && (
          <div className="absolute top-4 right-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGetCurrentLocation}
              loading={gettingLocation}
              icon={<Navigation className="w-4 h-4" />}
              className="bg-white shadow-md hover:shadow-lg"
            >
              Current Location
            </Button>
          </div>
        )}
        
        {/* Click instruction */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg px-3 py-2 text-sm text-gray-600 shadow-md">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Click on the map to select a location</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Full screen map */}
      <div 
        ref={mapRef}
        className={`absolute inset-0 ${className}`}
        style={{ height }}
      />
      
      {/* Google Maps Mobile App UI Overlay */}
      
      {/* Top Search Bar */}
      <div className="absolute top-0 left-0 right-0 bg-transparent p-4">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search here"
              className="flex-1 text-gray-700 text-lg outline-none"
              onClick={(e) => e.stopPropagation()}
            />
            <Mic className="w-5 h-5 text-gray-400 ml-3" />
            <div className="w-8 h-8 bg-gray-300 rounded-full ml-3 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Chips */}
      <div className="absolute top-20 left-0 right-0 px-4">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md whitespace-nowrap">
            <span className="text-lg mr-2">🍽️</span>
            <span className="text-sm font-medium">Restaurants</span>
          </div>
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md whitespace-nowrap">
            <span className="text-lg mr-2">⛽</span>
            <span className="text-sm font-medium">Gas</span>
          </div>
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md whitespace-nowrap">
            <span className="text-lg mr-2">☕</span>
            <span className="text-sm font-medium">Coffee</span>
          </div>
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md whitespace-nowrap">
            <span className="text-lg mr-2">🏨</span>
            <span className="text-sm font-medium">Hotels</span>
          </div>
        </div>
      </div>
      
      {/* Current Location Button */}
      {showLocationButton && isGeolocationSupported() && (
        <div className="absolute bottom-32 right-4">
          <button
            onClick={handleGetCurrentLocation}
            disabled={gettingLocation}
            className="bg-white hover:bg-gray-50 p-4 rounded-full shadow-xl border border-gray-200 transition-all duration-200"
            title="Get Current Location"
          >
            {gettingLocation ? (
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Navigation className="w-6 h-6 text-blue-500" />
            )}
          </button>
        </div>
      )}
      
      {/* Bottom Info Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900">Latest in the area</h3>
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-2xl mr-1">☀️</span>
              <span>34°</span>
            </div>
          </div>
          
          {/* Bottom Navigation */}
          <div className="flex justify-around pt-4 border-t border-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mb-1">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-teal-600">Explore</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-1 relative">
                <span className="text-gray-600 text-lg">📍</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">1</span>
                </div>
              </div>
              <span className="text-sm text-gray-600">You</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                <span className="text-gray-600 text-lg">➕</span>
              </div>
              <span className="text-sm text-gray-600">Contribute</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Selection Instruction (if needed) */}
      {onSelectLocation && (
        <div className="absolute bottom-40 left-4 bg-black bg-opacity-70 rounded-lg px-3 py-2 text-sm text-white">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Tap to select location</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;

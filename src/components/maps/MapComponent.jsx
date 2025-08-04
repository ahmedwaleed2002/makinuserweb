import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom orange marker icon for equipment locations
const createCustomIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #ff6f03;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background-color: white;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
  });
};

const MapComponent = ({
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 10,
  markers = [],
  onMarkerClick,
  height = '400px',
  className = ''
}) => {
  // Convert center object to array format for Leaflet
  const mapCenter = [center.lat, center.lng];
  
  // Convert markers to Leaflet format
  const leafletMarkers = markers.map(marker => ({
    id: marker.id,
    position: [marker.position.lat, marker.position.lng],
    title: marker.title
  }));

  return (
    <div 
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height, width: '100%' }}
    >
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Center marker */}
        <Marker 
          position={mapCenter}
          icon={createCustomIcon()}
        >
          <Popup>
            <div className="text-center">
              <strong>Your Location</strong><br />
              Heavy machinery rental center
            </div>
          </Popup>
        </Marker>
        
        {/* Equipment markers */}
        {leafletMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={createCustomIcon()}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(marker.id);
                }
              },
            }}
          >
            <Popup>
              <div className="text-center">
                <strong>{marker.title}</strong><br />
                <span className="text-sm text-gray-600">Equipment available here</span><br />
                <button 
                  className="mt-2 px-3 py-1 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
                  onClick={() => onMarkerClick && onMarkerClick(marker.id)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsSimple } from '../utils/simpleGoogleMapsLoader';

const MapTestPage = () => {
  const mapRef = useRef(null);
  const [status, setStatus] = useState('Starting...');
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const loadMap = async () => {
      try {
        addLog('🚀 Starting Google Maps test with simple loader...');
        setStatus('🔄 Loading Google Maps API...');
        
        // Use the simple loader
        const google = await loadGoogleMapsSimple();
        
        addLog('✅ Google Maps loaded successfully!');
        setStatus('✅ Google Maps loaded successfully!');
        createMap();
        
      } catch (error) {
        addLog(`❌ Error loading Google Maps: ${error.message}`);
        setStatus(`❌ Error: ${error.message}`);
      }
    };

    const createMap = () => {
      addLog('🗺️ Creating map instance...');
      
      if (!mapRef.current) {
        addLog('❌ Map container (mapRef.current) is null');
        setStatus('❌ Map container not available');
        return;
      }
      
      addLog(`📐 Map container dimensions: ${mapRef.current.offsetWidth}x${mapRef.current.offsetHeight}`);

      try {
        addLog('🏗️ Creating Google Maps instance...');
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 31.5204, lng: 74.3587 }, // Lahore, Pakistan
          zoom: 15,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        });
        addLog('✅ Map instance created successfully');

        // Add a marker
        addLog('📍 Adding marker...');
        new window.google.maps.Marker({
          position: { lat: 31.5204, lng: 74.3587 },
          map: map,
          title: 'Lahore, Pakistan'
        });
        addLog('✅ Marker added successfully');

        setStatus('✅ Map created successfully with real Google Maps!');
        addLog('🎉 Map test completed successfully!');
      } catch (error) {
        addLog(`❌ Error creating map: ${error.message}`);
        addLog(`❌ Error stack: ${error.stack}`);
        setStatus(`❌ Error creating map: ${error.message}`);
      }
    };

    loadMap();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🗺️ Google Maps Debug Test</h1>
      <div style={{ marginBottom: '20px' }}>
        <h3>Status: {status}</h3>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Debug Log:</h3>
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '5px', 
          maxHeight: '200px', 
          overflowY: 'auto',
          fontSize: '12px'
        }}>
          {logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '2px' }}>{log}</div>
          ))}
        </div>
      </div>
      
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px', 
          backgroundColor: '#f0f0f0',
          border: '2px solid #ccc',
          borderRadius: '8px',
          position: 'relative'
        }} 
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#666',
          fontSize: '14px'
        }}>
          Map will appear here when loaded
        </div>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Troubleshooting:</strong></p>
        <ul>
          <li>Check console for detailed logs</li>
          <li>Verify API key in Google Cloud Console</li>
          <li>Ensure "Maps JavaScript API" is enabled</li>
          <li>Check API key restrictions (HTTP referrers)</li>
        </ul>
      </div>
    </div>
  );
};

export default MapTestPage;

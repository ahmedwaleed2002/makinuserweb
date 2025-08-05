// GPS utility for getting user's current location

export const getCurrentPosition = (options = {}) => {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    // Default options
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 60000, // 1 minute cache
      ...options
    };

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        resolve({
          lat: latitude,
          lng: longitude,
          accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        let errorMessage = 'Failed to get current location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      defaultOptions
    );
  });
};

// Watch position for real-time updates
export const watchCurrentPosition = (onSuccess, onError, options = {}) => {
  if (!navigator.geolocation) {
    onError(new Error('Geolocation is not supported by this browser'));
    return null;
  }

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
    ...options
  };

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      onSuccess({
        lat: latitude,
        lng: longitude,
        accuracy,
        timestamp: position.timestamp
      });
    },
    (error) => {
      let errorMessage = 'Failed to watch location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
        default:
          errorMessage = 'An unknown error occurred while watching location';
          break;
      }
      
      onError(new Error(errorMessage));
    },
    defaultOptions
  );

  return watchId;
};

// Stop watching position
export const clearWatch = (watchId) => {
  if (navigator.geolocation && watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
};

// Check if geolocation is supported
export const isGeolocationSupported = () => {
  return 'geolocation' in navigator;
};

// Get location with reverse geocoding (requires Google Maps API)
export const getCurrentLocationWithAddress = async (options = {}) => {
  try {
    const position = await getCurrentPosition(options);
    
    // Check if Google Maps is loaded for reverse geocoding
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      
      return new Promise((resolve, reject) => {
        geocoder.geocode(
          { location: { lat: position.lat, lng: position.lng } },
          (results, status) => {
            if (status === 'OK' && results[0]) {
              resolve({
                ...position,
                address: results[0].formatted_address,
                addressComponents: results[0].address_components
              });
            } else {
              resolve({
                ...position,
                address: null,
                error: 'Reverse geocoding failed'
              });
            }
          }
        );
      });
    }
    
    // Return position without address if Google Maps is not loaded
    return {
      ...position,
      address: null
    };
  } catch (error) {
    throw error;
  }
};

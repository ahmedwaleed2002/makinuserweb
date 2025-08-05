// Unified Google Maps loader with duplicate prevention
let isLoading = false;
let loadPromise = null;

export const loadGoogleMapsSimple = () => {
  // If already loaded, return immediately
  if (window.google && window.google.maps) {
    console.log('Google Maps already loaded');
    return Promise.resolve(window.google);
  }

  // If already loading, return the existing promise
  if (isLoading && loadPromise) {
    console.log('Google Maps loading in progress, waiting...');
    return loadPromise;
  }

  // Check if script is already in DOM
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (existingScript) {
    console.log('Google Maps script already exists, waiting for load...');
    // Return a promise that waits for the existing script to load
    return new Promise((resolve, reject) => {
      const checkLoaded = () => {
        if (window.google && window.google.maps) {
          resolve(window.google);
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
    });
  }

  // Start loading
  isLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    // Get API key
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    console.log('API Key available:', !!apiKey);
    
    if (!apiKey) {
      isLoading = false;
      loadPromise = null;
      reject(new Error('Google Maps API key not found'));
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    console.log('Loading Google Maps script...');
    
    script.onload = () => {
      console.log('Script loaded, checking for Google Maps...');
      
      // Poll for Google Maps availability
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      
      const checkGoogleMaps = () => {
        attempts++;
        console.log(`Checking Google Maps availability... attempt ${attempts}`);
        
        if (window.google && window.google.maps) {
          console.log('✅ Google Maps is now available!');
          isLoading = false;
          resolve(window.google);
        } else if (attempts >= maxAttempts) {
          console.error('❌ Google Maps failed to load after polling');
          isLoading = false;
          loadPromise = null;
          reject(new Error('Google Maps failed to load after script execution'));
        } else {
          setTimeout(checkGoogleMaps, 100); // Check every 100ms
        }
      };
      
      // Start checking immediately
      checkGoogleMaps();
    };

    script.onerror = (error) => {
      console.error('❌ Script failed to load:', error);
      isLoading = false;
      loadPromise = null;
      reject(new Error('Failed to load Google Maps script'));
    };

    // Add to document
    document.head.appendChild(script);
  });

  return loadPromise;
};

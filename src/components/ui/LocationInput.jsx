import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { loadGoogleMapsSimple } from '../../utils/simpleGoogleMapsLoader';

const LocationInput = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  onLocationSelect,
  helperText,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  // Initialize Google Places services
  useEffect(() => {
    loadGoogleMapsSimple().then((google) => {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      // Create a dummy map for PlacesService (required by Google Maps API)
      const dummyMap = new google.maps.Map(document.createElement('div'));
      placesService.current = new google.maps.places.PlacesService(dummyMap);
    }).catch((error) => {
      console.error('Failed to load Google Maps for autocomplete:', error);
    });
  }, []);

  // Handle input change and fetch suggestions
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(e);

    if (inputValue.length > 2 && autocompleteService.current) {
      setIsLoading(true);
      
      autocompleteService.current.getPlacePredictions(
        {
          input: inputValue,
          types: ['geocode'], // Only geographic locations
        },
        (predictions, status) => {
          setIsLoading(false);
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.slice(0, 5)); // Limit to 5 suggestions
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (prediction) => {
    if (placesService.current) {
      placesService.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ['geometry', 'formatted_address']
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const location = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              formatted_address: place.formatted_address
            };
            
            // Update input value with formatted address
            const syntheticEvent = {
              target: { value: place.formatted_address }
            };
            onChange(syntheticEvent);
            
            // Call onLocationSelect if provided
            if (onLocationSelect) {
              onLocationSelect(location);
            }
            
            setShowSuggestions(false);
            setSuggestions([]);
          }
        }
      );
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-1" ref={inputRef}>
      {label && (
        <label className="block text-sm font-medium text-makin-black">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-makin-black placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-makin-orange/20 focus:border-makin-orange hover:border-gray-400 ${className}`}
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            autoComplete="off"
          />
          
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-makin-orange border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
        
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((prediction) => (
              <button
                key={prediction.place_id}
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                onClick={() => handleSuggestionClick(prediction)}
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-makin-orange mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {prediction.structured_formatting.main_text}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {prediction.structured_formatting.secondary_text}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default LocationInput;

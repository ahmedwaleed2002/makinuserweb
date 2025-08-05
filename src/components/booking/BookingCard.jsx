import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Map } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LocationInput from '../ui/LocationInput';
import MapComponent from '../maps/MapComponent';
import VehicleCategories from './VehicleCategories';
import { requestService } from '../../services/requestService';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

const BookingCard = ({ selectedLocation }) => {
  const navigate = useNavigate();
  const { setBookingData } = useBooking();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    location: '',
    startDate: '',
    endDate: ''
  });
  const [locationCoords, setLocationCoords] = useState(null); // Store coordinates separately

  const [isSearching, setIsSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Update location when a location is selected from the map
  useEffect(() => {
    if (selectedLocation) {
      // Store coordinates for database
      setLocationCoords(selectedLocation);
      
      // Get readable address using reverse geocoding
      if (window.google && window.google.maps) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { location: selectedLocation },
          (results, status) => {
            if (status === 'OK' && results[0]) {
              setFormData(prev => ({
                ...prev,
                location: results[0].formatted_address
              }));
            } else {
              // Fallback to coordinates if geocoding fails
              const locationString = `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`;
              setFormData(prev => ({
                ...prev,
                location: locationString
              }));
            }
          }
        );
      } else {
        // Fallback to coordinates if Google Maps not loaded
        const locationString = `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`;
        setFormData(prev => ({
          ...prev,
          location: locationString
        }));
      }
    }
  }, [selectedLocation]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMapLocationSelect = (location) => {
    // Store coordinates for database
    setLocationCoords(location);
    
    // Get readable address using reverse geocoding
    if (window.google && window.google.maps) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: location },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            setFormData(prev => ({
              ...prev,
              location: results[0].formatted_address
            }));
          } else {
            // Fallback to coordinates if geocoding fails
            const locationString = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
            setFormData(prev => ({
              ...prev,
              location: locationString
            }));
          }
        }
      );
    } else {
      // Fallback to coordinates if Google Maps not loaded
      const locationString = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
      setFormData(prev => ({
        ...prev,
        location: locationString
      }));
    }
    
    setShowMap(false); // Hide map after selection
  };

  const handleSearch = async () => {
    // Check authentication first
    if (!user) {
      alert('Please sign in to your account first to find equipment.');
      return;
    }

    setIsSearching(true);
    
    // Calculate duration and price for this booking
    const duration = calculateDuration();
    const recommendedPrice = calculateRecommendedPrice();
    
    // Set booking data in context
    const bookingData = {
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate,
      selectedCategory: selectedCategory,
      duration: duration,
      recommendedPrice: recommendedPrice,
      dailyRate: selectedCategory?.base_price_per_hour ? parseFloat(selectedCategory.base_price_per_hour) * 24 : 0
    };
    setBookingData(bookingData);

    // Save request to database
    try {
      const requestData = {
        ...bookingData,
        userId: user.$id, // Use logged-in user ID
        machineryCategory: selectedCategory.name,
        operatorRequired: false, // Adjust based on your UI logic
        budgetRange: Math.ceil(recommendedPrice), // Example logic
        description: '',
        latitude: locationCoords?.lat?.toString() || '', // Use stored coordinates
        longitude: locationCoords?.lng?.toString() || '' // Use stored coordinates
      };
      const response = await requestService.createRequest(requestData);
      console.log('Request saved:', response);
      // Navigate to bidding page
      navigate('/bidding', { state: bookingData });
    } catch (error) {
      console.error('Failed to save request:', error);
      alert('Failed to save your request. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const datesSelected = formData.startDate && formData.endDate;
  
  // Calculate duration and price
  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // At least 1 day
    return diffDays;
  };
  
  const calculateRecommendedPrice = () => {
    if (!selectedCategory || !selectedCategory.base_price_per_hour) return 0;
    const duration = calculateDuration();
    const hourlyRate = parseFloat(selectedCategory.base_price_per_hour);
    const dailyRate = hourlyRate * 24; // 24 hours per day
    const totalPrice = dailyRate * duration;
    return totalPrice;
  };
  
  const duration = calculateDuration();
  const recommendedPrice = calculateRecommendedPrice();
  
  // Form is valid if location, dates, and category are all selected
  const isFormValid = formData.location && formData.startDate && formData.endDate && selectedCategory;

  // Debug logging
  console.log('Debug - Form Data:', formData);
  console.log('Debug - Dates Selected:', datesSelected);
  console.log('Debug - Selected Category:', selectedCategory);
  console.log('Debug - Duration (days):', duration);
  console.log('Debug - Recommended Price:', recommendedPrice);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-4">
      {/* Form Fields */}
      <div className="space-y-4">
        <LocationInput
          label="Location"
          placeholder={selectedLocation ? "Location selected from map" : "Enter address"}
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          onLocationSelect={(location) => {
            // Store coordinates from LocationInput selection
            setLocationCoords({ lat: location.lat, lng: location.lng });
            // The LocationInput component already updates the display text
          }}
          helperText={selectedLocation ? "✓ Location selected from map" : "Type to see location suggestions"}
        />
        
        {/* Choose Location on Map Button */}
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="flex items-center justify-center space-x-2 text-makin-orange hover:text-makin-deep-orange font-medium py-2 px-4 border border-makin-orange rounded-lg hover:bg-orange-50 transition-colors"
        >
          <Map className="w-4 h-4" />
          <span>{showMap ? 'Hide Map' : 'Choose Location on Map'}</span>
        </button>
        
        {/* Map Component - Full Screen Google Maps Style */}
        {showMap && (
          <div className="fixed inset-0 z-50 bg-white">
            <MapComponent
              center={{ lat: 31.5204, lng: 74.3587 }}
              zoom={15}
              onSelectLocation={(location) => {
                handleMapLocationSelect(location);
                // Auto-close map after selection
                setTimeout(() => setShowMap(false), 1000);
              }}
              height="100vh"
              className="w-full h-full"
            />
            {/* Close Button */}
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg z-10"
            >
              <span className="text-gray-600 text-xl">✕</span>
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            icon={<Calendar />}
            min={new Date().toISOString().split('T')[0]} // Today's date
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            icon={<Calendar />}
            min={formData.startDate || new Date().toISOString().split('T')[0]} // Start date or today
          />
        </div>
        
        {/* Vehicle Categories - Always visible */}
        <div className="mt-4">
          <VehicleCategories 
            onCategorySelect={setSelectedCategory} 
            selectedCategory={selectedCategory} 
          />
        </div>
        
        {/* Price Summary - Show when dates and category are selected */}
        {datesSelected && selectedCategory && (
          <div className="mt-4 p-4 bg-gradient-to-r from-makin-orange/10 to-orange-100 rounded-lg border border-makin-orange/20">
            <h3 className="text-lg font-semibold text-makin-black mb-3">Price Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{duration} {duration === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-medium">{selectedCategory.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">${selectedCategory.base_price_per_hour}/hour</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Daily Rate:</span>
                <span className="font-medium">${(parseFloat(selectedCategory.base_price_per_hour) * 24).toFixed(2)}/day</span>
              </div>
              <hr className="border-makin-orange/20" />
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-makin-black">Recommended Price:</span>
                <span className="font-bold text-makin-orange">${recommendedPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full mt-6"
        onClick={handleSearch}
        loading={isSearching}
        disabled={!isFormValid}
      >
        FIND EQUIPMENT
      </Button>
    </div>
  );
};

export default BookingCard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useBooking } from '../../context/BookingContext';

const BookingCard = () => {
  const navigate = useNavigate();
  const { setBookingData } = useBooking();
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    startDate: '',
    endDate: '',
    rentalType: 'job' // 'job' or 'hourly'
  });

  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Set booking data in context
    setBookingData({
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      startDate: formData.startDate,
      endDate: formData.endDate,
      rentalType: formData.rentalType
    });

    // Simulate API delay
    setTimeout(() => {
      navigate('/search');
    }, 500);
  };

  const isFormValid = formData.pickupLocation && formData.startDate && formData.endDate;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
      {/* Rental Type Tabs */}
      <div className="flex mb-6">
        <button
          onClick={() => handleInputChange('rentalType', 'job')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-lg border transition-colors ${
            formData.rentalType === 'job'
              ? 'bg-makin-orange text-white border-makin-orange'
              : 'bg-gray-50 text-makin-gray border-gray-300 hover:bg-gray-100'
          }`}
        >
          FOR A JOB
        </button>
        <button
          onClick={() => handleInputChange('rentalType', 'hourly')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-lg border-t border-r border-b transition-colors ${
            formData.rentalType === 'hourly'
              ? 'bg-makin-orange text-white border-makin-orange'
              : 'bg-gray-50 text-makin-gray border-gray-300 hover:bg-gray-100'
          }`}
        >
          BY THE HOUR
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <Input
          label="Pickup Location"
          placeholder="Enter pickup address"
          value={formData.pickupLocation}
          onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
          icon={<MapPin />}
        />

        {formData.rentalType === 'job' && (
          <Input
            label="Delivery Location (Optional)"
            placeholder="Enter delivery address"
            value={formData.dropoffLocation}
            onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
            icon={<MapPin />}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            icon={<Calendar />}
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            icon={<Calendar />}
          />
        </div>

        {formData.rentalType === 'hourly' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              icon={<Clock />}
            />
            <Input
              label="End Time"
              type="time"
              icon={<Clock />}
            />
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

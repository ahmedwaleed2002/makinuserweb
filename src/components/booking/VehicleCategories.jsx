import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import LoadingSpinner from '../ui/LoadingSpinner';

const VehicleCategories = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('VehicleCategories - Fetching categories from database...');
      const categoriesData = await vehicleService.getVehicleCategories();
      console.log('VehicleCategories - Fetched categories:', categoriesData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError('Failed to load vehicle categories');
      console.error('VehicleCategories - Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchCategories}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-makin-black">Choose a Vehicle</label>
        <p className="text-sm text-gray-500">Select your preferred vehicle type</p>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <div
            key={category.$id}
            onClick={() => handleCategoryClick(category)}
            className={`
              flex flex-col items-center min-w-[80px] p-3 rounded-lg cursor-pointer transition-all
              ${selectedCategory?.$id === category.$id 
                ? 'bg-orange-50 border-2 border-makin-orange' 
                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }
            `}
          >
            {/* Vehicle Image */}
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              {category.image_url ? (
                <img 
                  src={category.image_url} 
                  alt={category.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No img</span>
                </div>
              )}
            </div>
            
            {/* Vehicle Name */}
            <span className="text-sm font-medium text-gray-800 text-center">
              {category.name}
            </span>
            
            {/* Price (if available) */}
            {category.base_price_per_hour && (
              <span className="text-xs text-gray-600 mt-1">
                ${category.base_price_per_hour}/hr
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Selected Category Details */}
      {selectedCategory && (
        <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-makin-orange/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8">
              {selectedCategory.image_url ? (
                <img 
                  src={selectedCategory.image_url} 
                  alt={selectedCategory.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 rounded"></div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-makin-black">{selectedCategory.name}</h4>
              {selectedCategory.base_price_per_hour && (
                <p className="text-sm text-gray-600">
                  Base rate: ${selectedCategory.base_price_per_hour}/hour
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleCategories;

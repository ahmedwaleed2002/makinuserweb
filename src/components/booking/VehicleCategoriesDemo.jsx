import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

// Sample data that matches your database structure
const sampleCategories = [
  {
    $id: '1',
    name: 'Moto',
    image_url: 'https://via.placeholder.com/48x48/4CAF50/FFFFFF?text=🏍️',
    base_price_per_hour: '15',
    created_at: new Date().toISOString()
  },
  {
    $id: '2',
    name: 'Mini',
    image_url: 'https://via.placeholder.com/48x48/2196F3/FFFFFF?text=🚗',
    base_price_per_hour: '25',
    created_at: new Date().toISOString()
  },
  {
    $id: '3',
    name: 'Auto',
    image_url: 'https://via.placeholder.com/48x48/FF9800/FFFFFF?text=🚕',
    base_price_per_hour: '20',
    created_at: new Date().toISOString()
  },
  {
    $id: '4',
    name: 'Ride A/C',
    image_url: 'https://via.placeholder.com/48x48/9C27B0/FFFFFF?text=❄️',
    base_price_per_hour: '35',
    created_at: new Date().toISOString()
  },
  {
    $id: '5',
    name: 'Premium',
    image_url: 'https://via.placeholder.com/48x48/795548/FFFFFF?text=✨',
    base_price_per_hour: '50',
    created_at: new Date().toISOString()
  }
];

const VehicleCategoriesDemo = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('VehicleCategoriesDemo - Component mounted');
    // Simulate API call delay
    const timer = setTimeout(() => {
      console.log('VehicleCategoriesDemo - Setting categories:', sampleCategories);
      setCategories(sampleCategories);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
                  className="w-full h-full object-contain rounded"
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
                  className="w-full h-full object-contain rounded"
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

export default VehicleCategoriesDemo;

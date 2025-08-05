import React, { useState } from 'react';
import VehicleCategoriesDemo from './VehicleCategoriesDemo';

const VehicleCategoriesTest = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Vehicle Categories Test</h2>
        <VehicleCategoriesDemo 
          onCategorySelect={setSelectedCategory} 
          selectedCategory={selectedCategory} 
        />
        {selectedCategory && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold">Selected:</h3>
            <p>{selectedCategory.name} - ${selectedCategory.base_price_per_hour}/hr</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleCategoriesTest;

import React, { useState, useEffect } from 'react';
import VehicleCategories from '../components/booking/VehicleCategories';
import { vehicleService } from '../services/vehicleService';

const DatabaseTestPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [directTestResult, setDirectTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const testDirectConnection = async () => {
    setTesting(true);
    try {
      console.log('Testing direct database connection...');
      const categories = await vehicleService.getVehicleCategories();
      console.log('Direct test result:', categories);
      setDirectTestResult(`Success! Found ${categories.length} categories: ${categories.map(c => c.name).join(', ')}`);
    } catch (error) {
      console.error('Direct test failed:', error);
      setDirectTestResult(`Error: ${error.message}`);
    }
    setTesting(false);
  };

  useEffect(() => {
    testDirectConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
        
        {/* Direct API Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Direct API Test</h2>
          <button 
            onClick={testDirectConnection}
            disabled={testing}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test Database Connection'}
          </button>
          {directTestResult && (
            <div className={`mt-4 p-4 rounded ${directTestResult.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {directTestResult}
            </div>
          )}
        </div>

        {/* Component Test */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">VehicleCategories Component Test</h2>
          <VehicleCategories 
            onCategorySelect={setSelectedCategory} 
            selectedCategory={selectedCategory} 
          />
          {selectedCategory && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-semibold">Selected Category (Raw Data):</h3>
              <pre className="text-sm mt-2 overflow-auto">
                {JSON.stringify(selectedCategory, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseTestPage;

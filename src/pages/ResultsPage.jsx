import React from 'react';

const ResultsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Equipment Results
          </h1>
          <p className="text-lg text-gray-600">
            Browse available heavy machinery for rent
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md p-6">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🚜</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">CAT 320 Excavator</h3>
              <p className="text-gray-600 mb-4">Professional grade excavator for construction projects</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-makin-orange">$400/day</span>
                <button className="bg-makin-orange text-white px-4 py-2 rounded-lg hover:bg-makin-deep-orange transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;

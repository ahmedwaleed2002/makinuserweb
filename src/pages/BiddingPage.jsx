import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users } from 'lucide-react';
import { requestService } from '../services/requestService';

const BiddingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [driversViewing, setDriversViewing] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(86400); // 24 hours in seconds
  const [bids, setBids] = useState([]);
  const [requestId, setRequestId] = useState(location.state?.requestId);
  const [requestData, setRequestData] = useState(null);

  // Fetch actual request data
  useEffect(() => {
    if (!requestId) return;

    const fetchRequest = async () => {
      const response = await requestService.getRequestById(requestId);
      if (response.success) {
        setRequestData(response.data);
      } else {
        console.error('Error fetching request:', response.error);
      }
    };

    fetchRequest();
  }, [requestId]);

  // Simulate drivers viewing the request
  useEffect(() => {
    const interval = setInterval(() => {
      setDriversViewing(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = Math.max(1, Math.min(5, prev + change));
        return newCount;
      });
    }, 3000);

    // Initial count
    setDriversViewing(3);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Map Section */}
      <div className="relative h-64 bg-gray-200">
        {/* Placeholder for map - you can integrate your MapComponent here */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20">
          <div className="absolute top-4 left-4">
            <button 
              onClick={() => navigate(-1)}
              className="bg-white rounded-full p-2 shadow-lg"
            >
              ←
            </button>
          </div>
          
          {/* Location marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
              <div className="bg-white rounded-full w-3 h-3"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-t-xl -mt-4 relative z-10 min-h-screen">
        <div className="px-6 py-4">
          {/* Drivers viewing indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[...Array(Math.min(driversViewing, 3))].map((_, i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-gray-700 font-medium">
                {driversViewing} drivers are viewing your request
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Good fare. Your request gets priority</span>
              <span className="text-2xl font-bold">{formatTime(timeRemaining)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-black h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeRemaining / 86400) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Request ID and Actions */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button className="bg-gray-100 rounded-full px-4 py-2 text-gray-600">
                -5
              </button>
              <span className="text-3xl font-bold">{`PKR${requestData?.budgetRange || 'N/A'}`}</span>
              <button className="bg-gray-100 rounded-full px-4 py-2 text-gray-600">
                +5
              </button>
            </div>
            <button className="text-gray-400 text-lg">
              Raise fare
            </button>
          </div>

          {/* Request Details */}
          <div className="space-y-4 text-gray-600">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5" />
              <span>Pickup from current location</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5" />
              <span>Estimated duration: {location.state?.duration || 'N/A'} days</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5" />
              <span>Equipment: {location.state?.selectedCategory?.name || 'N/A'}</span>
            </div>
          </div>

          {/* Cancel Button */}
          <div className="fixed bottom-6 left-6 right-6">
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold"
            >
              Cancel Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingPage;

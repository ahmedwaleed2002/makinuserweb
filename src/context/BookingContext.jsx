import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingDataState] = useState(null);

  const setBookingData = (data) => {
    setBookingDataState(data);
  };

  const clearBookingData = () => {
    setBookingDataState(null);
  };

  const value = {
    bookingData,
    setBookingData,
    clearBookingData
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Homepage from './pages/Homepage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ComponentLibrary from './pages/ComponentLibrary.jsx';
import VehicleCategoriesTest from './components/booking/VehicleCategoriesTest.jsx';
import DatabaseTestPage from './pages/DatabaseTestPage.jsx';
import BiddingPage from './pages/BiddingPage.jsx';
import MapTestPage from './pages/MapTestPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BookingProvider } from './context/BookingContext.jsx';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/booking/:equipmentId" element={<BookingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/components" element={<ComponentLibrary />} />
                <Route path="/test-vehicle-categories" element={<VehicleCategoriesTest />} />
                <Route path="/test-database" element={<DatabaseTestPage />} />
                <Route path="/test-map" element={<MapTestPage />} />
                <Route path="/bidding" element={<BiddingPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;

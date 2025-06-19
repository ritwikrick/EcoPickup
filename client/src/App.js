import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Booking from './pages/Booking';
import LastBookingDetails from './pages/LastBookingDetails';

const App = () => {
  const isAuthenticated = localStorage.getItem('token');
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/booking" element={isAuthenticated ? <Booking /> : <Navigate to="/login" />} />
        <Route path="/last-booking" element={isAuthenticated ? <LastBookingDetails /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
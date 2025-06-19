import React, { useState } from 'react';
import axios from 'axios';

const Booking = () => {
  const dummyCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune'];
  const dummyStreets = {
    Mumbai: ['Andheri', 'Bandra', 'Marine Drive'],
    Delhi: ['Saket', 'Karol Bagh', 'Connaught Place'],
    Bangalore: ['Whitefield', 'Indiranagar', 'Koramangala'],
    Hyderabad: ['Madhapur', 'Banjara Hills', 'Gachibowli'],
    Pune: ['Kothrud', 'Hinjewadi', 'Shivaji Nagar'],
  };

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [wasteTypes, setWasteTypes] = useState({
    wet: false,
    dry: false,
    hazardous: false,
    ewaste: false,
    biomedical: false,
  });

  const [lastBooking, setLastBooking] = useState(null);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleStreetChange = (e) => {
    setSelectedStreet(e.target.value);
  };

  const handleWasteChange = (e) => {
    setWasteTypes(prev => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleBooking = async () => {
    if (!selectedCity || !selectedStreet || !timeSlot) {
      return alert('⚠️ Please fill all required fields');
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('⚠️ Please login to book a pickup');

      const bookingData = {
        city: selectedCity,
        street: selectedStreet,
        timeSlot,
        wasteTypes,
      };

      const res = await axios.post('http://localhost:8080/api/booking', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.message) {
        alert('✅ ' + res.data.message);
        setLastBooking(bookingData);
      }
    } catch (error) {
      console.error('Booking failed:', error);
      alert('❌ Booking failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-6 py-12 md:px-24 lg:px-48">
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-16">
        🚮 EcoPickup
      </h1>

      <div className="grid md:grid-cols-2 gap-10 mb-10">
        <div>
          <label className="block text-gray-400 mb-2 text-lg font-medium">City</label>
          <select
            className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCity}
            onChange={handleCityChange}
          >
            <option value="">Select a city</option>
            {dummyCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 mb-2 text-lg font-medium">Locality</label>
          <select
            className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedStreet}
            onChange={handleStreetChange}
          >
            <option value="">Select a locality</option>
            {selectedCity && dummyStreets[selectedCity]?.map(street => (
              <option key={street} value={street}>{street}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-10">
        <label className="block text-gray-400 mb-2 text-lg font-medium">Time Slot</label>
        <select
          className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={timeSlot}
          onChange={e => setTimeSlot(e.target.value)}
        >
          <option value="">Select a time</option>
          {['5 AM', '6 AM', '7 AM', '8 AM', '9 AM'].map(slot => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
      </div>

      <div className="mb-16">
        <label className="block text-gray-400 mb-4 text-lg font-semibold">♻️ Select Waste Types</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(wasteTypes).map(([key, checked]) => (
            <label key={key} className="flex items-center space-x-3 text-gray-300 capitalize text-base">
              <input
                type="checkbox"
                name={key}
                checked={checked}
                onChange={handleWasteChange}
                className="accent-blue-500 w-5 h-5"
              />
              <span>{key}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-center mb-10">
        <button
          onClick={handleBooking}
          className="bg-blue-600 hover:bg-blue-700 transition px-10 py-4 rounded-full text-lg font-bold shadow-md"
        >
          🗓️ Schedule Pickup
        </button>
      </div>

      {/* Booking Details */}
      {lastBooking && (
        <div className="mt-12 border-t border-gray-700 pt-10 text-white max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-green-400 mb-6">
            ✅ Your Booking Details
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-lg px-6">
            <p>
              <span className="font-semibold text-gray-400">City:</span>{' '}
              <span className="text-gray-300">{lastBooking.city}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-400">Locality:</span>{' '}
              <span className="text-gray-300">{lastBooking.street}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-400">Time Slot:</span>{' '}
              <span className="text-gray-300">{lastBooking.timeSlot}</span>
            </p>
            <p className="md:col-span-2">
              <span className="font-semibold text-gray-400">Waste Types:</span>{' '}
              <span className="text-gray-300">
                {Object.entries(lastBooking.wasteTypes)
                  .filter(([_, v]) => v)
                  .map(([type]) => type)
                  .join(', ') || 'None'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;

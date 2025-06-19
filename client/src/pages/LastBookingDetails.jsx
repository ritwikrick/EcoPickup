import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LastBookingDetails = () => {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/booking', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking(res.data.data);
      } catch (err) {
        console.error('Failed to fetch booking');
      }
    };
    fetchBooking();
  }, []);

  if (!booking) return <div className="p-6 text-center">No Booking Found</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded mt-10">
      <h2 className="text-xl font-bold mb-4">Last Booking Details</h2>
      <p><strong>City:</strong> {booking.city}</p>
      <p><strong>Street:</strong> {booking.street}</p>
      <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
      <p className="mt-2 font-semibold">Waste Types:</p>
      <ul className="list-disc list-inside">
        {Object.entries(booking.wasteTypes).map(([key, value]) => value && <li key={key}>{key}</li>)}
      </ul>
    </div>
  );
};

export default LastBookingDetails;
const express = require('express');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/authMiddleware');
const sendBookingEmails = require('../utils/sendBookingEmails');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { city, street, timeSlot, wasteTypes } = req.body;

    const userEmail = req.userEmail;
    if (!userEmail) {
      console.error('User email missing in request');
      return res.status(400).json({ message: 'User email not found, please login again.' });
    }

    console.log('Booking request:', { userEmail, city, street, timeSlot, wasteTypes });

    const booking = new Booking({
      userId: req.userId,
      city,
      street,
      timeSlot,
      wasteTypes,
    });

    await booking.save();

    console.log('Booking saved, sending emails...');
    await sendBookingEmails(userEmail, city, street, timeSlot, wasteTypes);
    console.log('Emails sent successfully.');

    res.status(200).json({ message: 'Booking successful and confirmation emails sent.', data: booking });

  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({ message: 'Booking failed due to server error.' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const lastBooking = await Booking.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ data: lastBooking });
  } catch (error) {
    console.error('Error fetching latest booking:', error);
    res.status(500).json({ message: 'Fetching latest booking failed.' });
  }
});

module.exports = router;

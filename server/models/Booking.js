const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  city: { type: String, required: true },
  street: { type: String, required: true },
  timeSlot: { type: String, required: true },
  wasteTypes: {
    wet: { type: Boolean, required: true },
    dry: { type: Boolean, required: true },
    hazardous: { type: Boolean, required: true },
    ewaste: { type: Boolean, required: true },
    biomedical: { type: Boolean, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
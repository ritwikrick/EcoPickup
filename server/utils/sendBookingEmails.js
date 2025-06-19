const nodemailer = require('nodemailer');
require('dotenv').config(); // Load env variables

const sendBookingEmails = async (userEmail, city, street, timeSlot, wasteTypes) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const userMessage = `✅ Your garbage pickup has been scheduled in ${street}, ${city} at ${timeSlot}.`;

    const selectedWasteTypes = Object.entries(wasteTypes)
      .filter(([_, selected]) => selected)
      .map(([type]) => type.charAt(0).toUpperCase() + type.slice(1))
      .join(', ') || 'None';

    const mailOptionsUser = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Garbage Pickup Scheduled ✅',
      text: userMessage
    };

    const mailOptionsAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Admin is you
      subject: '🗂️ New Pickup Scheduled',
      text: `📌 User ${userEmail} scheduled garbage pickup in ${street}, ${city} at ${timeSlot}.\n♻️ Waste Types: ${selectedWasteTypes}`
    };

    const infoUser = await transporter.sendMail(mailOptionsUser);
    console.log('✅ User email sent:', infoUser.response);

    const infoAdmin = await transporter.sendMail(mailOptionsAdmin);
    console.log('✅ Admin email sent:', infoAdmin.response);

  } catch (error) {
    console.error('❌ Error sending booking emails:', error);
    throw error;
  }
};

module.exports = sendBookingEmails;

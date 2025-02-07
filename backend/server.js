const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows JSON data in requests

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Route to send general contact emails
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER, // Your email to receive messages
        subject: `New Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: 'Email sent successfully!' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// API Route to handle reservations
app.post('/api/reservations', async (req, res) => {
    const { name, phone, person, reservationDate, time, message } = req.body;

    if (!name || !phone || !person || !reservationDate || !time) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Your email to receive reservations
        subject: `New Reservation from ${name}`,
        text: `Name: ${name}\nPhone: ${phone}\nPersons: ${person}\nDate: ${reservationDate}\nTime: ${time}\nMessage: ${message || 'No additional message'}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: 'Reservation request sent successfully!' });
    } catch (error) {
        console.error("Error sending reservation email:", error);
        res.status(500).json({ error: 'Failed to send reservation request' });
    }
});

// Test Route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

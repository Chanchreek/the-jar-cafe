const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Twilio Client
const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

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
    const { name, email, phone, person, reservationDate, time, message } = req.body;

    if (!name || !email || !phone || !person || !reservationDate || !time) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    // Email to Admin
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, 
        subject: `New Reservation from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nPersons: ${person}\nDate: ${reservationDate}\nTime: ${time}\nMessage: ${message || 'No additional message'}`,
    };

    // Confirmation Email to User
    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Reservation is Confirmed - The Jar Café",
        text: `Dear ${name},\n\nThank you for making a reservation at The Jar Café!\n\nHere are your reservation details:\nDate: ${reservationDate}\nTime: ${time}\nPersons: ${person}\n\nWe look forward to serving you!\n\nBest Regards,\nThe Jar Café`,
    };

    // WhatsApp Confirmation Message to User
    const whatsappMessage = `Hello ${name}, your reservation at The Jar Café is confirmed!\n\nDate: ${reservationDate}\nTime: ${time}\nPersons: ${person}\n\nSee you soon! ☕`;
    const userPhoneNumber = phone.startsWith("+") ? phone : `+91${phone}`;
    try {
        await Promise.all([
            transporter.sendMail(adminMailOptions), // Email to Admin
            transporter.sendMail(userMailOptions),  // Email to User
            client.messages.create({  // WhatsApp Message
                from: process.env.TWILIO_WHATSAPP_NUMBER,
                to: `whatsapp:${userPhoneNumber}`,  // User's WhatsApp Number
                body: whatsappMessage
            })
        ]);

        res.status(200).json({ success: 'Reservation request sent successfully! Confirmation email & WhatsApp message sent.' });
    } catch (error) {
        console.error("Error sending reservation request:", error);
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

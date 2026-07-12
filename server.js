import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Create Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration at startup to surface auth/connectivity errors
transporter.verify(function(error, success) {
  if (error) {
    console.error('Nodemailer transporter verification failed:', error);
  } else {
    console.log('Nodemailer transporter is ready to send messages');
  }
});

// Endpoint to send OTP
app.post('/api/send-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your AssetFlow Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #2563eb; text-align: center;">AssetFlow ERP</h2>
        <p>Hello,</p>
        <p>Your verification code is:</p>
        <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e293b; border-radius: 8px;">
          ${otp}
        </div>
        <p style="margin-top: 20px; font-size: 14px; color: #64748b;">If you did not request this code, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to ${email}`);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email. Check your credentials.' });
  }
});

// Endpoint to send Approval Email
app.post('/api/send-approval', async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ success: false, message: 'Email and Role are required' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'AssetFlow Account Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #10b981; text-align: center;">Account Approved</h2>
        <p>Congratulations!</p>
        <p>Your AssetFlow account has been approved by the Administrator.</p>
        <p>You have been assigned the role of: <strong>${role}</strong></p>
        <p style="margin-top: 20px;">You may now log in to access your dashboard.</p>
        <a href="http://localhost:5173/login" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 15px;">Login to AssetFlow</a>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent successfully to ${email}`);
    res.status(200).json({ success: true, message: 'Approval email sent successfully' });
  } catch (error) {
    console.error('Error sending approval email:', error);
    res.status(500).json({ success: false, message: 'Failed to send approval email.' });
  }
});

app.listen(PORT, () => {
  console.log(`Email server running on http://localhost:${PORT}`);
  console.log(`Please ensure you have configured EMAIL_USER and EMAIL_PASS in your .env file.`);
});

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email, otp, name) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for HD Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">HD Account Verification</h2>
        <p>Hello ${name || 'User'},</p>
        <p>Your One-Time Password (OTP) for HD account verification is:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
        <hr style="margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">This is an automated message from HD.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// API Routes

// Send OTP for signup
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email, name, dateOfBirth } = req.body;

    // Validate required fields
    if (!email || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and name are required' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpId = uuidv4();

    // Store OTP with expiration (10 minutes)
    otpStore.set(otpId, {
      otp,
      email,
      name,
      dateOfBirth,
      createdAt: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, name);

    if (emailSent) {
      res.json({
        success: true,
        message: 'OTP sent successfully to your email',
        otpId: otpId // Return OTP ID for verification
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }
  } catch (error) {
    console.error('Error in send-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify OTP and signup
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { otpId, otp } = req.body;

    if (!otpId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP ID and OTP are required'
      });
    }

    // Get stored OTP data
    const otpData = otpStore.get(otpId);

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Check if OTP is expired
    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(otpId);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // OTP is valid - remove from store
    otpStore.delete(otpId);

    // Here you would typically save user to database
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        name: otpData.name,
        email: otpData.email,
        dateOfBirth: otpData.dateOfBirth
      }
    });

  } catch (error) {
    console.error('Error in verify-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Send OTP for signin
app.post('/api/signin-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpId = uuidv4();

    // Store OTP with expiration (10 minutes)
    otpStore.set(otpId, {
      otp,
      email,
      type: 'signin',
      createdAt: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, 'User');

    if (emailSent) {
      res.json({
        success: true,
        message: 'OTP sent successfully to your email',
        otpId: otpId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }
  } catch (error) {
    console.error('Error in signin-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify OTP for signin
app.post('/api/verify-signin', async (req, res) => {
  try {
    const { otpId, otp } = req.body;

    if (!otpId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP ID and OTP are required'
      });
    }

    // Get stored OTP data
    const otpData = otpStore.get(otpId);

    if (!otpData || otpData.type !== 'signin') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Check if OTP is expired
    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(otpId);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // OTP is valid - remove from store
    otpStore.delete(otpId);

    res.json({
      success: true,
      message: 'Sign in successful!',
      user: {
        email: otpData.email
      }
    });

  } catch (error) {
    console.error('Error in verify-signin:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Clean up expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [otpId, otpData] of otpStore.entries()) {
    if (now > otpData.expiresAt) {
      otpStore.delete(otpId);
    }
  }
}, 5 * 60 * 1000);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Import models
const User = require('./models/User');
const Note = require('./models/Note');

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

    // Save user to database
    try {
      const user = new User({
        name: otpData.name,
        email: otpData.email,
        dateOfBirth: otpData.dateOfBirth
      });

      await user.save();

      res.json({
        success: true,
        message: 'Account created successfully!',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      if (dbError.code === 11000) {
        res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create account'
        });
      }
    }

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

    // Find user in database
    try {
      const user = await User.findOne({ email: otpData.email });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found. Please sign up first.'
        });
      }

      res.json({
        success: true,
        message: 'Sign in successful!',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      res.status(500).json({
        success: false,
        message: 'Failed to sign in'
      });
    }

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

// Note Management Endpoints

// Get all notes for a user
app.get('/api/notes/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Find user by email first
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const notes = await Note.find({ userId: user._id }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      notes: notes
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notes'
    });
  }
});

// Create a new note
app.post('/api/notes', async (req, res) => {
  try {
    const { title, content, email } = req.body;
    
    if (!title || !content || !email) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and email are required'
      });
    }
    
    // Find user by email first
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const note = new Note({
      title,
      content,
      userId: user._id
    });
    
    await note.save();
    
    res.json({
      success: true,
      message: 'Note created successfully',
      note: note
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create note'
    });
  }
});

// Update a note
app.put('/api/notes/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }
    
    const note = await Note.findByIdAndUpdate(
      noteId,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Note updated successfully',
      note: note
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update note'
    });
  }
});

// Delete a note
app.delete('/api/notes/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    
    const note = await Note.findByIdAndDelete(noteId);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete note'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

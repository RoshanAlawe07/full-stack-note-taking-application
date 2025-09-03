const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'fallback-jwt-secret-for-development-only';
}

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-app';
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};


app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://full-stack-note-taking-application-production.up.railway.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


const User = require('./models/User');
const Note = require('./models/Note');


const otpStore = new Map();


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Access denied. No token provided.' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        message: 'Invalid or expired token.' 
      });
    }
    req.user = user;
    next();
  });
};


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


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


app.post('/api/send-otp', async (req, res) => {
  try {
    const { email, name, dateOfBirth } = req.body;


    if (!email || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and name are required' 
      });
    }


    const otp = generateOTP();
    const otpId = uuidv4();


    otpStore.set(otpId, {
      otp,
      email,
      name,
      dateOfBirth,
      createdAt: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000)
    });

    
    const emailSent = await sendOTPEmail(email, otp, name);

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
    console.error('Error in send-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


app.post('/api/verify-otp', async (req, res) => {
  try {
    const { otpId, otp } = req.body;

    if (!otpId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP ID and OTP are required'
      });
    }


    const otpData = otpStore.get(otpId);

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }


    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(otpId);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }


    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }


    otpStore.delete(otpId);


    try {
      const user = new User({
        name: otpData.name,
        email: otpData.email,
        dateOfBirth: otpData.dateOfBirth
      });

      await user.save();

      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Account created successfully!',
        token: token,
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


app.post('/api/signin-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }


    const otp = generateOTP();
    const otpId = uuidv4();


    const otpData = {
      otp,
      email,
      type: 'signin',
      createdAt: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000)
    };
    otpStore.set(otpId, otpData);

    
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


app.post('/api/verify-signin', async (req, res) => {
  try {
    const { otpId, otp } = req.body;
    if (!otpId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP ID and OTP are required'
      });
    }


    const otpData = otpStore.get(otpId);

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new OTP.'
      });
    }

    if (otpData.type !== 'signin') {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP type'
      });
    }


    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(otpId);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }


    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }


    otpStore.delete(otpId);


    try {
      const user = await User.findOne({ email: otpData.email });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found. Please sign up first.'
        });
      }

      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Sign in successful!',
        token: token,
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


setInterval(() => {
  const now = Date.now();
  for (const [otpId, otpData] of otpStore.entries()) {
    if (now > otpData.expiresAt) {
      otpStore.delete(otpId);
    }
  }
}, 5 * 60 * 1000);


app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    
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


app.post('/api/notes', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }
    
    const note = new Note({
      title,
      content,
      userId: req.user.userId
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


app.put('/api/notes/:noteId', authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }
    

    const note = await Note.findOne({ _id: noteId, userId: req.user.userId });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or access denied'
      });
    }
    
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Note updated successfully',
      note: updatedNote
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update note'
    });
  }
});


app.delete('/api/notes/:noteId', authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    

    const note = await Note.findOne({ _id: noteId, userId: req.user.userId });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or access denied'
      });
    }
    
    await Note.findByIdAndDelete(noteId);
    
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


app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

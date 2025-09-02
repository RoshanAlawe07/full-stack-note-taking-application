# Backend Server Setup

This backend server handles OTP generation and email sending for the note-taking application.

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Email Configuration

#### For Gmail:
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

#### Create Environment File:
```bash
cp env.example .env
```

Edit `.env` file with your email credentials:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

PORT=5000
NODE_ENV=development
```

### 3. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

### 4. Test the API
Visit `http://localhost:5000/api/health` to check if the server is running.

## API Endpoints

### Send OTP for Signup
- **POST** `/api/send-otp`
- **Body**: `{ "name": "John Doe", "email": "john@example.com", "dateOfBirth": "01 January 1990" }`

### Verify OTP for Signup
- **POST** `/api/verify-otp`
- **Body**: `{ "otpId": "uuid", "otp": "123456" }`

### Send OTP for Signin
- **POST** `/api/signin-otp`
- **Body**: `{ "email": "john@example.com" }`

### Verify OTP for Signin
- **POST** `/api/verify-signin`
- **Body**: `{ "otpId": "uuid", "otp": "123456" }`

## Features

- ✅ 6-digit OTP generation
- ✅ Email sending with HTML templates
- ✅ OTP expiration (10 minutes)
- ✅ Automatic cleanup of expired OTPs
- ✅ CORS enabled for frontend integration
- ✅ Error handling and validation
- ✅ Loading states and user feedback

## Troubleshooting

### Email Not Sending
1. Check your email credentials in `.env`
2. Ensure 2FA is enabled and app password is correct
3. Check server logs for error messages

### CORS Issues
The server is configured to allow requests from `http://localhost:3000` (React dev server).

### OTP Expired
OTPs expire after 10 minutes. Users need to request a new OTP if expired.

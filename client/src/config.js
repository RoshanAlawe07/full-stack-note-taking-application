const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://full-stack-note-taking-application.onrender.com';

export const API_ENDPOINTS = {
  SEND_OTP: `${API_BASE_URL}/api/send-otp`,
  VERIFY_OTP: `${API_BASE_URL}/api/verify-otp`,
  SIGNIN_OTP: `${API_BASE_URL}/api/signin-otp`,
  VERIFY_SIGNIN: `${API_BASE_URL}/api/verify-signin`,
  NOTES: `${API_BASE_URL}/api/notes`,
  HEALTH: `${API_BASE_URL}/api/health`
};

export default API_BASE_URL;

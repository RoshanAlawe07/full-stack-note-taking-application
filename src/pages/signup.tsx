import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config';

interface SignupProps {
  setCurrentPage: (page: string) => void;
  setUserData: (user: any) => void;
}

const Signup: React.FC<SignupProps> = ({ setCurrentPage, setUserData }) => {
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [otpId, setOtpId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: '',
    otp: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGetOTP = async () => {
    // Validate required fields
    if (!formData.name || !formData.email) {
      setMessage('Please fill in your name and email');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('API_ENDPOINTS.SEND_OTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpId(data.otpId);
        setShowOTP(true);
        setMessage('OTP sent to your email! Please check your inbox.');
      } else {
        setMessage(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Error sending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.otp) {
      setMessage('Please enter the OTP');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('API_ENDPOINTS.VERIFY_OTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otpId: otpId,
          otp: formData.otp
        }),
      });

      const data = await response.json();
      console.log('Signup response:', data);
      console.log('Response status:', response.status);

      if (data.success) {
        setMessage('Account created successfully! Welcome to HD!');
        // Store JWT token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUserData(data.user);
        // Reset form
        setFormData({ name: '', dateOfBirth: '', email: '', otp: '' });
        setShowOTP(false);
        setOtpId('');
        // Show success message and redirect to dashboard
        setTimeout(() => {
          setMessage('Redirecting to your dashboard...');
          setTimeout(() => {
            setCurrentPage('dashboard');
            setMessage('');
          }, 1500);
        }, 2000);
      } else {
        setMessage(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Error verifying OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Logo - Desktop */}
      <div className="absolute top-6 left-6 z-10 hidden md:block">
        <img src="/logo.png" alt="HD Logo" className="h-8 w-16" />
      </div>



      {/* Form Section */}
      <div className="w-full md:w-2/5 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-sm w-full space-y-8">
          {/* Desktop Title */}
          <div className="text-left mt-16 hidden md:block">
            <h2 className="text-3xl font-bold text-gray-900">Sign up</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign up to enjoy the feature of HD.
            </p>
          </div>

          {/* Mobile Title */}
          <div className="text-center mt-8 md:hidden">
            <img src="/logo.png" alt="HD Logo" className="h-8 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h2>
            <p className="text-sm text-gray-600">
              Sign up to enjoy the feature of HD.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Jonas Khanwald"
                  />
                  <label htmlFor="name" className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-500 peer-focus:text-blue-600">
                    Your Name
                  </label>
                </div>
              </div>

              <div className="relative">
                <div className="relative">
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white text-gray-700"
                    max="2010-12-31"
                    min="1900-01-01"
                  />
                  <label htmlFor="dateOfBirth" className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-500 peer-focus:text-blue-600">
                    Date of Birth
                  </label>
                </div>
              </div>

              <div className="relative">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="jonas_kahnwald@gmail.com"
                  />
                  <label htmlFor="email" className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-500 peer-focus:text-blue-600">
                    Email
                  </label>
                </div>
              </div>

              {showOTP && (
                <div className="relative">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-500 mb-1">
                    OTP
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      placeholder="OTP"
                      value={formData.otp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white"
                    />
                  </div>
                  <div className="mt-2 text-right">
                    <button 
                      type="button"
                      onClick={handleGetOTP}
                      className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Message Display */}
            {message && (
              <div className={`text-center text-sm p-3 rounded-lg ${
                message.includes('success') || message.includes('sent') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={showOTP ? handleSubmit : handleGetOTP}
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {showOTP ? 'Verifying...' : 'Sending OTP...'}
                </div>
              ) : (
                showOTP ? 'Sign up' : 'Get OTP'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <span 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                  onClick={() => setCurrentPage('signin')}
                >
                  Sign in
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Desktop Background Image */}
      <div 
        className="hidden md:block md:w-3/5 relative overflow-hidden"
        style={{
          backgroundImage: `url('/434.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute bottom-8 right-8 flex flex-col space-y-4">
          <button className="w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-200 relative">
            R
            <span className="absolute -top-1 -right-1 text-xs bg-white text-gray-600 rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
          <button className="w-12 h-12 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-200">
            L
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
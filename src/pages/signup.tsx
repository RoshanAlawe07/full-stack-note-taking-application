import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiUser, FiCalendar, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
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

  const handleGetOTP = () => {
    setShowOTP(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex">
      <div className="absolute top-6 left-6 z-10">
        <img src="/logo.png" alt="HD Logo" className="h-8 w-16" />
      </div>

      <div className="w-2/5 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-sm w-full space-y-8">
          <div className="text-left mt-16">
            <h2 className="text-3xl font-bold text-gray-900">Sign up</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign up to enjoy the feature of HD.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-1">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Jonas Khanwald"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-500 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="11 December 1997"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="jonas_kahnwald@gmail.com"
                  />
                </div>
              </div>

              {showOTP && (
                <div className="relative">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-500 mb-1">
                    OTP
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="otp"
                      name="otp"
                      placeholder="OTP"
                      value={formData.otp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleGetOTP}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              {showOTP ? 'Sign up' : 'Get OTP'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account??{' '}
                <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div 
        className="hidden lg:block lg:w-3/5 relative overflow-hidden"
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
import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Signin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Logo - Desktop */}
      <div className="absolute top-6 left-6 z-10 hidden md:block">
        <img src="/logo.png" alt="HD Logo" className="h-8 w-16" />
      </div>

      {/* Mobile Logo */}
      <div className="md:hidden absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <img src="/logo.png" alt="HD Logo" className="h-8 w-16" />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-2/5 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-sm w-full space-y-8">
          {/* Desktop Title */}
          <div className="text-left mt-16 hidden md:block">
            <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please login to continue to your account.
            </p>
          </div>

          {/* Mobile Title */}
          <div className="text-center mt-20 md:hidden">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
            <p className="text-sm text-gray-600">
              Please login to continue to your account.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
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
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="jonas_kahnwald@gmail.com"
                  />
                  <label htmlFor="email" className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-500 peer-focus:text-blue-600">
                    Email
                  </label>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-500 mb-1">
                  OTP
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="OTP"
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
            </div>

            {/* Mobile-specific elements */}
            <div className="md:hidden space-y-4">
              <div className="text-left">
                <Link to="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Resend OTP
                </Link>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="keepLoggedIn"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="keepLoggedIn" className="ml-2 block text-sm text-gray-700">
                  Keep me logged in
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Sign in
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need an account??{' '}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Create one
                </Link>
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

export default Signin;

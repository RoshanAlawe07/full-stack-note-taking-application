import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  return (
    <div className="min-h-screen flex">
      <div className="absolute top-6 left-6 z-10">
        <img src="/logo.png" alt="HD Logo" className="h-8 w-16" />
      </div>

      <div className="w-2/5 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-sm w-full space-y-8">
          <div className="text-left mt-16">
            <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please login to continue to your account.
            </p>
          </div>

          <form className="mt-8 space-y-6">
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="jonas_kahnwald@gmail.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white"
                />
                <label 
                  htmlFor="email" 
                  className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-blue-500"
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="otp"
                    name="otp"
                    placeholder="OTP"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-200 bg-white"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <div className="mt-1 text-left">
                  <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
                    Resend OTP
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="keep-logged-in"
                name="keep-logged-in"
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="keep-logged-in" className="ml-2 block text-sm text-gray-700">
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Sign in
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need an account?{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Create one
                </a>
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
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';


const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [role, setRole] = useState(location.state?.role || 'user');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    setRole(location.state?.role || 'user');
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    
    // Focus on the last filled input or first empty input
    const lastFilledIndex = newOtp.findIndex((digit, index) => !digit && index > 0);
    const focusIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex - 1;
    document.getElementById(`otp-${Math.max(0, focusIndex)}`)?.focus();
  };

  const verifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verifyotp`, {
        email,
        otp: parseInt(otpString)
      }, { withCredentials: true });

      if (response.status === 200) {
        setSuccess('OTP verified successfully!');
        // Navigate to reset password page with email and role
        setTimeout(() => {
          console.log(parseInt(otpString));
          navigate('/reset-password', {
            state: { email, role,otp:parseInt(otpString), verified: true }
          });
        }, 1500);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to verify OTP. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email) {
      setError('Email is required to resend OTP');
      return;
    }

    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgotpassword`, {
        email,
        role
      }, { withCredentials: true });

      if (response.status === 200) {
        setSuccess('OTP resent successfully!');
        setCountdown(60); // Set 60 second countdown
        setOtp(['', '', '', '', '', '']); // Clear OTP inputs
        document.getElementById('otp-0')?.focus(); // Focus first input
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to resend OTP. Please try again.'
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
        <h1 className="text-3xl font-bold w-full text-center mb-2">
          Verify OTP
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email
        </p>

        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Email Address</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="border p-2 rounded w-full"
            required
            disabled={location.state?.email} // Disable if email passed from previous page
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-center">Enter OTP Code</h3>
          <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            ))}
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>Enter the 6-digit code from your email</p>
            <p className="text-xs text-gray-500 mt-1">
              Code expires in 10 minutes
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={verifyOtp}
            disabled={isLoading || otp.join('').length !== 6}
            className="hover:cursor-pointer bg-gray-800 text-white p-2 rounded w-full hover:bg-gray-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-gray-500 text-sm">
                Resend OTP in {countdown}s
              </p>
            ) : (
              <button
                onClick={resendOtp}
                disabled={resendLoading || !email}
                className="text-blue-600 hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          <p className="text-center">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Back to Forgot Password
            </Link>
          </p>

          <p className="text-center">
            <Link to="/user-login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

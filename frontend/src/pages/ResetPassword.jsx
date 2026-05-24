import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setnewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');
  const [role, setRole] = useState(location.state?.role || 'user');
  const [isVerified, setIsVerified] = useState(location.state?.verified || false);
  const [otp, setOtp] = useState(location.state?.otp || null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    // Check if user came from OTP verification
    if (!isVerified) {
      setError('Please verify your OTP first before resetting password');
      // Auto-redirect to verify OTP after 2 seconds
      const timer = setTimeout(() => {
        navigate('/verify-otp', { state: { email, role } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVerified, navigate, email, role]);







  const resetPassword = async () => {
    

    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/resetpassword`, {
        email,
        newPassword,
        role,
        otp
      }, { withCredentials: true });

      if (response.status === 200) {
        setSuccess('Password reset successfully!');
        // Clear form
        setnewPassword('');
        setConfirmPassword('');
        setPasswordStrength(0);

        // Redirect to login after 2 seconds
        navigate('/user-login');
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to reset password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword();
  };

  if (!isVerified) {
    return (
      <div className="flex flex-col items-center min-h-screen justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Verification Required</h2>
          <p className="text-gray-600 mb-4">
            Please verify your OTP first before resetting password.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to OTP verification...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
        <h1 className="text-3xl font-bold w-full text-center mb-2">
          Reset Password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your new password below
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

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Email Address</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="border p-2 rounded w-full"
              required
              disabled={isVerified} // Disable if email passed from verification
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">New Password</h3>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setnewPassword(e.target.value)}
              placeholder="Enter new password"
              className="border p-2 rounded w-full mb-2"
              required
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Confirm New Password</h3>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="border p-2 rounded w-full mb-2"
            />
            {confirmPassword && (
              <div className="text-xs mt-1">
                {newPassword === confirmPassword ? (
                  <span className="text-green-600">✓ Passwords match</span>
                ) : (
                  <span className="text-red-600">✗ Passwords do not match</span>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || newPassword !== confirmPassword }
            className="hover:cursor-pointer bg-gray-800 text-white p-2 rounded w-full hover:bg-gray-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>

          <div className="mt-4 space-y-2">
            <p className="text-center">
              <Link to="/verify-otp" className="text-blue-600 hover:underline">
                Back to Verify OTP
              </Link>
            </p>
            <p className="text-center">
              <Link to="/user-login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

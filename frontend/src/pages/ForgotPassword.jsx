import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const ForgotPassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState( location.state?.email || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [role, setRole] = useState( location.state?.role || '');
  

  async function submitHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setRole(location.state?.role );
    
    try {
     const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgotpassword`, { email,role }, { withCredentials: true });
     if(res.status === 200){
      
      navigate('/verify-otp', { state: { email, role } });
      
     }
      setEmail('');
    } catch (err) {
      setError(
        err?.response?.data?.message );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
        <h1 className="text-3xl font-bold w-full text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your email 
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-semibold mb-1">Email Address</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="border p-2 rounded w-full mb-6"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="hover:cursor-pointer bg-gray-800 text-white p-2 rounded w-full hover:bg-gray-950 transition disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'sending otp'}
          </button>

          <p className="text-center mt-4">
            <Link to="/user-login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

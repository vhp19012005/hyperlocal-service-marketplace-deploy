import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState('');
  const {user,setUser} = useContext(UserDataContext);

  async function submitHandler(e) {
    e.preventDefault();
    
    // Check for admin login
   
    // Normal user login
    const newUser = {
      email: email,
      password: password
    };
    try{
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user/login`, newUser,{withCredentials:true});

      if(response.status === 200){
       if (email === 'admin@admin.com' && password === 'admin123') {
      const adminData = {
        id: 1,
        name: "Admin User",
        email: "admin@admin.com",
        role: "admin"
      };
      
      // Set admin data in UserContext for admin functionality
      setUser({
        isAuth: true,
        loading: false,
        profile: adminData
      });
      
      console.log('Admin login successful:', adminData);
      navigate('/admin/dashboard');
      return;
    }
    

        const data = response.data.user;
        setUser({
          isAuth: true,
          loading: false,
          profile: data
        });
        console.log('Login successful:', user);
        
        navigate('/');
      }
    }catch(err){
      setError(err.response?.data?.message || 'Login failed');
    }
    setEmail('');
    setPassword('');
  } 


  return (
    <div className='flex flex-col items-center min-h-screen justify-center bg-gray-100'>
      <div className="bg-white p-8 rounded shadow-md w-full  max-w-xl">
        <h1 className="text-3xl font-bold  w-full text-center mb-6">
          Login
        </h1>
        
      

        {error && <div className='bg-red-100 text-red-700 p-2 rounded mb-4 text-center'>{error}</div>}
        <form onSubmit={(e) => {submitHandler(e)}}>
          
         
          <h3 className="text-lg font-semibold mb-1">
            Email Address
          </h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="border p-2 rounded w-full mb-4"
          />

          <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold mb-1">
            Password
          </h3>
          <Link to="/forgot-password"   state={{ email: email, role: 'user' }}
  className="text-blue-600 text-sm hover:underline">
              Forgot password?
            </Link>
            </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="border p-2 rounded w-full mb-6"
          />
          

          <button
            type="submit"
            className="hover:cursor-pointer bg-gray-800 text-white p-2 rounded w-full hover:bg-gray-950 transition"
          >
            Login
          </button>
          <p className='text-center mt-4'>
        New here?   <Link  to={'/user-signup'} className='text-blue-600'>Create new Account</Link>
        </p>
        <div className='mt-16'>
        <Link to={'/service-provider-login'} className='flex justify-center items-center rounded px-4 mb-3 py-2  w-full font-semibold placeholder:text-base bg-blue-500 hover:bg-blue-600 text-white'>Login as a Service Provider</Link>
        </div>
        </form>
        
      </div>
    </div>

  )
}

export default UserLogin

import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ServiceProviderDataContext } from '../context/ServiceProviderContext';
const ServiceProviderLogin = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState('');
  const {provider,setProvider} = useContext(ServiceProviderDataContext);

  async function submitHandler(e) {
    e.preventDefault();
    const newUser = {
      email: email,
      password: password
    };
    try{
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/sprovider/login`, newUser,{withCredentials:true});
    if(response.status === 200){
      const data = response.data;
      setProvider(data.provider);
      navigate('/sprofile');
    }  
  }catch(err){
    setError(err.response.data.message);
  }
    setEmail('');
    setPassword('');
  } 
  return (
    <div className='flex flex-col items-center min-h-screen justify-center bg-gray-100'>
      <div className="bg-white p-8 rounded shadow-md w-full  max-w-xl">
        <h1 className="text-3xl font-bold  w-full text-center">
          Service Provider
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
           <Link to="/forgot-password" state={{ email: email, role: 'provider' }} className="text-blue-600 text-sm hover:underline">
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
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 hover:cursor-pointer transition"
          >
            Login
          </button>
          <p className='text-center mt-4'>
        New here?   <Link to={'/service-provider-signup'} className='text-blue-600'>Create new Account</Link>
        </p>
          <div className='mt-16'>
                <Link to={'/user-login'} className='flex justify-center items-center rounded px-4 mb-3 py-2  w-full font-semibold placeholder:text-base bg-gray-800 hover:bg-gray-950 text-white'>Login as a User</Link>
                </div>
        </form>
        
      </div>
    </div>

  )
}

export default ServiceProviderLogin

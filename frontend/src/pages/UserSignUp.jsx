import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import MapModal from '../components/location/MapModal' // MapModal

const UserSignUp = () => {
  const navigate = useNavigate()
  const { setUser } = useContext(UserDataContext)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [error, setError] = useState('')

  // 📍 Location (FINAL data stored here)
  const [lat, setLat] = useState(null)
  const [long, setLong] = useState(null)

  // Map modal state (PARENT LOGIC)
  const [isMapOpen, setIsMapOpen] = useState(false)

  /* 🔁 SAME BUTTON – LOGIC CHANGED ONLY */
  const getLocation = () => {
    setIsMapOpen(true)
  }

  /* 📍 RECEIVE LOCATION FROM MAP */
  const handleLocationConfirm = ({ lat, lng, address }) => {
    setLat(lat)
    setLong(lng)
    setAddress(address)
    console.log("Location received in signup:", { lat, lng, address })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
console.log({lat,long});
    if (!lat || !long) {
      alert("Please select location from map")
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user/register`,
        {
          firstName,
          lastName,
          email,
          phone,
          password,
          address,
          city,
          pincode,
          lat,
          long
        },
        { withCredentials: true }
      )

      if (response.status === 201) {
        setUser(response.data.user)
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed")
    }
  }
  
  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-100'>
      <div className="bg-white p-8 rounded shadow-md w-full md:mt-4 max-w-xl">

        <h1 className="text-3xl font-bold text-center mb-4">Register</h1>

        {error && (
          <div className='bg-red-100 text-red-700 p-2 rounded mb-4 text-center'>
            {error}
          </div>
        )}

        <form onSubmit={submitHandler}>

          {/* Full Name */}
          <div className='flex gap-4 mb-4'>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="border p-2 rounded w-full"
              required
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Email */}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="border p-2 rounded w-full mb-4"
            required
          />

          {/* Phone */}
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            className="border p-2 rounded w-full mb-4"
            required
          />

          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="border p-2 rounded w-full mb-6"
            required
          />

          {/* Address */}
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='border p-2 rounded w-full mb-4'
            placeholder='Enter your address here'
          />

          {/* City & Pincode */}
          <div className='flex gap-4 mb-4'>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className='border p-2 rounded w-full'
            />
            <input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Pincode"
              className='border p-2 rounded w-full'
            />
          </div>

          {/* 📍 SAME BUTTON – DIFFERENT LOGIC */}
          <button
            type="button"
            onClick={getLocation}
            className="bg-gray-200 text-black p-2 rounded w-full mb-3 hover:cursor-pointer"
          >
            Get My Location
          </button>

          {/* Submit */}
          <button
            type="submit"
            className="bg-gray-800 text-white p-2 rounded w-full hover:bg-gray-950 transition"
          >
            Sign Up
          </button>

          <p className='text-center mt-4'>
            Already have account?
            <Link to="/user-login" className='text-blue-600 ml-1'>
              Login here
            </Link>
          </p>
        </form>
      </div>

      {/* 🗺️ MAP MODAL (CHILD) */}
      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        city={city}
        pincode={pincode}
        onConfirm={handleLocationConfirm}
      />
    </div>
  )
}

export default UserSignUp

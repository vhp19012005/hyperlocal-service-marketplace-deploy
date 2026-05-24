import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ServiceProviderDataContext } from '../context/ServiceProviderContext'
import MapModal from '../components/location/MapModal' 

const ServiceProviderSignUp = () => {
  const navigate = useNavigate()
  const { setProvider } = useContext(ServiceProviderDataContext)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [category, setCategory] = useState('')
  const [experience, setExperience] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [error, setError] = useState('')

  // 📍 FINAL location (stored here)
  const [lat, setLat] = useState(null)
  const [long, setLong] = useState(null)

  // Map modal state
  const [isMapOpen, setIsMapOpen] = useState(false)

  // Add visiting cost state
  const [visitingCost, setVisitingCost] = useState('')

  /* SAME BUTTON – LOGIC ONLY CHANGED */
  const getLocation = () => {
    setIsMapOpen(true)
  }

  /* RECEIVE LOCATION FROM MAP */
  const handleLocationConfirm = ({ lat, lng, address }) => {
    setLat(lat)
    setLong(lng)
    setAddress(address)
    console.log("Provider location selected:", { lat, lng, address })
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!lat || !long) {
      alert("Please select location from map")
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/sprovider/register`,
        {
          firstName,
          lastName,
          serviceName,
          email,
          phone: phoneNumber,
          password,
          serviceCategory: category,
          experience,
          address,
          city,
          pincode,
          lat,
          long,
          visitingCost: visitingCost ? Number(visitingCost) : undefined
        },
        { withCredentials: true }
      )

      if (response.status === 201) {
        setProvider(response.data.provider)
        navigate('/Sprofile')
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed")
    }
  }

  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-100'>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl mt-4">

        <h1 className="text-3xl font-bold text-center mb-4">
          Service Provider
        </h1>

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

          {/* Service Name */}
          <input
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Enter service name"
            className="border p-2 rounded w-full mb-4"
            required
          />

          {/* Email */}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter email'
            type='email'
            className="border p-2 rounded w-full mb-4"
            required
          />

          {/* Phone */}
          <input
            type='text'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder='Enter phone number'
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

          {/* Category, Experience & Visiting Cost */}
          <div className='flex gap-4 mb-4'>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Category</option>
              <option value="Home Services">Home Services</option>
              <option value="Electrical">Electrical</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Education">Education</option>
              <option value="Health & Fitness">Health & Fitness</option>
            </select>

            <input
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Years"
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Visiting Cost */}
          <input
            type='number'
            min='0'
            step='1'
            value={visitingCost}
            onChange={(e) => setVisitingCost(e.target.value)}
            placeholder='Visiting cost (₹)'
            className="border p-2 rounded w-full mb-4"
          />

          {/* Address */}
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            className='border p-2 rounded w-full mb-4'
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

          {/* SAME BUTTON – SAME UI */}
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
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
          >
            Sign Up
          </button>

          <p className='text-center mt-4'>
            Already have an account?
            <Link to="/service-provider-login" className='text-blue-600 ml-1'>
              Login here
            </Link>
          </p>

        </form>
      </div>

      {/* 🗺️ MAP MODAL */}
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

export default ServiceProviderSignUp

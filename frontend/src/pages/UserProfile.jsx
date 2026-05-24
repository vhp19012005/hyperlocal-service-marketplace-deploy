import React, { useContext, useState } from "react";

import { Link } from "react-router-dom";

import { UserDataContext } from "../context/UserContext";

import ProfileNavbar from "../components/profile/UserNavbar";

import AddReviewForm from "../components/profile/AddReviewForm";

import ReviewSection from "../components/profile/ReviewSection";

import UserBookings from "../components/profile/UserBookings";

import { Mail, Phone, MapPin, Calendar, Clock, Pencil } from "lucide-react";

import axios from "axios";

const UserProfile = () => {

  const { user } = useContext(UserDataContext);





  const [reviews, setReviews] = useState([]);

  const [recentBooking, setRecentBooking] = useState({})

  /* 🔥 This connects form → review list */

  const handleReviewSubmit = (newReview) => {

    setReviews((prev) => [newReview, ...prev]);

  };



  const profile = {

    name: `${user?.profile?.firstName} ${user?.profile?.lastName}`,

    email: user?.profile?.email,

    phone: user?.profile?.phone,

    address: user?.profile?.address,

    city: user?.profile?.city

  };



  

  // const recentBooking = {

  //   serviceName: "Home Cleaning",

  //   providerName: "CleanPro Services",

  //   date: "Dec 20, 2024",

  //   time: "10:00 AM",

  //   status: "Completed",

  // };



  const handleImageUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;



    const formData = new FormData();

    formData.append("profileImage", file);



    try {

      await axios.post(

        `${import.meta.env.VITE_BACKEND_URL}/api/user/upload-profile`,

        formData,

        { withCredentials: true }

      );

      window.location.reload(); // simple & safe

    } catch (err) {

      console.error("Upload failed", err);

    }

  };





  return (

    <div className="min-h-screen bg-gray-100">

      {/* Profile Navbar */}

      <ProfileNavbar />



      {/* Hero */}

      <section className="bg-blue-600 py-14">

        <div className="max-w-7xl mx-auto px-4 text-center">

          <h1 className="text-3xl md:text-4xl font-bold text-white">

            My Profile

          </h1>

          <p className="text-blue-100 mt-1">

            Manage your account and preferences

          </p>

        </div>

      </section>



      {/* Content */}

      <div className="max-w-5xl mx-auto px-4 -mt-10 pb-6 space-y-6">

        {/* Profile Card */}

        <div className="bg-white rounded-xl shadow-md p-6 ">

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">



            <div className="relative w-24 h-24">

              {/* Profile Image / Initial */}

              <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">

                {user?.profile?.profileImage ? (

                  <img

                    src={`http://localhost:3000/uploads/users/${user.profile.profileImage}`}

                    alt="Profile"

                    className="w-full h-full object-cover"

                  />

                ) : (

                  <span className="text-3xl font-bold text-blue-600">

                    {profile.name.charAt(0)}

                  </span>

                )}

              </div>



              {/* Pencil Button */}

              <label

                htmlFor="profileUpload"

                className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow cursor-pointer hover:bg-gray-100"

              >

                <Pencil size={14} className="text-gray-600" />

              </label>



              {/* Hidden File Input */}

              <input

                type="file"

                id="profileUpload"

                accept="image/*"

                className="hidden"

                onChange={handleImageUpload}

              />

            </div>



            <div className="text-center sm:text-left">

              <p className="text-gray-500">User Account</p>

              <h2 className="text-2xl font-semibold text-gray-800">

                {profile.name}

              </h2>

            </div>

          </div>



          <div className="grid sm:grid-cols-2 gap-6">

            <Info label="Full Name" value={profile.name} />

            <Info icon={<Mail size={16} />} label="Email" value={profile.email} />

            <Info icon={<Phone size={16} />} label="Phone" value={profile.phone} />

            <Info

              icon={<MapPin size={16} />}

              label="Address"

              value={profile.address}

            />

            <div className="sm:col-span-2">

              <Info label="City" value={profile.city} />

            </div>

          </div>

        </div>



        {/* Recent Booking */}

        <div className="bg-white rounded-xl shadow-md p-6">

          <h3 className="text-xl font-semibold text-gray-800 mb-4">

            Recent Bookings

          </h3>



          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">

            <div className="flex justify-between items-start mb-3">

              <div>

                <h4 className="text-lg font-semibold text-gray-800">

                  {recentBooking.serviceName}

                </h4>

                <p className="text-gray-600">

                  {recentBooking.providerName}

                </p>

              </div>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                {recentBooking.status}

              </span>

            </div>



            <div className="flex flex-wrap gap-4 text-sm text-gray-600">

              <span className="flex items-center gap-1">

                <Calendar size={14} /> {recentBooking.date}

              </span>

              <span className="flex items-center gap-1">

                <Clock size={14} /> {recentBooking.time}

              </span>

            </div>

          </div>



          <div className="text-center  mt-4">

            <Link

              to="/"

              className="inline-block  bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"

            >

              Find More Services

            </Link>

          </div>

        </div>

      </div>

      <div className="max-w-5xl mx-auto px-4 pb-6 space-y-4">
        <UserBookings onSelectBooking={(b) => setRecentBooking({
          serviceName: b.provider?.serviceName || "",
          providerName: `${b.provider?.firstName || ""} ${b.provider?.lastName || ""}`,
          date: b.serviceDate,
          time: b.serviceTime,
          status: b.status,
        })} />
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-6 space-y-4">

        <AddReviewForm onReviewSubmit={handleReviewSubmit} setRecentBooking={setRecentBooking} />

      </div>

      <div className="max-w-5xl mx-auto px-4 pb-6 space-y-4">

        <ReviewSection reviews={reviews} setReviews={setReviews} />

      </div>

    </div>

  );

};



const Info = ({ label, value, icon }) => (

  <div>

    <label className="text-sm text-gray-500 flex items-center gap-1 mb-1">

      {icon} {label}

    </label>

    <p className="text-gray-800 font-medium">{value}</p>

  </div>

);


export default UserProfile;


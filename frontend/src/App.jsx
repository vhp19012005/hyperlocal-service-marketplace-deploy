import React from 'react'

import LandingPage from './pages/LandingPage';

import ServiceProviderSignUp from './pages/ServiceProviderSignUp'

import UserSignUp from './pages/UserSignUp'

import ServiceProviderLogin from './pages/ServiceProviderLogin'

import UserLogin from './pages/UserLogin'

import ServiceProviderDashboard from './pages/ServiceProviderDashboard'

import ServiceRequestsList from './pages/ServiceRequestsList'

import JobDetailsScreen from './pages/JobDetailsScreen'

import OngoingJobScreen from './pages/OngoingJobScreen'

import EarningsWallet from './pages/EarningsWallet'

import ProfileSettings from './pages/ProfileSettings'

import AllActivities from './pages/AllActivities'

import AdminDashboard from './pages/admin/Dashboard'

import AdminUsers from './pages/admin/Users'

import AdminProviders from './pages/admin/Providers'

import AdminBookings from './pages/admin/Bookings'

import AdminAnalytics from './pages/admin/Analytics'

import AdminReviews from './pages/admin/Reviews'

import AdminCompletionRate from './pages/admin/CompletionRate'

import AdminProfile from './pages/admin/Profile'

import { Route, Routes } from 'react-router-dom'

import ProtectRouter from './router/ProtectRouter'

import SProtectRouter from './router/SProtectRouter'


import Map from './pages/Map';

import ForgotPassword from './pages/ForgotPassword';

import VerifyOtp from './pages/VerifyOtp';

import UserProfile from './pages/UserProfile';

import ResetPassword from './pages/ResetPassword';

import ServiceProviderP from './pages/ServiceProviderProfileP'

import ChatWidget from './components/chatbot/ChatWidget'

const App = () => {

  return (

    <>

    <Routes>

      <Route path="/" element={<LandingPage />} />

      <Route path="/map" element={

        <ProtectRouter>

        <Map/>

        </ProtectRouter>

        } />

      <Route path="/profile" element={

        <ProtectRouter>

          <UserProfile/>

        </ProtectRouter>

      }/>

      <Route path="/Sprofile" element={<SProtectRouter>

        <ServiceProviderDashboard/>

        </SProtectRouter>

        } />

      <Route path="/dashboard" element={

        <SProtectRouter>

          <ServiceProviderDashboard/>

        </SProtectRouter>

      } />

         <Route path='/service-provider-profile/:providerId' element={

          <ProtectRouter>

            <ServiceProviderP/>

          </ProtectRouter>

        }/>

      <Route path="/service-provider-signup" element={<ServiceProviderSignUp />} />

      <Route path="/user-signup" element={<UserSignUp />} />

      <Route path="/service-provider-login" element={<ServiceProviderLogin />} />

      <Route path="/user-login" element={<UserLogin />} />

      <Route path="/forgot-password" element={<ForgotPassword/>}></Route>

      <Route path="/verify-otp" element={<VerifyOtp/>}></Route>

      <Route path="/reset-password" element={<ResetPassword/>}></Route>

      {/* New Service Provider Dashboard Routes */}

      <Route path="/service-requests" element={

        <SProtectRouter>

          <ServiceRequestsList/>

        </SProtectRouter>

      } />

      <Route path="/job-details/:jobId" element={

        <SProtectRouter>

          <JobDetailsScreen/>

        </SProtectRouter>

      } />

      <Route path="/ongoing-job/:jobId" element={

        <SProtectRouter>

          <OngoingJobScreen/>

        </SProtectRouter>

      } />

      <Route path="/earnings-wallet" element={

        <SProtectRouter>

          <EarningsWallet/>

        </SProtectRouter>

      } />

      <Route path="/profile-settings" element={

        <SProtectRouter>

          <ProfileSettings/>

        </SProtectRouter>

      } />

      <Route path="/all-activities" element={

        <SProtectRouter>

          <AllActivities/>

        </SProtectRouter>

      } />



      {/* Admin Routes */}

      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route path="/admin/users" element={<AdminUsers />} />

      <Route path="/admin/providers" element={<AdminProviders />} />

      <Route path="/admin/bookings" element={<AdminBookings />} />

      <Route path="/admin/analytics" element={<AdminAnalytics />} />

      <Route path="/admin/reviews" element={<AdminReviews />} />

      <Route path="/admin/completion" element={<AdminCompletionRate />} />

      <Route path="/admin/profile" element={<AdminProfile />} />

    </Routes>

    <ChatWidget />

    </>

  )

}

export default App





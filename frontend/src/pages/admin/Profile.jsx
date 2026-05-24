
import { User, Mail, Phone, Shield, LogOut, Save } from 'lucide-react';
import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { UserDataContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
const AdminProfile = () => {
   const { user, setUser } = useContext(UserDataContext);
      const navigate = useNavigate();
    
  const [formData, setFormData] = useState({
    name: 'Admin',
    email: 'admin@email.com',
    phone: '+91 9876543210',
    role: 'Administrator'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    alert('Profile updated (mock)');
  };

  const handleLogout = async() => {
    try {
    navigate("/", { replace: true });

    setUser({
      isAuth: false,
      loading: false,
      profile: null,
    });

    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
      {},                       // ✅ body
      { withCredentials: true } // ✅ config
    );
  } catch (error) {
    console.error("Logout failed", error);
  }
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      <div className="bg-blue-600 border-b border-blue-700 rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Profile</h1>
              <p className="text-blue-100">Manage your admin account details</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-blue-300 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mt-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">{formData.name}</div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                {formData.role}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={formData.role}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Filter, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Mail, Phone, MapPin, Calendar, CheckCircle, Clock } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Mail modal state (reused UX from Providers.jsx)
  const [showMailModal, setShowMailModal] = useState(false);
  const [mailTo, setMailTo] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const [mailSending, setMailSending] = useState(false);
   const usersPerPage = 10;

  useEffect(() => {
    // Load mock data immediately to avoid blank page
    const mockUsers = [
      { id: 1, name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 9876543210', city: 'Mumbai', joinDate: '2024-01-15', status: 'active', bookings: 12 },
      { id: 2, name: 'Rahul Verma', email: 'rahul@email.com', phone: '+91 9876543211', city: 'Delhi', joinDate: '2024-01-14', status: 'active', bookings: 8 },
      { id: 3, name: 'Anjali Patel', email: 'anjali@email.com', phone: '+91 9876543212', city: 'Bangalore', joinDate: '2024-01-13', status: 'active', bookings: 15 },
      { id: 4, name: 'Amit Kumar', email: 'amit@email.com', phone: '+91 9876543213', city: 'Mumbai', joinDate: '2024-01-12', status: 'inactive', bookings: 5 },
      { id: 5, name: 'Sneha Reddy', email: 'sneha@email.com', phone: '+91 9876543214', city: 'Hyderabad', joinDate: '2024-01-11', status: 'active', bookings: 20 },
      { id: 6, name: 'Vikram Singh', email: 'vikram@email.com', phone: '+91 9876543215', city: 'Delhi', joinDate: '2024-01-10', status: 'active', bookings: 7 },
      { id: 7, name: 'Neha Gupta', email: 'neha@email.com', phone: '+91 9876543216', city: 'Bangalore', joinDate: '2024-01-09', status: 'active', bookings: 18 },
      { id: 8, name: 'Rohit Sharma', email: 'rohit@email.com', phone: '+91 9876543217', city: 'Mumbai', joinDate: '2024-01-08', status: 'inactive', bookings: 3 },
    ];

    // show mock data immediately while we fetch real data
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    console.log('AdminUsers loaded with mock data');

    // Fetch real users from backend and replace mock data when ready
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
          headers,
          withCredentials: true
        });

        const data = res.data;
        const usersFromApi = Array.isArray(data) ? data : (data.users || data.data || []);

        const mapped = usersFromApi.map(u => ({
          id: u._id || u.id,
          name: u.name || `${(u.firstName || '').trim()} ${(u.lastName || '').trim()}`.trim() || u.email || 'Unknown',
          email: u.email || '',
          phone: u.phone || u.mobile || '',
          city: u.city || (u.address && u.address.city) || 'Unknown',
          joinDate: u.createdAt ? String(u.createdAt).slice(0,10) : (u.joinDate || ''),
          status: u.status || 'active',
          bookings: u.totalBookings || 1
        }));

        if (mapped.length) {
          setUsers(mapped);
          setFilteredUsers(mapped);
          console.log('AdminUsers loaded from API, count:', mapped.length);
        } else {
          console.log('AdminUsers: API returned no users, keeping mock data');
        }
      } catch (err) {
        console.error('Failed to load users from API', err);
        // keep mock data as fallback
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(user => user.city === selectedCity);
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCity, users]);

  const cities = ['all', ...new Set(users.map(user => user.city))];
  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setIsCreatingUser(false);
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleAddUser = () => {
    setIsCreatingUser(true);
    setSelectedUser(null);
    setEditFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      status: 'active'
    });
    setShowEditModal(true);
  };

  const handleToggleUserStatus = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    if (window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} ${user.name}?`)) {
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, status: newStatus } : u
      ));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    // Optimistic UI: remove locally first, attempt backend delete
    const prev = users;
    setUsers(users.filter(user => user.id !== userId));
    setFilteredUsers(filteredUsers.filter(user => user.id !== userId));

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/delete-user/${userId}`, { headers, withCredentials: true });
      console.log('User deleted on server:', userId);
    } catch (err) {
      console.error('Failed to delete user on server', err);
      // revert UI change
      setUsers(prev);
      setFilteredUsers(prev);
      alert('Failed to delete user on server. Reverted changes.');
    }
  };
  // Open mail modal for user
  const handleMailUser = (user) => {
    setMailTo(user?.email || '');
    setMailSubject(`Hello ${user?.name || ''}`);
    setMailMessage('Dear user,\n\n');
    setShowMailModal(true);
  };

  const sendMailToUser = async () => {
    if (!mailSubject || !mailMessage) {
      alert('Subject and message are required');
      return;
    }

    if (!mailTo) {
      alert('Recipient email is missing');
      return;
    }

    setMailSending(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const payload = { email: mailTo, subject: mailSubject, message: mailMessage };
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/user/mail`, payload, { headers, withCredentials: true });
      if (res.status === 200) {
        alert('Email sent to user');
        setShowMailModal(false);
      } else {
        alert('Failed to send email to user');
      }
    } catch (err) {
      console.error('Failed to send email to user', err);
      alert('Failed to send email to user');
    } finally {
      setMailSending(false);
    }
  };

  const handleSaveUser = async () => {
    if (isCreatingUser) {
      // no admin create endpoint implemented — keep local behavior
      const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      const today = new Date().toISOString().slice(0, 10);
      const newUser = {
        id: nextId,
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        city: editFormData.city,
        status: editFormData.status,
        joinDate: today,
        bookings: 0
      };
      setUsers([newUser, ...users]);
      setFilteredUsers([newUser, ...filteredUsers]);
      setShowEditModal(false);
      setIsCreatingUser(false);
      setSelectedUser(null);
      setEditFormData({});
      return;
    }

    if (selectedUser) {
      // Update via backend
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // split name into firstName / lastName for backend
        const fullName = (editFormData.name || '').trim();
        const parts = fullName ? fullName.split(/\s+/) : [];
        const firstName = parts.length ? parts.shift() : '';
        const lastName = parts.length ? parts.join(' ') : '';

        const payload = {
          firstName,
          lastName,
          email: editFormData.email,
          phone: editFormData.phone,
          city: editFormData.city
        };

        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${selectedUser.id}`, payload, { headers, withCredentials: true });
        const updated = res.data.user || res.data;

        const mapped = {
          id: updated._id || updated.id || selectedUser.id,
          name: `${updated.firstName || ''} ${updated.lastName || ''}`.trim() || updated.email || editFormData.name,
          email: updated.email || editFormData.email,
          phone: updated.phone || editFormData.phone,
          city: updated.city || editFormData.city,
          joinDate: updated.createdAt ? String(updated.createdAt).slice(0,10) : selectedUser.joinDate,
          status: selectedUser.status,
          bookings: selectedUser.bookings
        };

        setUsers(users.map(user => 
          user.id === selectedUser.id ? mapped : user
        ));
        setFilteredUsers(filteredUsers.map(user => 
          user.id === selectedUser.id ? mapped : user
        ));

        setShowEditModal(false);
        setSelectedUser(null);
        setEditFormData({});

      } catch (err) {
        console.error('Failed to update user on server', err);
        alert('Failed to update user on server. Changes not saved.');
      }
    }
  };

  const exportUsersCsv = () => {
    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows = [
      ['ID', 'Name', 'Email', 'Phone', 'City', 'Join Date', 'Status', 'Bookings'],
      ...filteredUsers.map(u => [u.id, u.name, u.email, u.phone, u.city, u.joinDate, u.status, u.bookings])
    ];

    const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Header */}
      <div className="bg-blue-600 border-b border-blue-700 rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Users</h1>
              <p className="text-blue-100">View and manage all user accounts</p>
            </div>
            <div className="flex items-center gap-4">
              
              <button
                onClick={exportUsersCsv}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                Export Users
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 mt-8 max-w-6xl mx-auto">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city === 'all' ? 'All Cities' : city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.joinDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.bookings}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMailUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user)}
                          className={`${user.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                          title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.status === 'active' ?
                            <Clock className="w-4 h-4" /> :
                            <CheckCircle className="w-4 h-4" />
                          }
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h4>
                <p className="text-sm text-gray-500">ID: {selectedUser.id}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedUser.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedUser.city}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">Joined: {selectedUser.joinDate}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedUser.status}
                </span>
                <span className="text-sm text-gray-600">Total Bookings: {selectedUser.bookings}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowModal(false);
                  handleEditUser(selectedUser);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{isCreatingUser ? 'Add User' : 'Edit User'}</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                  setEditFormData({});
                  setIsCreatingUser(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editFormData.name || ''}
                  onChange={(e) => handleEditFormChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editFormData.email || ''}
                  onChange={(e) => handleEditFormChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editFormData.phone || ''}
                  onChange={(e) => handleEditFormChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={editFormData.city || ''}
                  onChange={(e) => handleEditFormChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editFormData.status || ''}
                  onChange={(e) => handleEditFormChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                  setEditFormData({});
                  setIsCreatingUser(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mail Modal */}
      {showMailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Email to User</h3>
              <button
                onClick={() => setShowMailModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close mail modal"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="email"
                  value={mailTo}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={mailMessage}
                  onChange={(e) => setMailMessage(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowMailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={sendMailToUser}
                disabled={mailSending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {mailSending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

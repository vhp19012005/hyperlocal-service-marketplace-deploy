import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Filter, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Mail, Phone, MapPin, Calendar, Star, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { number } from 'framer-motion';

const AdminProviders = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isCreatingProvider, setIsCreatingProvider] = useState(false);
  // Mail modal state
  const [showMailModal, setShowMailModal] = useState(false);
  const [mailTo, setMailTo] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const [mailSending, setMailSending] = useState(false);
  const providersPerPage = 10;

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockProviders = [
      { id: 1, name: 'John Plumbing', email: 'john@plumbing.com', phone: '+91 9876543210', category: 'Plumbing', city: 'Mumbai', joinDate: '2024-01-15', status: 'active', rating: 4.8, jobs: 45, completed: 42 },
      { id: 2, name: 'CleanPro Services', email: 'clean@pro.com', phone: '+91 9876543211', category: 'Cleaning', city: 'Delhi', joinDate: '2024-01-14', status: 'active', rating: 4.6, jobs: 38, completed: 35 },
      { id: 3, name: 'TechFix Solutions', email: 'tech@fix.com', phone: '+91 9876543212', category: 'AC Repair', city: 'Bangalore', joinDate: '2024-01-13', status: 'active', rating: 4.9, jobs: 52, completed: 50 },
      { id: 4, name: 'Quick Electrical', email: 'quick@electrical.com', phone: '+91 9876543213', category: 'Electrical', city: 'Mumbai', joinDate: '2024-01-12', status: 'inactive', rating: 4.3, jobs: 28, completed: 25 },
      { id: 5, name: 'Home Painters', email: 'paint@home.com', phone: '+91 9876543214', category: 'Painting', city: 'Hyderabad', joinDate: '2024-01-11', status: 'active', rating: 4.7, jobs: 33, completed: 30 },
      { id: 6, name: 'Garden Care', email: 'garden@care.com', phone: '+91 9876543215', category: 'Gardening', city: 'Delhi', joinDate: '2024-01-10', status: 'active', rating: 4.5, jobs: 41, completed: 38 },
      { id: 7, name: 'Car Wash Pro', email: 'car@wash.com', phone: '+91 9876543216', category: 'Car Wash', city: 'Bangalore', joinDate: '2024-01-09', status: 'active', rating: 4.8, jobs: 36, completed: 34 },
      { id: 8, name: 'Pest Control', email: 'pest@control.com', phone: '+91 9876543217', category: 'Pest Control', city: 'Mumbai', joinDate: '2024-01-08', status: 'inactive', rating: 4.2, jobs: 22, completed: 20 },
    ];
    setProviders(mockProviders);
    setFilteredProviders(mockProviders);

    // Fetch real providers from backend
    const fetchProviders = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/providers`, { headers, withCredentials: true });
        const data = res.data;
        const providersFromApi = Array.isArray(data) ? data : (data.providers || data.data || []);
          console.log('Raw providers data from API:', providersFromApi);
        const mapped = providersFromApi.map(p => ({
          id: p._id || p.id,
          name:  `${(p.firstName || '').trim()} ${(p.lastName || '').trim()}`.trim() || p.email || 'Unknown',
          email: p.email || '',
          phone: p.phone || '',
          category: p.serviceCategory || p.serviceCategory || 'General',
          city: p.city || (p.address && p.address.city) || 'Unknown',
          joinDate: p.createdAt ? String(p.createdAt).slice(0,10) : (p.joinDate || ''),
          status: (typeof p.isAvailable === 'boolean') ? (p.isAvailable ? 'active' : 'inactive') : (p.status || 'active'),
          rating: Number(p.averageRating).toFixed(1) || 2,
          jobs: p.totalJobs || 2,
          completed: p.completed || 0
        }));

        if (mapped.length) {
          setProviders(mapped);
          setFilteredProviders(mapped);
          console.log('AdminProviders loaded from API, count:', mapped.length);
        } else {
          console.log('AdminProviders: API returned no providers, keeping mock data');
        }
      } catch (err) {
        console.error('Failed to load providers from API', err);
      }
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    let filtered = providers;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(provider => provider.category === selectedCategory);
    }
    
    setFilteredProviders(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, providers]);

  const categories = ['all', ...new Set(providers.map(provider => provider.category))];
  
  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = filteredProviders.slice(indexOfFirstProvider, indexOfLastProvider);
  const totalPages = Math.ceil(filteredProviders.length / providersPerPage);

  const handleViewProvider = (provider) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  const handleEditProvider = (provider) => {
    setIsCreatingProvider(false);
    setSelectedProvider(provider);
    setEditFormData({
      name: provider.name,
      email: provider.email,
      phone: provider.phone,
      category: provider.category,
      city: provider.city,
      status: provider.status
    });
    setShowEditModal(true);
  };

  const handleAddProvider = () => {
    setIsCreatingProvider(true);
    setSelectedProvider(null);
    setEditFormData({
      name: '',
      email: '',
      phone: '',
      category: '',
      city: '',
      status: 'active'
    });
    setShowEditModal(true);
  };
  // Open mail modal (no network call here)
  const handleMailToProvider = (email) => {
    setMailTo(email || '');
    setMailSubject('Hello from Admin');
    setMailMessage('Dear provider,\n\n');
    setShowMailModal(true);
  };
  
  const sendMailToProvider = async () => {
    if (!mailSubject || !mailMessage) {
      alert('Subject and message are required');
      return;
    }

    setMailSending(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const payload = { email: mailTo, subject: mailSubject, message: mailMessage };
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/provider/mail`, payload, { headers, withCredentials: true });
      if (res.status === 200) {
        alert('Email sent to provider');
        setShowMailModal(false);
      } else {
        alert('Failed to send email to provider');
      }
    } catch (err) {
      console.error('Failed to send email to provider', err);
      alert('Failed to send email to provider');
    } finally {
      setMailSending(false);
    }
  };
  const handleToggleProviderStatus = async (provider) => {
    const newStatus = provider.status === 'active' ? 'inactive' : 'active';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} ${provider.name}?`)) return;

    // Optimistic UI
    const prevProviders = providers;
    setProviders(providers.map(p => p.id === provider.id ? { ...p, status: newStatus } : p));
    setFilteredProviders(filteredProviders.map(p => p.id === provider.id ? { ...p, status: newStatus } : p));

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Backend expects isAvailable boolean
      const payload = { isAvailable: newStatus === 'active' };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/update-providers/${provider.id}`, payload, { headers, withCredentials: true });
      console.log('Provider status updated on server:', provider.id);
    } catch (err) {
      console.error('Failed to update provider status on server', err);
      // revert
      setProviders(prevProviders);
      setFilteredProviders(prevProviders);
      alert('Failed to update provider status on server. Reverted changes.');
    }
  };

  const handleDeleteProvider = async (providerId) => {
    if (!window.confirm('Are you sure you want to delete this provider?')) return;

    const prev = providers;
    // optimistic UI
    setProviders(providers.filter(provider => provider.id !== providerId));
    setFilteredProviders(filteredProviders.filter(provider => provider.id !== providerId));

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/delete-providers/${providerId}`, { headers, withCredentials: true });
      console.log('Provider deleted on server:', providerId);
    } catch (err) {
      console.error('Failed to delete provider on server', err);
      // revert UI
      setProviders(prev);
      setFilteredProviders(prev);
      alert('Failed to delete provider on server. Reverted changes.');
    }
  };

  const handleSaveProvider = async () => {
    if (isCreatingProvider) {
      const nextId = providers.length ? Math.max(...providers.map(p => Number(p.id) || 0)) + 1 : 1;
      const today = new Date().toISOString().slice(0, 10);
      const newProvider = {
        id: nextId,
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        category: editFormData.category,
        city: editFormData.city,
        joinDate: today,
        status: editFormData.status,
        rating: 0,
        jobs: 0,
        completed: 0
      };
      setProviders([newProvider, ...providers]);
      setFilteredProviders([newProvider, ...filteredProviders]);
      setShowEditModal(false);
      setIsCreatingProvider(false);
      setSelectedProvider(null);
      setEditFormData({});
      return;
    }

    if (selectedProvider) {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Prepare payload mapping UI fields to backend fields
        const payload = {
          serviceName: editFormData.name,
          email: editFormData.email,
          phone: editFormData.phone,
          serviceCategory: editFormData.category,
          city: editFormData.city,
          isAvailable: editFormData.status === 'active'
        };

        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/update-providers/${selectedProvider.id}`, payload, { headers, withCredentials: true });
        const updated = res.data.provider || res.data;

        const mapped = {
          id: updated._id || updated.id || selectedProvider.id,
          name: updated.name || `${updated.firstName || ''} ${updated.lastName || ''}`.trim() || updated.email || editFormData.name,
          email: updated.email || editFormData.email,
          phone: updated.phone || editFormData.phone,
          category: updated.serviceCategory || editFormData.category,
          city: updated.city || editFormData.city,
          joinDate: updated.createdAt ? String(updated.createdAt).slice(0,10) : selectedProvider.joinDate,
          status: (typeof updated.isAvailable === 'boolean') ? (updated.isAvailable ? 'active' : 'inactive') : (selectedProvider.status || editFormData.status),
          rating: updated.averageRating || selectedProvider.rating,
          jobs: updated.totalJobs || selectedProvider.jobs,
          completed: updated.completed || selectedProvider.completed
        };

        setProviders(providers.map(p => p.id === selectedProvider.id ? mapped : p));
        setFilteredProviders(filteredProviders.map(p => p.id === selectedProvider.id ? mapped : p));

        setShowEditModal(false);
        setSelectedProvider(null);
        setEditFormData({});
      } catch (err) {
        console.error('Failed to update provider on server', err);
        alert('Failed to update provider on server. Changes not saved.');
      }
    }
  };

  const exportProvidersCsv = () => {
    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows = [
      ['ID', 'Name', 'Email', 'Phone', 'Category', 'City', 'Join Date', 'Status', 'Rating', 'Jobs', 'Completed'],
      ...filteredProviders.map(p => [p.id, p.name, p.email, p.phone, p.category, p.city, p.joinDate, p.status, p.rating, p.jobs, p.completed])
    ];

    const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `providers_${new Date().toISOString().slice(0, 10)}.csv`;
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
              <h1 className="text-2xl font-bold text-white">Manage Service Providers</h1>
              <p className="text-blue-100">View and manage all service provider accounts</p>
            </div>
            <div className="flex items-center gap-4">
             
              <button
                onClick={exportProvidersCsv}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                Export Providers
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
                  placeholder="Search providers by name or email..."
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Providers Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProviders.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                          <div className="text-sm text-gray-500">ID: {provider.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{provider.email}</div>
                      <div className="text-sm text-gray-500">{provider.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-900">{provider.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-xs text-gray-500">{provider.jobs}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        provider.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {provider.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMailToProvider(provider.email)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewProvider(provider)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditProvider(provider)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit Provider"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleProviderStatus(provider)}
                          className={`${provider.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                          title={provider.status === 'active' ? 'Deactivate Provider' : 'Activate Provider'}
                        >
                          {provider.status === 'active' ?
                            <Clock className="w-4 h-4" /> :
                            <CheckCircle className="w-4 h-4" />
                          }
                        </button>
                        <button
                          onClick={() => handleDeleteProvider(provider.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Provider"
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
            Showing {indexOfFirstProvider + 1} to {Math.min(indexOfLastProvider, filteredProviders.length)} of {filteredProviders.length} providers
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

      {/* Provider Details Modal */}
      {showModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Provider Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-10 h-10 text-orange-600" />
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900">{selectedProvider.name}</h4>
                <p className="text-sm text-gray-500">ID: {selectedProvider.id}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedProvider.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedProvider.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedProvider.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedProvider.city}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">Joined: {selectedProvider.joinDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-900">Rating: {selectedProvider.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Total Jobs</div>
                  <div className="text-lg font-semibold text-gray-900">{selectedProvider.jobs}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Completed</div>
                  <div className="text-lg font-semibold text-green-600">{selectedProvider.completed}</div>
                </div>
                <div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedProvider.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedProvider.status}
                  </span>
                </div>
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
                  handleEditProvider(selectedProvider);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Provider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Provider Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{isCreatingProvider ? 'Add Provider' : 'Edit Provider'}</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProvider(null);
                  setEditFormData({});
                  setIsCreatingProvider(false);
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editFormData.category || ''}
                  onChange={(e) => handleEditFormChange('category', e.target.value)}
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
                  setSelectedProvider(null);
                  setEditFormData({});
                  setIsCreatingProvider(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProvider}
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
              <h3 className="text-lg font-semibold text-gray-900">Send Email to Provider</h3>
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
                onClick={sendMailToProvider}
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

export default AdminProviders;

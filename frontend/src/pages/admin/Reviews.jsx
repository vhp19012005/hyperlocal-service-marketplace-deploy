import React, { useEffect, useMemo, useState } from 'react';
import { Star, Search, Filter, ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react';
import axios from 'axios';

const AdminReviews = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [overallAvgRating, setOverallAvgRating] = useState(0);
  const providersPerPage = 10;

  useEffect(() => {
    const mockProviders = [
      { id: 1, name: 'John Plumbing', email: 'john@plumbing.com', category: 'Plumbing', city: 'Mumbai', averageRating: 4.8, totalReviews: 86, completedJobs: 42, status: 'active', recentReviews: [
        { id: 'R1', user: 'Priya Sharma', rating: 5, comment: 'Quick service and very professional.', date: '2024-01-20' },
        { id: 'R2', user: 'Amit Kumar', rating: 4, comment: 'Good work, arrived on time.', date: '2024-01-18' },
      ]},
      { id: 2, name: 'CleanPro Services', email: 'clean@pro.com', category: 'Cleaning', city: 'Delhi', averageRating: 4.6, totalReviews: 54, completedJobs: 35, status: 'active', recentReviews: [
        { id: 'R3', user: 'Rahul Verma', rating: 5, comment: 'Great cleaning, very detailed.', date: '2024-01-19' },
      ]},
      { id: 3, name: 'TechFix Solutions', email: 'tech@fix.com', category: 'AC Repair', city: 'Bangalore', averageRating: 4.9, totalReviews: 102, completedJobs: 50, status: 'active', recentReviews: [
        { id: 'R4', user: 'Anjali Patel', rating: 5, comment: 'AC fixed quickly. Highly recommend.', date: '2024-01-17' },
      ]},
      { id: 4, name: 'Quick Electrical', email: 'quick@electrical.com', category: 'Electrical', city: 'Mumbai', averageRating: 4.3, totalReviews: 31, completedJobs: 25, status: 'inactive', recentReviews: [
        { id: 'R5', user: 'Sneha Reddy', rating: 4, comment: 'Work was fine but delayed.', date: '2024-01-15' },
      ]},
      { id: 5, name: 'Garden Care', email: 'garden@care.com', category: 'Gardening', city: 'Delhi', averageRating: 4.5, totalReviews: 27, completedJobs: 38, status: 'active', recentReviews: [] },
    ];

    // set mock first so UI is responsive, then try backend
    setProviders(mockProviders);
    setFilteredProviders(mockProviders);

    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/reviews/summary?page=1&limit=50`, { headers, withCredentials: true });
        const data = res.data || {};
        const providersFromApi = Array.isArray(data.providers) ? data.providers : (data.providers || []);

        if (!providersFromApi || !providersFromApi.length) {
          // no data - keep mock
          return;
        }

        const overallAvg = providersFromApi.length > 0 ? Number(providersFromApi[0].totalRatings ).toFixed(1): 0;
        setOverallAvgRating(overallAvg);

        const mapped = providersFromApi.map(p => ({
          id: p.id || p._id,
          name:    `${(p.firstName || '').trim()} ${(p.lastName || '').trim()}`.trim() || p.email || 'Unknown',
          email: p.email || '',
          category: p.serviceCategory || 'General',
          city: p.city || 'Unknown',
          averageRating: Number(p.averageRating).toFixed(1) || 0,
          totalReviews: p.totalReviews || 0,
          completedJobs: p.completedJobs || 0,
          status: (typeof p.isAvailable === 'boolean') ? (p.isAvailable ? 'active' : 'inactive') : (p.status || 'active'),
          recentReviews: (p.recentReviews || []).map(r => ({ id: r.id || r._id, user: r.user || (r.userName) || null, rating: r.rating, comment: r.comment, date: r.date || r.createdAt }))
        }));

        setProviders(mapped);
        setFilteredProviders(mapped);
      } catch (err) {
        console.error('Failed to load review summary from API', err);
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    let filtered = providers;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredProviders(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, providers]);

  const categories = useMemo(() => ['all', ...new Set(providers.map(p => p.category))], [providers]);

  const indexOfLast = currentPage * providersPerPage;
  const indexOfFirst = indexOfLast - providersPerPage;
  const currentProviders = filteredProviders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProviders.length / providersPerPage) || 1;

  console.log('Filtered providers:', overallAvgRating);
  const overallAvg = overallAvgRating ? overallAvgRating : '0.0';

  const exportRatingsCsv = () => {
    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows = [
      ['Provider ID', 'Name', 'Email', 'Category', 'City', 'Status', 'Average Rating', 'Total Reviews', 'Completed Jobs'],
      ...filteredProviders.map(p => [p.id, p.name, p.email, p.category, p.city, p.status, p.averageRating, p.totalReviews, p.completedJobs])
    ];

    const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avg_ratings_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // replace view handler to fetch provider reviews from backend
  const handleViewProvider = async (provider) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/providers/${provider.id}/reviews?page=1&limit=20`, { headers, withCredentials: true });
      const data = res.data || {};
      const reviews = Array.isArray(data.reviews) ? data.reviews : (data.reviews || []);
      const recentReviews = reviews.map(r => ({ id: r.id || r._id, user: r.user || (r.userName) || null, rating: r.rating, comment: r.comment, date: r.date || r.createdAt }));

      setSelectedProvider({ ...provider, recentReviews });
      setShowModal(true);
    } catch (err) {
      console.error('Failed to fetch provider reviews', err);
      setSelectedProvider(provider);
      setShowModal(true);
    }
  };

  // replace delete handler to call backend
  const handleDeleteReview = async (reviewId) => {
    if (!selectedProvider) return;
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    // optimistic UI
    const prev = providers;
    setProviders(prevProviders => prevProviders.map(p => {
      if (p.id !== selectedProvider.id) return p;
      const nextRecent = (p.recentReviews || []).filter(r => r.id !== reviewId);
      return { ...p, recentReviews: nextRecent };
    }));

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/reviews/${reviewId}`, { headers, withCredentials: true });
      setSelectedProvider(prevSel => prevSel ? { ...prevSel, recentReviews: (prevSel.recentReviews || []).filter(r => r.id !== reviewId) } : prevSel);
    } catch (err) {
      console.error('Failed to delete review on server', err);
      setProviders(prev);
      alert('Failed to delete review on server. Reverted changes.');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      <div className="bg-blue-600 border-b border-blue-700 rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Avg. Rating</h1>
              <p className="text-blue-100">Monitor provider ratings and reviews</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={exportRatingsCsv}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                Export Ratings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mt-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Avg Rating (Filtered)</p>
              
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <p className="text-2xl font-bold text-gray-900">{overallAvg}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Providers: <span className="font-semibold text-gray-900">{filteredProviders.length}</span>
            </div>
          </div>
        </div>

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
            <div className="sm:w-56">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>
                      {c === 'all' ? 'All Categories' : c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProviders.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Star className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{p.name}</div>
                          <div className="text-sm text-gray-500">{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-900">{p.averageRating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.totalReviews}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewProvider(p)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Reviews"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {filteredProviders.length ? indexOfFirst + 1 : 0} to {Math.min(indexOfLast, filteredProviders.length)} of {filteredProviders.length} providers
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
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

      {showModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reviews: {selectedProvider.name}</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedProvider(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {(selectedProvider.recentReviews || []).length === 0 ? (
              <div className="text-sm text-gray-600">No recent reviews available.</div>
            ) : (
              <div className="space-y-4">
                {(selectedProvider.recentReviews || []).map((r) => (
                  <div key={r.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{r.user}</div>
                        <div className="text-xs text-gray-500">{r.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-900">{r.rating}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 mt-2">{r.comment}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedProvider(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const AdminCompletionRate = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const providersPerPage = 10;

  useEffect(() => {
    const mockProviders = [
      { id: 1, name: 'John Plumbing', email: 'john@plumbing.com', category: 'Plumbing', city: 'Mumbai', status: 'active', totalJobs: 45, completedJobs: 42, cancelledJobs: 2, rejectedJobs: 1 },
      { id: 2, name: 'CleanPro Services', email: 'clean@pro.com', category: 'Cleaning', city: 'Delhi', status: 'active', totalJobs: 38, completedJobs: 35, cancelledJobs: 2, rejectedJobs: 1 },
      { id: 3, name: 'TechFix Solutions', email: 'tech@fix.com', category: 'AC Repair', city: 'Bangalore', status: 'active', totalJobs: 52, completedJobs: 50, cancelledJobs: 1, rejectedJobs: 1 },
      { id: 4, name: 'Quick Electrical', email: 'quick@electrical.com', category: 'Electrical', city: 'Mumbai', status: 'inactive', totalJobs: 28, completedJobs: 25, cancelledJobs: 2, rejectedJobs: 1 },
      { id: 5, name: 'Garden Care', email: 'garden@care.com', category: 'Gardening', city: 'Delhi', status: 'active', totalJobs: 41, completedJobs: 38, cancelledJobs: 2, rejectedJobs: 1 },
      { id: 6, name: 'Car Wash Pro', email: 'car@wash.com', category: 'Car Wash', city: 'Bangalore', status: 'active', totalJobs: 36, completedJobs: 34, cancelledJobs: 1, rejectedJobs: 1 },
    ];

    // set mock first so UI stays responsive, then try backend
    setProviders(mockProviders);
    setFilteredProviders(mockProviders);

    const fetchCompletion = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/completion/summary?page=1&limit=100`, { headers, withCredentials: true });
        const data = res.data || {};
        const providersFromApi = Array.isArray(data.providers) ? data.providers : (data.providers || []);

        if (!providersFromApi || !providersFromApi.length) return; // keep mock

        const mapped = providersFromApi.map(p => ({
          id: p.id || p._id,
          name:  p.name ,
          email: p.email || '',
          category: p.serviceCategory || 'General',
          city: p.city || '',
          status: (typeof p.isAvailable === 'boolean') ? (p.isAvailable ? 'active' : 'inactive') : (p.status || 'active'),
          totalJobs: Number(p.totalJobs || p.totalJobs === 0 ? p.totalJobs : 0),
          completedJobs: Number(p.completedJobs || 0),
          cancelledJobs: Number(p.cancelledJobs || 0),
          rejectedJobs: Number(p.rejectedJobs || 0)
        }));

        setProviders(mapped);
        setFilteredProviders(mapped);
      } catch (err) {
        console.error('Failed to load completion summary from API', err);
      }
    };

    fetchCompletion();
  }, []);

  useEffect(() => {
    let filtered = providers;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
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

  const overall = useMemo(() => {
    const totalJobs = filteredProviders.reduce((acc, p) => acc + (Number(p.totalJobs) || 0), 0);
    const completedJobs = filteredProviders.reduce((acc, p) => acc + (Number(p.completedJobs) || 0), 0);
    const rate = totalJobs ? (completedJobs / totalJobs) * 100 : 0;
    return {
      totalJobs,
      completedJobs,
      rate: Number(rate.toFixed(1))
    };
  }, [filteredProviders]);

  const getRate = (p) => {
    const total = Number(p.totalJobs) || 0;
    const completed = Number(p.completedJobs) || 0;
    return total ? Number(((completed / total) * 100).toFixed(1)) : 0;
  };

  const exportCompletionCsv = () => {
    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows = [
      ['Provider ID', 'Name', 'Email', 'Category', 'City', 'Status', 'Total Jobs', 'Completed Jobs', 'Cancelled Jobs', 'Rejected Jobs', 'Completion Rate (%)'],
      ...filteredProviders.map(p => [p.id, p.name, p.email, p.category, p.city, p.status, p.totalJobs, p.completedJobs, p.cancelledJobs, p.rejectedJobs, getRate(p)])
    ];

    const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `completion_rate_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      <div className="bg-blue-600 border-b border-blue-700 rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Completion Rate</h1>
              <p className="text-blue-100">Track job completion performance across providers</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={exportCompletionCsv}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                Export Completion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mt-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600">Overall Completion Rate (Filtered)</p>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-2xl font-bold text-gray-900">{overall.rate}%</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600">Total Jobs</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{overall.totalJobs}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-600">Completed Jobs</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{overall.completedJobs}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search provider by name, email, city..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProviders.map((p) => {
                  const rate = getRate(p);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{p.name}</div>
                        <div className="text-sm text-gray-500">{p.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.totalJobs}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.completedJobs}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${rate >= 90 ? 'bg-green-100 text-green-800' : rate >= 75 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {rate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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
    </div>
  );
};

export default AdminCompletionRate;

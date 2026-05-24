import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Search, Filter, ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react';
import axios from 'axios';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const bookingsPerPage = 10;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/recent-bookings?limit=0`, { withCredentials: true });
        const data = (res.data && res.data.recentBookings) || [];

        const mapped = data.map(b => ({
          id: String(b.id),
          userName: b.user || b.userEmail || 'Unknown',
          userEmail: b.userEmail || '',
          providerName: b.provider || b.providerName || 'Unknown Provider',
          providerCategory: b.service || '',
          city: b.city || '',
          date: b.date || (b.createdAt ? new Date(b.createdAt).toISOString().slice(0,10) : ''),
          time: b.time || '',
          status: b.status || 'pending',
          amount: b.status === 'rejected' ? 0 : (b.amount != null ? b.amount : 0), // if rejected, show 0 amount
          address: b.address || '',
          issue: b.issue || ''
        }));

        setBookings(mapped);
        setFilteredBookings(mapped);
      } catch (err) {
        console.error('Failed to load bookings from backend, using fallback mock', err);
        const mockBookings = [
          { id: 'BK001', userName: 'Priya Sharma', userEmail: 'priya@email.com', providerName: 'John Plumbing', providerCategory: 'Plumbing', city: 'Mumbai', date: '2024-01-20', time: '10:00 AM', status: 'completed', amount: 799, address: 'Mumbai - 400001', issue: 'Tap leakage' },
          { id: 'BK002', userName: 'Rahul Verma', userEmail: 'rahul@email.com', providerName: 'CleanPro Services', providerCategory: 'Cleaning', city: 'Delhi', date: '2024-01-20', time: '01:00 PM', status: 'pending', amount: 499, address: 'Delhi - 110001', issue: 'Bathroom cleaning' },
          { id: 'BK003', userName: 'Anjali Patel', userEmail: 'anjali@email.com', providerName: 'TechFix Solutions', providerCategory: 'AC Repair', city: 'Bangalore', date: '2024-01-19', time: '04:00 PM', status: 'accepted', amount: 999, address: 'Bangalore - 560001', issue: 'AC not cooling' },
          { id: 'BK004', userName: 'Amit Kumar', userEmail: 'amit@email.com', providerName: 'Quick Electrical', providerCategory: 'Electrical', city: 'Mumbai', date: '2024-01-19', time: '11:00 AM', status: 'completed', amount: 649, address: 'Mumbai - 400002', issue: 'Switch board repair' },
          { id: 'BK005', userName: 'Sneha Reddy', userEmail: 'sneha@email.com', providerName: 'John Plumbing', providerCategory: 'Plumbing', city: 'Hyderabad', date: '2024-01-18', time: '05:30 PM', status: 'cancelled', amount: 0, address: 'Hyderabad - 500001', issue: 'Pipe installation' },
          { id: 'BK006', userName: 'Rohit Sharma', userEmail: 'rohit@email.com', providerName: 'Garden Care', providerCategory: 'Gardening', city: 'Delhi', date: '2024-01-18', time: '09:00 AM', status: 'accepted', amount: 399, address: 'Delhi - 110002', issue: 'Lawn trimming' },
        ];

        setBookings(mockBookings);
        setFilteredBookings(mockBookings);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.id.toLowerCase().includes(q) ||
        b.userName.toLowerCase().includes(q) ||
        b.userEmail.toLowerCase().includes(q) ||
        b.providerName.toLowerCase().includes(q)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(b => b.status === selectedStatus);
    }

    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, bookings]);

  const statusOptions = useMemo(() => (['all', ...new Set(bookings.map(b => b.status))]), [bookings]);

  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage) || 1;

  const getStatusPill = (status) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (status === 'accepted') return 'bg-blue-100 text-blue-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    // optimistic UI update
    const prevBookings = bookings;
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    setFilteredBookings(prev => prev.filter(b => b.id !== bookingId));

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/delete-booking/${bookingId}`, { headers, withCredentials: true });
      console.log('Deleted booking on server:', bookingId);
    } catch (err) {
      console.error('Failed to delete booking on server', err);
      // revert UI
      setBookings(prevBookings);
      setFilteredBookings(prevBookings);
      alert('Failed to delete booking on server. Changes reverted.');
    }
  };

  const exportBookingsCsv = () => {
    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows = [
      ['Booking ID', 'User', 'User Email', 'Provider', 'Category', 'City', 'Date', 'Time', 'Status', 'Amount'],
      ...filteredBookings.map(b => [b.id, b.userName, b.userEmail, b.providerName, b.providerCategory, b.city, b.date, b.time, b.status, b.amount])
    ];

    const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().slice(0, 10)}.csv`;
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
              <h1 className="text-2xl font-bold text-white">Total Bookings</h1>
              <p className="text-blue-100">View and manage all bookings</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={exportBookingsCsv}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                Export Bookings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mt-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by booking id, user, email, provider..."
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
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s}>
                      {s === 'all' ? 'All Status' : s}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                          <div className="text-sm text-gray-500">{booking.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.userName}</div>
                      <div className="text-sm text-gray-500">{booking.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.providerName}</div>
                      <div className="text-sm text-gray-500">{booking.providerCategory}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{booking.date}</div>
                      <div className="text-xs text-gray-500">{booking.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{booking.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Booking"
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

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {filteredBookings.length ? indexOfFirst + 1 : 0} to {Math.min(indexOfLast, filteredBookings.length)} of {filteredBookings.length} bookings
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

      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedBooking(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Booking ID</span>
                <span className="text-sm font-semibold text-gray-900">{selectedBooking.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">User</span>
                <span className="text-sm font-semibold text-gray-900">{selectedBooking.userName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Provider</span>
                <span className="text-sm font-semibold text-gray-900">{selectedBooking.providerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Category</span>
                <span className="text-sm font-semibold text-gray-900">{selectedBooking.providerCategory}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Schedule</span>
                <span className="text-sm font-semibold text-gray-900">{selectedBooking.date}, {selectedBooking.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Issue</div>
                <div className="text-sm text-gray-900">{selectedBooking.issue}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Address</div>
                <div className="text-sm text-gray-900">{selectedBooking.address}</div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm font-semibold text-gray-900">₹{selectedBooking.amount}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedBooking(null);
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

export default AdminBookings;

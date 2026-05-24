import React, { useState, useEffect,useContext } from 'react';
import { Users, Briefcase, Calendar, IndianRupee, TrendingUp, TrendingDown, MoreHorizontal, Star, CheckCircle, Clock, UserCircle, LogOut } from 'lucide-react';
import axios from 'axios';
import { UserDataContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";


const AdminDashboard = () => {

  const { user, setUser } = useContext(UserDataContext);
    const navigate = useNavigate();
  

  const adminName = 'Admin'; // Static admin name for now
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    userGrowth: 0,
    providerGrowth: 0,
    bookingGrowth: 0,
    revenueGrowth: 0
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [bookingStatus, setBookingStatus] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
    rejected: 0
  });

  const downloadFile = (content, mimeType, filename) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      adminName,
      stats,
      bookingStatus,
      recentBookings
    };
    downloadFile(
      JSON.stringify(report, null, 2),
      'application/json;charset=utf-8;',
      `admin_report_${new Date().toISOString().slice(0, 10)}.json`
    );
  };

  const exportData = () => {
    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows = [
      ['Booking ID', 'User', 'Provider', 'Service', 'Status', 'Date'],
      ...recentBookings.map(b => [b.id, b.user, b.provider, b.service, b.status, b.date])
    ];

    const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
    downloadFile(
      csv,
      'text/csv;charset=utf-8;',
      `recent_bookings_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const logoutAdmin = async () => {
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

  useEffect(() => {
    // Fetch admin stats and recent bookings from backend
    const fetchData = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          axios.get('http://localhost:3000/api/admin/dashboard', { withCredentials: true }),
          axios.get('http://localhost:3000/api/admin/recent-bookings?limit=10', { withCredentials: true })
        ]);

        const d = statsRes.data || {};
        setStats({
          totalUsers: d.totalUsers || 0,
          totalProviders: d.totalProviders || 0,
          totalBookings: d.totalBookings || 0,
          totalRevenue: d.totalRevenue || 0,
          userGrowth: d.userGrowth || 0,
          providerGrowth: d.providerGrowth || 0,
          bookingGrowth: d.bookingGrowth || 0,
          revenueGrowth: d.revenueGrowth || 0,
          totalRatings: d.totalRatings || 0,
          completedBookings: d.completedBookings || 0,
          completionRate: d.completionRate || 0
        });

        const recent = (recentRes.data && recentRes.data.recentBookings) || [];
        setRecentBookings(recent.map(r => ({
          id: r.id,
          user: r.user || r.userEmail || 'Unknown',
          provider: r.provider || r.providerName || 'Unknown',
          service: r.service || 'Service',
          status: r.status || 'pending',
          date: r.date || (r.createdAt ? new Date(r.createdAt).toISOString().slice(0,10) : '')
        })));

        // derive booking status counts from recent bookings
        const counts = { pending: 0, accepted: 0, completed: 0, rejected: 0 };
        recent.forEach(b => {
          const s = b.status;
          if (s && counts[s] !== undefined) counts[s] += 1;
        });
        setBookingStatus(counts);
      } catch (err) {
        console.error('Failed to load admin data', err);
        // fallback to mock data
        setRecentBookings([
          { id: 'BK001', user: 'Priya Sharma', provider: 'John Plumbing', service: 'Plumbing', status: 'completed', date: '2024-01-20' },
          { id: 'BK002', user: 'Rahul Verma', provider: 'CleanPro Services', service: 'Cleaning', status: 'pending', date: '2024-01-20' },
          { id: 'BK003', user: 'Anjali Patel', provider: 'TechFix Solutions', service: 'AC Repair', status: 'accepted', date: '2024-01-19' },
          { id: 'BK004', user: 'Amit Kumar', provider: 'Quick Electrical', service: 'Electrical', status: 'completed', date: '2024-01-19' },
          { id: 'BK005', user: 'Sneha Reddy', provider: 'John Plumbing', service: 'Plumbing', status: 'rejected', date: '2024-01-18' }
        ]);

        setBookingStatus({ pending: 45, accepted: 78, completed: 156, rejected: 23 });
      }
    };

    fetchData();
  }, []);

  const summaryCards = [
    {
      title: "Total Users",
      value: String(stats.totalUsers.toLocaleString()),
      icon: Users,
      color: "bg-blue-500",
      path: "/admin/users",
      trend: `+${stats.userGrowth}% from last month`,
      trendColor: "text-green-600",
    },
    {
      title: "Service Providers",
      value: String(stats.totalProviders.toLocaleString()),
      icon: Briefcase,
      color: "bg-orange-500",
      path: "/admin/providers",
      trend: `+${stats.providerGrowth}% from last month`,
      trendColor: "text-green-600",
    },
    {
      title: "Total Bookings",
      value: String(stats.totalBookings.toLocaleString()),
      icon: Calendar,
      color: "bg-green-500",
      path: "/admin/bookings",
      trend: `+3% from last month`,
      trendColor: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: "₹102K",
      icon: IndianRupee,
      color: "bg-purple-500",
      path: "/admin/analytics",
      trend: "+20% from last month",
      trendColor: "text-green-600",
    },
    {
      title: "Avg. Rating",
      value: Number(stats.totalRatings).toFixed(1),
      icon: Star,
      color: "bg-yellow-500",
      path: "/admin/reviews",
      trend: "0.2 increase",
      trendColor: "text-green-600",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: CheckCircle,
      color: "bg-indigo-500",
      path: "/admin/completion",
      trend: "+3% from last month",
      trendColor: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* ===================== HEADER ===================== */}
      <div className="bg-blue-600 border-b border-blue-700 rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {adminName}</h1>
              <p className="text-blue-100">Here's what's happening with your platform today</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={generateReport}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                Generate Report
              </button>
              <button
                onClick={exportData}
                className="px-4 py-2 border border-blue-300 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Export Data
              </button>
              <button
                onClick={() => window.location.href = '/admin/profile'}
                className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition"
                title="Profile"
              >
                <UserCircle className="w-6 h-6" />
              </button>
              <button
                onClick={logoutAdmin}
                className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== SUMMARY CARDS ===================== */}
      <div className="px-4 sm:px-6 lg:px-8 mt-8 max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                onClick={() => window.location.href = card.path}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${card.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium ${card.trendColor}`}>{card.trend}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{card.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            );
          })}
        </div>

        {/* ===================== BOOKING STATUS & RECENT BOOKINGS ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Booking Status Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <span className="text-sm font-semibold">{bookingStatus.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Accepted</span>
                </div>
                <span className="text-sm font-semibold">{bookingStatus.accepted}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <span className="text-sm font-semibold">{bookingStatus.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Rejected</span>
                </div>
                <span className="text-sm font-semibold">{bookingStatus.rejected}</span>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              <button 
                onClick={() => window.location.href = '/admin/bookings'}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Booking ID</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">User</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Provider</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Service</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="py-3 text-sm text-gray-900">{booking.id}</td>
                      <td className="py-3 text-sm text-gray-900">{booking.user}</td>
                      <td className="py-3 text-sm text-gray-900">{booking.provider}</td>
                      <td className="py-3 text-sm text-gray-900">{booking.service}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ===================== QUICK ACTIONS ===================== */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => window.location.href = '/admin/users'}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200 text-left"
            >
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <p className="font-semibold text-gray-900 text-lg">Manage Users</p>
              <p className="text-sm text-gray-600 mt-1">View and manage user accounts</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/providers'}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200 text-left"
            >
              <Briefcase className="w-8 h-8 text-orange-600 mb-3" />
              <p className="font-semibold text-gray-900 text-lg">Manage Providers</p>
              <p className="text-sm text-gray-600 mt-1">View and manage service providers</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/bookings'}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200 text-left"
            >
              <Calendar className="w-8 h-8 text-green-600 mb-3" />
              <p className="font-semibold text-gray-900 text-lg">View Bookings</p>
              <p className="text-sm text-gray-600 mt-1">Manage all booking requests</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/analytics'}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200 text-left"
            >
              <IndianRupee className="w-8 h-8 text-purple-600 mb-3" />
              <p className="font-semibold text-gray-900 text-lg">Revenue Analytics</p>
              <p className="text-sm text-gray-600 mt-1">View financial reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

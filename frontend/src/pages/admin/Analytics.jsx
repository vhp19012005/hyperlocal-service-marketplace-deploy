import React, { useEffect, useMemo, useState } from 'react';
import { DollarSign, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminAnalytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const txPerPage = 10;

  useEffect(() => {
    const mockTx = [
      { id: 'TX001', bookingId: 'BK001', userName: 'Priya Sharma', providerName: 'John Plumbing', date: '2024-01-20', status: 'paid', amount: 799, platformFee: 80, providerPayout: 719, paymentMethod: 'UPI' },
      { id: 'TX002', bookingId: 'BK003', userName: 'Anjali Patel', providerName: 'TechFix Solutions', date: '2024-01-19', status: 'paid', amount: 999, platformFee: 100, providerPayout: 899, paymentMethod: 'Card' },
      { id: 'TX003', bookingId: 'BK002', userName: 'Rahul Verma', providerName: 'CleanPro Services', date: '2024-01-20', status: 'pending', amount: 499, platformFee: 50, providerPayout: 449, paymentMethod: 'Cash' },
      { id: 'TX004', bookingId: 'BK005', userName: 'Sneha Reddy', providerName: 'John Plumbing', date: '2024-01-18', status: 'refunded', amount: 0, platformFee: 0, providerPayout: 0, paymentMethod: 'UPI' },
      { id: 'TX005', bookingId: 'BK004', userName: 'Amit Kumar', providerName: 'Quick Electrical', date: '2024-01-19', status: 'paid', amount: 649, platformFee: 65, providerPayout: 584, paymentMethod: 'UPI' },
    ];

    setTransactions(mockTx);
    setFilteredTransactions(mockTx);
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.bookingId.toLowerCase().includes(q) ||
        t.userName.toLowerCase().includes(q) ||
        t.providerName.toLowerCase().includes(q)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, transactions]);

  const statusOptions = useMemo(() => (['all', ...new Set(transactions.map(t => t.status))]), [transactions]);

  const indexOfLast = currentPage * txPerPage;
  const indexOfFirst = indexOfLast - txPerPage;
  const currentTx = filteredTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTransactions.length / txPerPage) || 1;

  const totals = useMemo(() => {
    const totalRevenue = filteredTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const totalPlatformFee = filteredTransactions.reduce((acc, t) => acc + (Number(t.platformFee) || 0), 0);
    const totalProviderPayout = filteredTransactions.reduce((acc, t) => acc + (Number(t.providerPayout) || 0), 0);
    return { totalRevenue, totalPlatformFee, totalProviderPayout };
  }, [filteredTransactions]);

  const exportRevenueCsv = () => {
    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows = [
      ['Transaction ID', 'Booking ID', 'User', 'Provider', 'Date', 'Status', 'Amount', 'Platform Fee', 'Provider Payout', 'Payment Method'],
      ...filteredTransactions.map(t => [t.id, t.bookingId, t.userName, t.providerName, t.date, t.status, t.amount, t.platformFee, t.providerPayout, t.paymentMethod])
    ];

    const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusPill = (status) => {
    if (status === 'paid') return 'bg-green-100 text-green-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      <div className="bg-blue-600 border-b border-blue-700 rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Total Revenue</h1>
              <p className="text-blue-100">Revenue analytics and transaction history</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={exportRevenueCsv}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                Export Revenue
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mt-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{totals.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Platform Fees</p>
                <p className="text-2xl font-bold text-gray-900">₹{totals.totalPlatformFee.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Provider Payouts</p>
                <p className="text-2xl font-bold text-gray-900">₹{totals.totalProviderPayout.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
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
                  placeholder="Search by tx id, booking id, user, provider..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTx.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.bookingId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{t.userName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{t.providerName}</div>
                      <div className="text-xs text-gray-500">{t.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{t.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{t.platformFee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{t.providerPayout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {filteredTransactions.length ? indexOfFirst + 1 : 0} to {Math.min(indexOfLast, filteredTransactions.length)} of {filteredTransactions.length} transactions
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

export default AdminAnalytics;

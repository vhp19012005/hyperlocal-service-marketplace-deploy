import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  FileText,
  Plus,
  X,
  Check,
  Clock,
  AlertCircle,
  BanknoteIcon,
  Briefcase
} from "lucide-react";

export default function EarningsWallet() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "****1234",
    bankName: "State Bank of India",
    ifsc: "SBIN0001234"
  });

  // Dummy earnings data
  const earningsData = {
    today: {
      total: 2450,
      jobs: 3,
      transactions: [
        { id: 1, type: "earning", amount: 1200, description: "AC Repair - Amit Sharma", time: "10:30 AM", status: "completed" },
        { id: 2, type: "earning", amount: 850, description: "Plumbing - Priya Patel", time: "2:15 PM", status: "completed" },
        { id: 3, type: "earning", amount: 400, description: "Cleaning - Rahul Verma", time: "4:45 PM", status: "completed" }
      ]
    },
    weekly: {
      total: 12450,
      jobs: 18,
      transactions: [
        { id: 1, type: "earning", amount: 1200, description: "AC Repair - Amit Sharma", time: "Today, 10:30 AM", status: "completed" },
        { id: 2, type: "earning", amount: 850, description: "Plumbing - Priya Patel", time: "Today, 2:15 PM", status: "completed" },
        { id: 3, type: "earning", amount: 400, description: "Cleaning - Rahul Verma", time: "Today, 4:45 PM", status: "completed" },
        { id: 4, type: "earning", amount: 1500, description: "Electrician - Sneha Reddy", time: "Yesterday, 11:00 AM", status: "completed" },
        { id: 5, type: "withdrawal", amount: -5000, description: "Withdrawal to Bank", time: "Yesterday, 3:00 PM", status: "completed" }
      ]
    },
    monthly: {
      total: 48500,
      jobs: 67,
      transactions: [
        { id: 1, type: "earning", amount: 1200, description: "AC Repair - Amit Sharma", time: "Today, 10:30 AM", status: "completed" },
        { id: 2, type: "earning", amount: 850, description: "Plumbing - Priya Patel", time: "Today, 2:15 PM", status: "completed" },
        { id: 3, type: "earning", amount: 400, description: "Cleaning - Rahul Verma", time: "Today, 4:45 PM", status: "completed" },
        { id: 4, type: "earning", amount: 1500, description: "Electrician - Sneha Reddy", time: "Yesterday, 11:00 AM", status: "completed" },
        { id: 5, type: "withdrawal", amount: -5000, description: "Withdrawal to Bank", time: "Yesterday, 3:00 PM", status: "completed" },
        { id: 6, type: "earning", amount: 2000, description: "AC Repair - Karan Singh", time: "Dec 20, 2:00 PM", status: "completed" },
        { id: 7, type: "earning", amount: 750, description: "Plumbing - Anjali Gupta", time: "Dec 19, 10:00 AM", status: "completed" }
      ]
    }
  };

  const currentData = earningsData[activeTab];
  const availableBalance = 15200; // Available for withdrawal

  const tabs = [
    { key: "today", label: "Today" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" }
  ];

  const handleWithdraw = () => {
    if (withdrawAmount && withdrawAmount <= availableBalance) {
      console.log("Withdrawal requested:", withdrawAmount);
      setShowWithdrawModal(false);
      setWithdrawAmount("");
      // Handle withdrawal logic
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "earning":
        return <ArrowUpRight className="w-5 h-5 text-green-600" />;
      case "withdrawal":
        return <ArrowDownRight className="w-5 h-5 text-red-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "earning":
        return "text-green-600";
      case "withdrawal":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold">Earnings & Wallet</h1>
        </div>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-blue-100 text-sm mb-1">Available Balance</p>
              <p className="text-3xl font-bold">₹{availableBalance.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
          >
            Withdraw Balance
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-6">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-xl font-bold text-gray-900">₹{currentData.total.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Jobs Completed</p>
                <p className="text-xl font-bold text-gray-900">{currentData.jobs}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
          <button className="text-sm text-blue-600 hover:underline font-medium">
            Export
          </button>
        </div>

        <div className="space-y-3">
          {currentData.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.time}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {transaction.status === "completed" ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <Check className="w-3 h-3" />
                          Completed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-yellow-600">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === "earning" ? "+" : ""}₹{Math.abs(transaction.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bank Details */}
      <div className="px-4 mt-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h2>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{bankDetails.bankName}</p>
                  <p className="text-sm text-gray-600">A/C: {bankDetails.accountNumber}</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:underline font-medium">
                Edit
              </button>
            </div>
            
            <div className="pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">IFSC Code</p>
              <p className="font-medium text-gray-900">{bankDetails.ifsc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Money</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Balance</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xl font-bold text-gray-900">₹{availableBalance.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Amount</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  max={availableBalance}
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Withdrawals will be processed within 24 hours and will be credited to your registered bank account.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount("");
                }}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || withdrawAmount > availableBalance}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

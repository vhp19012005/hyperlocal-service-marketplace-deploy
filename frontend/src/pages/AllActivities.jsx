import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  Briefcase,
  Star,
  User,
  MapPin,
  Phone,
  MessageCircle,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  X,
  ChevronDown,
  Download
} from "lucide-react";

export default function AllActivities() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Comprehensive activities data
  const [allActivities] = useState([
    {
      id: "1",
      type: "completed",
      title: "AC Repair Service Completed",
      customerName: "Amit Sharma",
      serviceType: "AC Repair",
      amount: 1200,
      time: "Today, 10:30 AM",
      date: "2024-01-21",
      duration: "2 hours",
      rating: 5,
      distance: "2.3 km",
      address: "123, Sector 15, Noida",
      status: "completed",
      paymentStatus: "paid",
      earnings: "+₹1,200"
    },
    {
      id: "2",
      type: "request",
      title: "New Plumbing Service Request",
      customerName: "Priya Patel",
      serviceType: "Plumbing",
      amount: 800,
      time: "Today, 09:15 AM",
      date: "2024-01-21",
      rating: null,
      distance: "1.8 km",
      address: "456, Block A, Gurgaon",
      status: "pending",
      paymentStatus: "pending",
      earnings: null
    },
    {
      id: "3",
      type: "completed",
      title: "Washing Machine Repair",
      customerName: "Rahul Verma",
      serviceType: "Appliance Repair",
      amount: 850,
      time: "Yesterday, 6:45 PM",
      date: "2024-01-20",
      duration: "1.5 hours",
      rating: 4,
      distance: "3.1 km",
      address: "789, Phase 2, Delhi",
      status: "completed",
      paymentStatus: "paid",
      earnings: "+₹850"
    },
    {
      id: "4",
      type: "request",
      title: "Electrician Service Requested",
      customerName: "Sneha Reddy",
      serviceType: "Electrical",
      amount: 600,
      time: "Yesterday, 4:20 PM",
      date: "2024-01-20",
      rating: null,
      distance: "0.9 km",
      address: "321, Tower 7, Noida",
      status: "accepted",
      paymentStatus: "pending",
      earnings: null
    },
    {
      id: "5",
      type: "cancelled",
      title: "Service Cancelled by Customer",
      customerName: "Karan Singh",
      serviceType: "Cleaning",
      amount: 400,
      time: "2 days ago, 3:00 PM",
      date: "2024-01-19",
      rating: null,
      distance: "4.2 km",
      address: "654, Sector 62, Noida",
      status: "cancelled",
      paymentStatus: "refunded",
      earnings: "₹0"
    },
    {
      id: "6",
      type: "completed",
      title: "Deep Cleaning Service",
      customerName: "Anjali Gupta",
      serviceType: "Cleaning",
      amount: 1500,
      time: "3 days ago, 11:00 AM",
      date: "2024-01-18",
      duration: "3 hours",
      rating: 5,
      distance: "2.7 km",
      address: "987, Crossings Republik, Ghaziabad",
      status: "completed",
      paymentStatus: "paid",
      earnings: "+₹1,500"
    },
    {
      id: "7",
      type: "ongoing",
      title: "AC Installation in Progress",
      customerName: "Vikram Mehta",
      serviceType: "AC Installation",
      amount: 2000,
      time: "4 days ago, 2:30 PM",
      date: "2024-01-17",
      rating: null,
      distance: "5.1 km",
      address: "147, Indirapuram, Ghaziabad",
      status: "in-progress",
      paymentStatus: "pending",
      earnings: null
    },
    {
      id: "8",
      type: "completed",
      title: "Water Purifier Repair",
      customerName: "Neha Sharma",
      serviceType: "Appliance Repair",
      amount: 750,
      time: "5 days ago, 10:00 AM",
      date: "2024-01-16",
      duration: "1 hour",
      rating: 4,
      distance: "1.2 km",
      address: "258, Sector 16, Noida",
      status: "completed",
      paymentStatus: "paid",
      earnings: "+₹750"
    }
  ]);

  const filters = [
    { value: "all", label: "All Activities", count: allActivities.length },
    { value: "completed", label: "Completed", count: allActivities.filter(a => a.type === "completed").length },
    { value: "request", label: "Requests", count: allActivities.filter(a => a.type === "request").length },
    { value: "ongoing", label: "Ongoing", count: allActivities.filter(a => a.type === "ongoing").length },
    { value: "cancelled", label: "Cancelled", count: allActivities.filter(a => a.type === "cancelled").length }
  ];

  const dateFilters = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ];

  const filteredActivities = allActivities.filter(activity => {
    const matchesFilter = activeFilter === "all" || activity.type === activeFilter;
    const matchesSearch = activity.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = activity.date === "2024-01-21";
    } else if (dateFilter === "week") {
      const activityDate = new Date(activity.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = activityDate >= weekAgo;
    } else if (dateFilter === "month") {
      const activityDate = new Date(activity.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = activityDate >= monthAgo;
    }
    
    return matchesFilter && matchesSearch && matchesDate;
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "request":
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case "ongoing":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "cancelled":
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (type) => {
    switch (type) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "request":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "ongoing":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const totalEarnings = allActivities
    .filter(a => a.earnings && a.earnings !== "₹0")
    .reduce((sum, a) => sum + parseInt(a.earnings.replace(/[^\d]/g, '')), 0);

  const completedJobs = allActivities.filter(a => a.type === "completed").length;
  const averageRating = allActivities
    .filter(a => a.rating)
    .reduce((sum, a, _, arr) => sum + a.rating / arr.filter(a => a.rating).length, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold">All Activities</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-blue-100 text-xs sm:text-sm mb-1">Total Earnings</p>
            <p className="text-lg sm:text-xl font-bold">₹{totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-blue-100 text-xs sm:text-sm mb-1">Completed Jobs</p>
            <p className="text-lg sm:text-xl font-bold">{completedJobs}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-blue-100 text-xs sm:text-sm mb-1">Avg Rating</p>
            <p className="text-lg sm:text-xl font-bold">{averageRating.toFixed(1)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-blue-100 text-xs sm:text-sm mb-1">Total Activities</p>
            <p className="text-lg sm:text-xl font-bold">{allActivities.length}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities, customers, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-3 sm:px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    activeFilter === filter.value
                      ? "bg-white text-blue-600"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">More</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Additional Filters */}
          {showFilters && (
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Date Range</label>
                <div className="flex gap-2 flex-wrap">
                  {dateFilters.map((date) => (
                    <button
                      key={date.value}
                      onClick={() => setDateFilter(date.value)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        dateFilter === date.value
                          ? "bg-white text-blue-600"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {date.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activities List */}
      <div className="px-4 sm:px-6 py-6">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-lg">No activities found</p>
            <p className="text-gray-400 text-base mt-1">Try adjusting your filters or search</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Activity Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getStatusColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">
                            {activity.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{activity.customerName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{activity.serviceType}</span>
                            </div>
                            {activity.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span>{activity.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.type)}`}>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1).replace('-', ' ')}
                          </span>
                          {activity.earnings && (
                            <div className="flex items-center gap-1">
                              {activity.earnings.startsWith('+') ? (
                                <ArrowUpRight className="w-4 h-4 text-green-600" />
                              ) : (
                                <span className="w-4 h-4" />
                              )}
                              <span className={`font-semibold ${activity.earnings.startsWith('+') ? 'text-green-600' : 'text-gray-600'}`}>
                                {activity.earnings}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{activity.time}</span>
                        </div>
                        {activity.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{activity.duration}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{activity.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>₹{activity.amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Details */}
                <div className="p-4 sm:p-6 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{activity.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Payment Status</p>
                        <p className={`text-sm font-medium ${
                          activity.paymentStatus === 'paid' ? 'text-green-600' : 
                          activity.paymentStatus === 'refunded' ? 'text-red-600' : 
                          'text-orange-600'
                        }`}>
                          {activity.paymentStatus.charAt(0).toUpperCase() + activity.paymentStatus.slice(1)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {activity.type === 'completed' && (
                          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                            <Phone className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Button */}
      <div className="px-4 sm:px-6 pb-6">
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
          <Download className="w-5 h-5" />
          Export Activities
        </button>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, DollarSign, CheckCircle, Clock, Star } from "lucide-react";

const SummaryCards = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ newRequests: 0, ongoingJobs: 0, completedJobs: 0, averageRating: 0 });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/booking/provider/stats`, { withCredentials: true })
      .then((res) => {
        const data = res.data || {};
        const nr = Number(data.newRequests || 0);
        const og = Number(data.ongoingJobs || 0);
        const cj = Number(data.completedJobs || 0);
        const ar = Number(data.averageRating || 0);
        // If backend has no data, use static demo values on frontend
        if (nr === 0 && og === 0 && cj === 0 && ar === 0) {
          setStats({ newRequests: 0, ongoingJobs: 0, completedJobs: 0, averageRating: 0 });
        } else {
          setStats({ newRequests: nr, ongoingJobs: og, completedJobs: cj, averageRating: ar });
        }
      })
      .catch(() => {
        // On error, keep previous or use demo
        setStats((prev) => prev.newRequests === 0 && prev.ongoingJobs === 0 && prev.completedJobs === 0 && prev.averageRating === 0
          ? { newRequests: 5, ongoingJobs: 2, completedJobs: 12, averageRating: 4.8 }
          : prev);
      });
  }, []);

  const summaryCards = [
    {
      title: "New Requests",
      value: String(stats.newRequests ?? 0),
      icon: Clock,
      color: "bg-blue-500",
      path: "/service-requests",
      trend: "+2 from yesterday",
      trendColor: "text-green-600",
    },
    {
      title: "Ongoing Jobs",
      value: String(stats.ongoingJobs ?? 0),
      icon: Briefcase,
      color: "bg-orange-500",
      path: "/service-requests",
      trend: "Same as yesterday",
      trendColor: "text-gray-600",
    },
    {
      title: "Completed Jobs",
      value: String(stats.completedJobs ?? 0),
      icon: CheckCircle,
      color: "bg-green-500",
      path: "/service-requests",
      trend: "+3 from yesterday",
      trendColor: "text-green-600",
    },
    {
      title: "Avg. Rating",
      value: String((stats.averageRating ?? 0).toFixed ? stats.averageRating.toFixed(1) : stats.averageRating),
      icon: Star,
      color: "bg-yellow-500",
      path: "/profile-settings",
      trend: "0.2 increase",
      trendColor: "text-green-600",
    },
    {
      title: "Earnings Today",
      value: "₹2,450",
      icon: DollarSign,
      color: "bg-purple-500",
      path: "/earnings-wallet",
      trend: "+15% from yesterday",
      trendColor: "text-green-600",
    },
    {
      title: "Response Time",
      value: "5 min",
      icon: Clock,
      color: "bg-indigo-500",
      path: "/profile-settings",
      trend: "2 min faster",
      trendColor: "text-green-600",
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-8 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Summary</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(card.path)}
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
    </div>
  );
};

export default SummaryCards;

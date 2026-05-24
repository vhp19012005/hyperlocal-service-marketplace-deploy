import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const RecentActivity = () => {
  const navigate = useNavigate();
  const recentActivities = [
    {
      _id: "1",
      type: "completed",
      title: "AC Repair Service Completed",
      time: "Today • 10:30 AM",
      amount: 1200,
    },
    {
      _id: "2",
      type: "request",
      title: "New Plumbing Service Request",
      time: "Today • 09:15 AM",
    },
    {
      _id: "3",
      type: "completed",
      title: "Washing Machine Repair",
      time: "Yesterday • 6:45 PM",
      amount: 850,
    },
    {
      _id: "4",
      type: "request",
      title: "Electrician Service Requested",
      time: "Yesterday • 4:20 PM",
    },
  ];

  const [activities, setActivities] = useState(recentActivities);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/booking/recentactivity`, { withCredentials: true })
      .then((res) => {
        const data = res.data || {};
        setActivities(data.activity || []);
      })
      .catch((err) => {
        console.error("Error fetching recent activity:", err);
      });
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Activity
        </h2>
        <button
          onClick={() => navigate("/all-activities")}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          View all
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="flex items-center gap-4 p-4 sm:p-6 hover:bg-gray-50 transition"
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full flex-shrink-0 ${
                activity.type === "completed"
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {activity.type === "completed" ? (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                {activity.title}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
               {activity.date} {activity.time}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              {activity.amount ? (
                <p className="text-base sm:text-lg font-semibold text-green-600">
                  + ₹{activity.amount}
                </p>
              ) : (
                <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
                  New
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;

import { useNavigate } from "react-router-dom";
import { List, Wallet, User } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: "View Requests",
      icon: List,
      path: "/service-requests",
      color: "bg-blue-600",
    },
    {
      label: "Wallet",
      icon: Wallet,
      path: "/earnings-wallet",
      color: "bg-blue-600",
    },
    {
      label: "Profile",
      icon: User,
      path: "/profile-settings",
      color: "bg-blue-600",
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-10 max-w-6xl mx-auto">
      <h2 className="text-lg font-semibold mb-6 text-gray-900">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className={`${action.color} text-white rounded-xl p-4 sm:p-6 flex flex-col items-center gap-3 shadow hover:shadow-lg hover:opacity-90 transition-all`}
            >
              <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="text-sm font-medium">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;

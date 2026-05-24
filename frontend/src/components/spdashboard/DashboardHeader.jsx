import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

const DashboardHeader = ({ providerName }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/service-provider-login');
    } catch (e) {
      console.error('Logout failed', e);
      navigate('/service-provider-login');
    }
  };

  return (
    <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-b-3xl shadow-lg">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Top Section - Greeting and Icons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-1">
              Hello, {providerName} 👋
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Ready to work today?
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 order-3 sm:order-2">
            <button
              onClick={() => navigate("/profile-settings")}
              className="p-2 sm:p-2.5 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 sm:p-2.5 bg-white/20 rounded-full hover:bg-white/30 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;

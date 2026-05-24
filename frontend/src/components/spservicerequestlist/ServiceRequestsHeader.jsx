import { useNavigate } from "react-router-dom";
import { X, Search } from "lucide-react";

const ServiceRequestsHeader = ({ searchQuery, setSearchQuery, filters, activeFilter, setActiveFilter }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-b-3xl shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-semibold">Service Requests</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer name or service type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
        />
      </div>

      {/* Filter Tabs */}
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
    </div>
  );
}

export default ServiceRequestsHeader;
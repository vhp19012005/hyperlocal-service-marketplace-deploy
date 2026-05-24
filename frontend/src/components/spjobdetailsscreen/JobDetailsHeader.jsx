import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const JobDetailsHeader = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-b-3xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold">Job Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default JobDetailsHeader;

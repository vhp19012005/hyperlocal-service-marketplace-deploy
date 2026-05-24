import { Star } from "lucide-react";
import { ServiceProviderDataContext } from "../../context/ServiceProviderContext";
import { useContext } from "react";
  
const OverallRating = ({ averageRating, totalJobs, renderStars }) => {
  const { provider } = useContext(ServiceProviderDataContext);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Overall Rating</h3>
        <div className="text-right">
          <div className="flex items-center gap-1">
            {renderStars(Number(provider.averageRating).toFixed(1))}
            <span className="text-xl font-bold text-gray-900 ml-2">{Number(provider.averageRating).toFixed(1)}</span>
          </div>
          <p className="text-sm text-gray-500">Based on {provider.totalReviews} jobs</p>
        </div>
      </div>
    </div>
  );
}

export default OverallRating;

import { Check, X, Eye, Briefcase, MapPin, Clock } from "lucide-react";

const ServiceRequestCard = ({ 
  request, 
  getStatusColor, 
  onAccept, 
  onReject, 
  onViewDetails, 
  onStartJob 
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
      {/* Request Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{request.customerName}</h3>
            <p className="text-sm text-gray-600">{request.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border self-start sm:self-auto ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            <span>{request.serviceType}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{request.distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{request.time}</span>
          </div>
        </div>
      </div>

      {/* Request Details */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{request.address}</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Estimated Price</p>
            <p className="text-lg font-semibold text-blue-600">{request.price}</p>
            {request.extraCharges ? (
              <>
                <p className="text-xs text-gray-500">Extra Charges: {request.extraCharges}</p>
                <p className="text-xs text-gray-500">Reason: {request.extraChargesReason || "N/A"}</p>
              </>
            ): null}
          </div>
        </div>

        {/* Action Buttons */}
        {request.status === "pending" && (
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => onAccept(request.id)}
                className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Accept</span>
                <span className="sm:hidden">Accept</span>
              </button>
              <button
                onClick={() => onReject(request.id)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Reject</span>
                <span className="sm:hidden">Reject</span>
              </button>
            </div>
            <button
              onClick={() => onViewDetails(request)}
              className="w-full bg-blue-100 text-gray-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium hover:bg-blue-200 transition flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        )}

        {request.status === "accepted" && (
          <div className="flex flex-col gap-2 sm:gap-3">
            <button
              onClick={() => onStartJob(request.id)}
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Start Job
            </button>
          </div>
        )}

        {request.status === "completed" && (
          <div className="flex flex-col gap-2 sm:gap-3">
            <button
              onClick={() => onViewDetails(request)}
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium hover:bg-blue-700 transition text-sm sm:text-base"
            >
              View Details
            </button>
          </div>
        )}

        {request.status === "rejected" && (
          <div className="flex flex-col gap-2 sm:gap-3">
            <button
              onClick={() => onViewDetails(request)}
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium hover:bg-blue-700 transition text-sm sm:text-base"
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceRequestCard;

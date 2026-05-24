import { Briefcase } from "lucide-react";
import ServiceRequestCard from "./ServiceRequestCard";

const ServiceRequestsListComponent = ({ 
  filteredRequests, 
  activeFilter,
  getStatusColor, 
  onAccept, 
  onReject, 
  onViewDetails, 
  onStartJob 
}) => {
  if (filteredRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-medium text-base sm:text-lg">No {activeFilter} requests found</p>
        <p className="text-gray-400 text-sm sm:text-base mt-1">Check back later for new requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredRequests.map((request) => (
          <ServiceRequestCard
          key={request.id}
          request={request}
          getStatusColor={getStatusColor}
          onAccept={onAccept}
          onReject={onReject}
          onViewDetails={onViewDetails}
          onStartJob={onStartJob}
        />
      ))}
    </div>
  );
}

export default ServiceRequestsListComponent;

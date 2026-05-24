import { X, User, Briefcase, MapPin, Clock, Phone } from "lucide-react";

const ServiceDetailsModal = ({ 
  showDetailsModal, 
  selectedRequest, 
  onCloseModal, 
  onCallCustomer, 
  getStatusColor 
}) => {
  if (!showDetailsModal || !selectedRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Service Request Details</h2>
            <button
              onClick={onCloseModal}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          {/* Customer Information */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              Customer Information
            </h3>
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-gray-600">Name</span>
                <span className="font-medium text-gray-900 text-sm sm:text-base text-right">{selectedRequest.customerName}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-gray-600">Address</span>
                <span className="text-xs sm:text-sm text-gray-900 text-right max-w-xs">{selectedRequest.address}</span>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              Service Information
            </h3>
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-gray-600">Service Type</span>
                <span className="font-medium text-gray-900 text-sm sm:text-base text-right">{selectedRequest.serviceType}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-gray-600">Description</span>
                <span className="text-xs sm:text-sm text-gray-900 text-right max-w-xs">{selectedRequest.description}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-gray-600">Distance</span>
                <div className="flex items-center gap-1 justify-end">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  <span className="text-gray-900 text-sm sm:text-base">{selectedRequest.distance}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-gray-600">Time</span>
                <div className="flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  <span className="text-gray-900 text-sm sm:text-base">{selectedRequest.time}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-gray-600">Estimated Price</span>
                <span className="text-base sm:text-lg font-semibold text-blue-600 text-right">{selectedRequest.price}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-xs sm:text-sm text-gray-600">Status</span>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex gap-2 sm:gap-3">
            <button 
              onClick={() => onCallCustomer(selectedRequest.customerName)}
              className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Phone className="w-4 h-4" />
              Call Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetailsModal;

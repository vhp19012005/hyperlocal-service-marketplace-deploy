import { User, Phone } from "lucide-react";

const CustomerDetails = ({ job, onCallCustomer }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-600" />
        Customer Details
      </h2>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div>
            <p className="font-medium text-gray-900 text-sm sm:text-base">{job.customerName}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCallCustomer}
              className="p-2 sm:p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        
        <div className="pt-3 sm:pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Contact</p>
          <p className="text-gray-900 text-sm sm:text-base">{job.customerPhone}</p>
          <p className="text-gray-900 text-sm">{job.customerEmail}</p>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetails;

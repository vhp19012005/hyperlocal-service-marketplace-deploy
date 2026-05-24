import { Calendar, Clock } from "lucide-react";

const SchedulePricing = ({ job }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        Schedule & Pricing
      </h2>
      
      <div className="space-y-3 sm:space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Scheduled Time
          </p>
          <p className="font-medium text-gray-900 text-sm sm:text-base">{job.scheduledTime}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <span className="text-base font-medium">₹</span>
            Estimated Price
          </p>
          <p className="font-medium text-gray-900 text-sm sm:text-base">₹{job.estimatedPrice}</p>
        </div>
        
        <div className="pt-3 sm:pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Payment Method</p>
          <p className="font-medium text-gray-900 text-sm sm:text-base">{job.paymentMethod}</p>
        </div>
      </div>
    </div>
  );
}

export default SchedulePricing;

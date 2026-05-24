import { Briefcase } from "lucide-react";

const ServiceInformation = ({ job }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-blue-600" />
        Service Information
      </h2>
      
      <div className="space-y-3 sm:space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Service Type</p>
          <p className="font-medium text-gray-900 text-sm sm:text-base">{job.serviceType}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1">Description</p>
          <p className="text-gray-900 text-sm sm:text-base">{job.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ServiceInformation;

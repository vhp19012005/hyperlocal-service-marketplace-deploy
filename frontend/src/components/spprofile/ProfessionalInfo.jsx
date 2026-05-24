import { Check, Edit2 } from "lucide-react";
import { ServiceProviderDataContext } from "../../context/ServiceProviderContext";
import { useContext } from "react";
  
const ProfessionalInfo = ({ profileData, isEditing, onProfileDataChange, onToggleEdit }) => {
  const { provider } = useContext(ServiceProviderDataContext);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
        <button
          onClick={onToggleEdit}
          className={`p-2 rounded-lg transition ${
            isEditing 
              ? "bg-green-100 text-green-600 hover:bg-green-200" 
              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
          }`}
        >
          {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
          <input
            type="text"
            value={provider.address + ", " + provider.city}
            onChange={(e) => onProfileDataChange('serviceArea', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
          <input
            type="text"
            value={profileData.experience ?? ''}
            onChange={(e) => onProfileDataChange('experience', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visiting Cost</label>
          <input
            type="text"
            value={profileData.visitingCost ?? ''}
            onChange={(e) => onProfileDataChange('visitingCost', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            placeholder="e.g., ₹150-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio/Description</label>
          <textarea
            value={`Professional ${provider.serviceName} and ${provider.serviceCategory}  with ${provider.experience} years of experience. Certified technician with excellent customer ratings.`}
            onChange={(e) => onProfileDataChange('description', e.target.value)}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}

export default ProfessionalInfo;

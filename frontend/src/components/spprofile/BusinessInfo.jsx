import { Check, Edit2 } from "lucide-react";
import { ServiceProviderDataContext } from "../../context/ServiceProviderContext";
import { useContext } from "react";
const BusinessInfo = ({ profileData, isEditing, onProfileDataChange, onToggleEdit }) => {
  const { provider } = useContext(ServiceProviderDataContext);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
          <input
            type="text"
            value={`${provider.firstName} ${provider.lastName} Services`}
            onChange={(e) => onProfileDataChange('businessName', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            placeholder="e.g., Rajesh Repair Services"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
          <select
            value={profileData.businessType}
            onChange={(e) => onProfileDataChange('businessType', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="Individual">Individual</option>
            <option value="Partnership">Partnership</option>
            <option value="Private Limited">Private Limited</option>
            <option value="LLP">LLP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
          <input
            type="text"
            value={profileData.gstNumber}
            onChange={(e) => onProfileDataChange('gstNumber', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            placeholder="e.g., 09AAAPL1234C1ZV"
          />
        </div>
      </div>
    </div>
  );
}

export default BusinessInfo;

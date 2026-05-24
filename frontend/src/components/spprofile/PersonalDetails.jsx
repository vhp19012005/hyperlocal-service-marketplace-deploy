import { Check, Edit2 } from "lucide-react";
import { ServiceProviderDataContext } from "../../context/ServiceProviderContext";
import { useContext } from "react";

const PersonalDetails = ({ profileData, isEditing, onProfileDataChange, onToggleEdit }) => {
  const { provider } = useContext(ServiceProviderDataContext);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={profileData.name ?? ''}
            onChange={(e) => onProfileDataChange('name', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            value={profileData.phone ?? ''}
            onChange={(e) => onProfileDataChange('phone', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={profileData.email ?? ''}
            onChange={(e) => onProfileDataChange('email', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            value={profileData.address ?? ''}
            onChange={(e) => onProfileDataChange('address', e.target.value)}
            disabled={!isEditing}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={profileData.city ?? ''}
              onChange={(e) => onProfileDataChange('city', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              placeholder="e.g., Noida"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">pincode</label>
            <input
              type="text"
              value={profileData.pincode ?? ''}
              onChange={(e) => onProfileDataChange('pincode', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              placeholder="e.g., 201301"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalDetails;

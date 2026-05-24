import { Check, Edit2 } from "lucide-react";

const WorkingHours = ({ isEditing, onToggleEdit }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Working Hours</h3>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              defaultValue="09:00"
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              defaultValue="18:00"
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkingHours;

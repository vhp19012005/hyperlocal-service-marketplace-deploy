import { Plus } from "lucide-react";

export function ExtraCharges({ extraCharges, extraChargesReason, onAddCharges }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Extra Charges</h2>
        <button
          onClick={onAddCharges}
          className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      {extraCharges > 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-blue-900">Additional Charges</p>
              <p className="text-sm text-blue-700">{extraChargesReason}</p>
            </div>
            <p className="text-lg font-semibold text-blue-900">+₹{extraCharges}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No extra charges added</p>
      )}
    </div>
  );
}

export default ExtraCharges;

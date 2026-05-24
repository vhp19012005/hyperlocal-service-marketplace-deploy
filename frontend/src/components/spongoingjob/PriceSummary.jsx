export function PriceSummary({ job, extraCharges, totalPrice }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Price Summary</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Base Price</span>
          <span className="font-medium">₹{job.basePrice}</span>
        </div>
        {extraCharges > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Extra Charges</span>
            <span className="font-medium">₹{extraCharges}</span>
          </div>
        )}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total Price</span>
            <span className="text-xl font-bold text-blue-600">₹{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceSummary;

const AvailabilityStatus = ({ isAvailable, onToggle }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isAvailable ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <span className="text-gray-900 text-base font-medium">
            You are {isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>

        <button
          onClick={onToggle}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            isAvailable ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              isAvailable ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default AvailabilityStatus;

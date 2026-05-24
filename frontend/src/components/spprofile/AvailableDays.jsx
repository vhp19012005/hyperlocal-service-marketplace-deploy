const AvailableDays = ({ isEditing }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Days</h3>
      
      <div className="space-y-3">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
          <div key={day} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{day}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={day !== 'Sunday'}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailableDays;

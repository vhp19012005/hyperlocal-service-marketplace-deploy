import { MapPin, Navigation } from "lucide-react";

const LocationMap = ({ job, onGetDirections }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        Location
      </h2>
      
      <div className="space-y-3 sm:space-y-4">
        <div>
          <p className="text-gray-900 text-sm sm:text-base">{job.address}</p>
        </div>
        
        {/* Map Preview */}
        <div className="relative h-48 sm:h-64 bg-gray-100 rounded-xl overflow-hidden">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(job.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map Preview"
          />
          <button
            onClick={onGetDirections}
            className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-1 shadow-lg"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationMap;

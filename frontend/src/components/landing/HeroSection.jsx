import { Search } from "lucide-react";
import { useState } from "react";

const SERVICES = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Cleaning",
  "AC Repair",
  "Painter",
  "Tutor",
  "Beautician",
  "Home Cleaning",
  "Salon at Home",
  "Car Repair",
  "Gardening",
];

const HeroSection = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  const isServiceValid = (service) => {
  return SERVICES.some(
    (s) => s.toLowerCase() === service.trim().toLowerCase()
  );
};


  const filteredServices =
    searchQuery.trim() !== ""
      ? SERVICES.filter((service) =>
          service.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!searchQuery.trim()) return;

  if (!isServiceValid(searchQuery)) {
    setErrorMsg("Service not available");
    setShowSuggestions(false);
    return;
  }

  setErrorMsg("");
  onSearch(searchQuery);
  setShowSuggestions(false);
};


  const handleSuggestionClick = (service) => {
  if (!isServiceValid(service)) {
    setErrorMsg("Service not available");
    return;
  }

  setErrorMsg("");
  setSearchQuery(service);
  setShowSuggestions(false);
  onSearch(service);
};


  return (
    <section className="bg-blue-600 px-4 sm:px-6 pt-16 sm:pt-20 pb-24 sm:pb-28 rounded-b-3xl">
      <div className="max-w-3xl mx-auto text-center relative">
        
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
          Find Local Service Providers Near You
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white mb-10">
          Connect with trusted professionals in your area
        </p>

        {/* SEARCH */}
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />

          <input
            type="text"
            placeholder="Search plumber, electrician, cleaning..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="
              w-full
              h-14 sm:h-16
              pl-12 sm:pl-14
              pr-24
              rounded-2xl
              bg-white
              text-black
              border-2 border-gray-200
              focus:border-gray-600
              outline-none
            "
          />

          <button
            type="submit"
            className="
              text-white
              absolute right-2 top-1/2 -translate-y-1/2
              h-10 sm:h-12
              px-5 sm:px-8
              rounded-xl
              bg-blue-600
              font-medium
              hover:font-bold hover:bg-blue-700 hover:cursor-pointer
              transition
              
            "
          >
            Search
          </button>

          {/* 🔽 SUGGESTIONS DROPDOWN */}
          {showSuggestions && filteredServices.length > 0 && (
            <div className="
              absolute
              top-full
              mt-2
              w-full
              bg-white
              rounded-xl
              shadow-xl
              overflow-hidden
              z-20
              text-left
            ">
              {filteredServices.map((service, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(service)}
                  className="
                    px-4 py-3
                    cursor-pointer
                    text-sm sm:text-base
                    text-black
                    hover:bg-blue-50
                  "
                >
                  {service}
                </div>
              ))}
            </div>
          )}
        </form>
        {errorMsg && (
  <p className="mt-5 bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
    {errorMsg}
  </p>
)}

      </div>
    </section>
  );
};

export default HeroSection;

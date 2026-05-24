
import React, { useState } from "react";
import { LayoutGrid, CheckCircle2 } from "lucide-react";


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

const ProviderRecommendations = ({ onServiceSelect,setOnServiceSelect }) => {
  
  const [selectedService, setSelectedService] = useState(onServiceSelect||"Plumber");

  const handleServiceClick = (service) => {
    // Toggle selection: if clicking the same one, clear it; otherwise, select new.
    const newSelection = selectedService === service ? null : service;
    setSelectedService(newSelection);
    
    // Notify the parent (App.js) to filter the map markers
    if (onServiceSelect) {
      setOnServiceSelect(newSelection);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-4 h-full flex flex-col overflow-hidden">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2 text-blue-500"><LayoutGrid size={20}/></span>
        Select a Service
      </h2>
      
      {/* Scrollable Grid of Services */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-3">
          {SERVICES.map((service) => (
            <button
              key={service}
              onClick={() => handleServiceClick(service)}
              className={`
                relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
                ${selectedService === service 
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md" 
                  : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-white"
                }
              `}
            >
              {selectedService === service && (
                <div className="absolute top-2 right-2 text-blue-500">
                  <CheckCircle2 size={16} />
                </div>
              )}
              
              {/* Service Label */}
              <span className="text-xs font-bold text-center leading-tight">
                {service}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t">
        <p className="text-[10px] text-gray-400 text-center italic">
          {selectedService 
            ? `Showing all ${selectedService}s near you` 
            : "Select a category to see providers on map"}
        </p>
      </div>
    </div>
  );
};

export default ProviderRecommendations;
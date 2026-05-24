import React, { useContext, useEffect, useState } from "react";
import OpenStreetMapPlot from "../components/OpenStreetMapPlot";
import SmartLocationInput from "../components/SmartLocationInput";
import ProviderRecommendations from "../components/ProviderRecommendations";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { Menu, X } from "lucide-react"; 
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

function Map() {
  const {user}  = useContext(UserDataContext); 
  const [lat, setLat] = useState(user.profile.lat); // Default Ahmedabad
  const [lng, setLng] = useState(user.profile.long);
  const [address, setAddress] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle state
  const location = useLocation();
  const [service, setService] = useState(location.state?.query||"plumber");
  const [providers, setProviders] = useState([]);
  useEffect(() => {
     axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getallproviders`,{withCredentials:true})
     .then((res)=>{
      setProviders(res.data.providers);
     })
    
  }, [])
  
    // console.log(lat,lng);
  // console.log(providers);

  const handleLocationChange = async (newLat, newLng, manualAddress = null) => {
    setLat(newLat);
    setLng(newLng);

    if (manualAddress) {
      setAddress(manualAddress);
    } else {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}`);
      const data = await res.json();
      setAddress(data.display_name);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Find Service Providers</h1>
            <p className="text-sm text-gray-600 mt-1">Search for services near your location</p>
          </div>
          
          {/* Mobile Toggle Button (Hidden on Desktop) */}
          <button 
            className="lg:hidden p-2 bg-gray-800 text-white rounded-md"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 flex-1 w-full relative">
        <div className="bg-white rounded-xl shadow-lg h-[calc(100vh-160px)] overflow-hidden flex">
          
          {/* Left Panel - Search & Recommendations */}
          {/* Logic: Hidden on mobile unless toggled, fixed as an overlay on mobile, standard flex on desktop */}
          <div className={`
            fixed inset-y-0 left-0 z-50 w-full bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-2/5 xl:w-1/3 lg:flex lg:flex-col lg:z-0
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            {/* Mobile Header for Sidebar */}
            <div className="flex justify-between items-center p-4 border-b lg:hidden">
              <span className="font-bold">Filters & Providers</span>
              <button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
            </div>

            <div className="bg-gray-50 flex flex-col h-full ">
              {/* Search Section */}
              <div className="p-4 border-b bg-white">
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2"><Search/></span> Search Location
                </h2>
                <SmartLocationInput
                  lat={lat} 
                  lng={lng} 
                  currentAddress={address}
                  onSelect={(lt, ln, addr) => {
                    handleLocationChange(lt, ln, addr);
                    setIsSidebarOpen(false); // Auto-close on selection for mobile
                  }}
                />
                <p className="text-xs text-gray-500 mt-2 truncate">
                   {address || "Searching..."}
                </p>
              </div>
              
              {/* Provider Recommendations */}
              <div className="flex-1 p-4 overflow-y-auto">
                <ProviderRecommendations
                 onServiceSelect={service}
                 setOnServiceSelect={setService}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="flex-1  z-0 bg-white relative">
            <div className="h-full  p-0 lg:p-4">
              <div className="h-full  rounded-none lg:rounded-xl overflow-hidden shadow-inner border">
                <OpenStreetMapPlot 
                  lat={lat} 
                  lng={lng} 
                  onLocationChange={(lt, ln) => handleLocationChange(lt, ln)} 
                  providers={providers}
                  service={service}
                />
              </div>
            </div>
          </div>

          {/* Backdrop Overlay for Mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Map;
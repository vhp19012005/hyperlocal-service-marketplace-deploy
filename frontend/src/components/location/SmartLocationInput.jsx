
import React, { useState, useEffect } from "react";

const SmartLocationInput = ({ lat, lng, onSelect, currentAddress }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (currentAddress) {
      setQuery(currentAddress);
    }
  }, [currentAddress]);

  // 🚀 REPLACE handleSearch WITH THIS
  const handleSearch = async (val) => {
    setQuery(val);
    if (val.length > 3) {
      try {
        // We include Gujarat's center (23.0225, 72.5714) to prioritize local results
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&limit=5&lat=23.0225&lon=72.5714`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Map Photon's GeoJSON format to match your UI's needs
        const formattedResults = data.features.map((f, index) => ({
          // Photon provides properties like name, street, city, etc.
          display_name: `${f.properties.name || ''} ${f.properties.city || ''} ${f.properties.state || ''}`.trim(),
          lat: f.geometry.coordinates[1],
          lon: f.geometry.coordinates[0],
          id: f.properties.osm_id || index // Use OSM ID or index as fallback
        }));
        
        setResults(formattedResults);
      } catch (error) {
        console.error("Photon Search Error:", error);
      }
    } else {
      setResults([]);
    } 
  };

  return (
    <div className="w-full relative">
     
      <input
        type="text"
        className="w-full p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 outline-none transition"
        placeholder="gh 5 gandhinagar"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      {results.length > 0 && (
        <ul className="absolute z-2000 w-full bg-white shadow-2xl border rounded-b-xl mt-1 overflow-hidden">
          {results.map((item) => (
            <li 
              key={item.id} // Changed from place_id to id
              className="p-3 hover:bg-blue-50 cursor-pointer border-b text-sm last:border-none"
              onClick={() => {
                onSelect(parseFloat(item.lat), parseFloat(item.lon), item.display_name);
                setResults([]);
              }}
            >
              <strong>{item.display_name.split(',')[0]}</strong> 
              <span className="text-gray-500 block text-xs">{item.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SmartLocationInput;
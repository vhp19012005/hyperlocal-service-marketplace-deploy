
import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import SmartLocationInput from "./SmartLocationInput";
import OpenStreetMapPlot from "./OpenStreetMapPlot";
import axios from "axios";

function MapModal({ isOpen, onClose, city, pincode, onConfirm }) {

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [address, setAddress] = useState("");
  const [providers, setProviders] = useState([]);

  /* Initial location from city / pincode */
  useEffect(() => {
    if (!isOpen || !city) return;

    const fetchInitialLocation = async () => {
      try {
        const query = pincode
          ? `${pincode} Gujarat India`
          : `${city} Gujarat India`;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
        );

        const data = await res.json();
        if (!data?.length) return;

        setLat(parseFloat(data[0].lat));
        setLng(parseFloat(data[0].lon));
        setAddress(data[0].display_name);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInitialLocation();
  }, [isOpen, city, pincode]);

  /* Fetch providers (optional, safe) */
  useEffect(() => {
    if (!isOpen) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getallproviders`, {
        withCredentials: true,
      })
      .then((res) => setProviders(res.data.providers))
      .catch(console.error);
  }, [isOpen]);

  /* Handle updates */
  const handleLocationChange = async (newLat, newLng, manualAddress = null) => {
    setLat(newLat);
    setLng(newLng);

    if (manualAddress) {
      setAddress(manualAddress);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}`
      );
      const data = await res.json();
      setAddress(data.display_name);
    } catch (err) {
      console.error(err);
    }
  };

  /* Log coords */
  useEffect(() => {
    if (lat && lng) console.log("Location:", { lat, lng });
  }, [lat, lng]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white w-[95vw] h-[95vh] rounded-xl flex flex-col overflow-hidden">

        {/* HEADER (Confirm + Close always visible) */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold">Select Location</h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
  onConfirm({ lat, lng, address });
  onClose();
}}

              className="bg-blue-600 text-white px-4 py-1.5 rounded-md flex items-center gap-1"
            >
              <Check size={16} />
              Confirm
            </button>

            <button onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="p-4 border-b">
          <SmartLocationInput
            lat={lat}
            lng={lng}
            currentAddress={address}
            onSelect={(lt, ln, addr) =>
              handleLocationChange(lt, ln, addr)
            }
          />
        </div>

        {/* MAP */}
        <div className="flex-1">
          {lat && lng && (
            <OpenStreetMapPlot
              lat={lat}
              lng={lng}
              providers={providers}
              onLocationChange={(lt, ln) =>
                handleLocationChange(lt, ln)
              }
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default MapModal;

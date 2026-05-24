

import React, { useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Standard icon for the User/Center
const defaultIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Unique icon for Service Providers (Green)
const providerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 16);
  }, [center, map]);
  return null;
}

function DraggableMarker({ position, onLocationChange }) {
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          onLocationChange(newPos.lat, newPos.lng);
        }
      },
    }),
    [onLocationChange]
  );

  return (
    <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef} icon={defaultIcon}>
      <Popup>Your Selected Location</Popup>
    </Marker>
  );
}

const OpenStreetMapPlot = ({ lat, lng, onLocationChange, providers = [], service }) => {
  const centerPosition = [lat, lng];
  const RADIUS_METERS = 500;
  const navigate = useNavigate(); 

  
  // Filter providers that are within the 500m radius
  const nearbyProviders = providers.filter((provider) => {
    const providerLatLng = L.latLng(provider.lat, provider.long);
    const centerLatLng = L.latLng(lat, lng);
    const matchesService =
      provider.serviceName.toLowerCase() === service.toLowerCase();

    if (!matchesService) return false;
    return centerLatLng.distanceTo(providerLatLng) <= RADIUS_METERS;
  });


  function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // UX formatting
   

    return `${distance.toFixed(2)} `;
  }


  return (
    <div className="w-full h-full md:h-[80vh] rounded-xl overflow-hidden border shadow-inner">
      <MapContainer center={centerPosition} zoom={15} className="w-full h-full">
        <ChangeView center={centerPosition} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* User's Draggable Marker */}
        <DraggableMarker position={centerPosition} onLocationChange={onLocationChange} />

        

        {/* Render Nearby Providers */}
        {nearbyProviders.map((shop) => (
          <Marker
            key={shop._id}
            position={[shop.lat, shop.long]}
            icon={providerIcon}
          >
            <Popup>
              <div className="p-1">
                <div className="flex flex-col items-center mb-2">

                {console.log(shop.profileImage)}
                <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/providers/${shop.profileImage}`}alt="profileImage" className="h-16 w-16 rounded-full" />

                <h3 className="font-bold text-sm text-blue-600">{shop.firstName} {shop.lastName}</h3>
                </div>
                <p className="text-xs text-gray-600"> ⭐ {shop.averageRating} ({shop.totalReviews} reviews)</p>
                <p className="text-sm text-gray-700">
                  📍 {getDistanceKm(
                    lat,
                    lng,
                    shop.lat,
                    shop.long
                  )} km away
                </p>
                {shop.isAvailable ? (
                  <p className="text-sm text-green-600">
                    🟢 Available today
                  </p>
                ) : (
                  <p className="text-sm text-red-600">
                    🔴 Currently busy
                  </p>
                )}

               <button
                  onClick={() =>
                    navigate("/service-provider-profile/:providerId", {
                    state: { providerId: shop._id }
                    })
                  }
                    className="text-sm mt-2 bg-blue-500 text-white px-2 py-0.5 w-full cursor-pointer rounded"
                >
  View Profile
</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default OpenStreetMapPlot;
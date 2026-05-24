import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, MapPin } from "lucide-react";

const STATUS_LABEL_CLASSES = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const UserBookings = ({ className = "", onSelectBooking }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/booking/`, { withCredentials: true });
        setBookings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Unable to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  const closeModal = () => setSelectedBooking(null);

  return (
    <div className={"bg-white rounded-xl shadow-md p-6 " + className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">My Bookings</h3>
        <div className="flex gap-2">
          {["all", "pending", "accepted", "completed", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "px-3 py-1 rounded-full text-sm " + (filter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700")
              }
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading bookings...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-gray-500">No bookings found for this filter.</p>
      )}

      <ul className="space-y-3">
        {filtered.map((b) => (
          <li key={b._id} className="border rounded-lg p-3 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {b.provider?.serviceName || b.provider?.firstName || "Service"}
                  </h4>
                  <p className="text-sm text-gray-600">{b.provider?.firstName} {b.provider?.lastName}</p>
                </div>
                <span className={"px-3 py-1 rounded-full text-xs font-medium " + (STATUS_LABEL_CLASSES[b.status] || "bg-gray-100 text-gray-700")}>
                  {b.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Calendar size={14}/> {b.serviceDate || new Date(b.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Clock size={14}/> {b.serviceTime || "--"}</span>
                {b.address && <span className="flex items-center gap-1"><MapPin size={14}/> {b.address}</span>}
              </div>

              {b.notes && <p className="mt-2 text-sm text-gray-700">Notes: {b.notes}</p>}
            </div>

            <div className="ml-4 flex flex-col gap-2">
              <button
                onClick={() => setSelectedBooking(b)}
                className="text-sm text-slate-700 border px-3 py-1 rounded-lg hover:bg-slate-50"
              >
                View
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Booking details modal */}
      {selectedBooking && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200}}>
          <div style={{maxWidth: 720, width: '100%', background: '#fff', borderRadius: 12, padding: 20, position: 'relative'}}>
            <button onClick={closeModal} style={{position: 'absolute', right: 12, top: 8, fontSize: 20, background: 'transparent', border: 'none', cursor: 'pointer'}}>&times;</button>

            <h3 className="text-xl font-semibold mb-2">Booking Details</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Service:</strong> {selectedBooking.provider?.serviceName || '—'}</p>
              <p><strong>Provider:</strong> {selectedBooking.provider?.firstName} {selectedBooking.provider?.lastName}</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
              <p><strong>Scheduled:</strong> {selectedBooking.serviceDate || new Date(selectedBooking.createdAt).toLocaleDateString()} {selectedBooking.serviceTime || ''}</p>
              {selectedBooking.address && <p><strong>Address:</strong> {selectedBooking.address}</p>}
              {selectedBooking.notes && <p><strong>Notes:</strong> {selectedBooking.notes}</p>}
              <p><strong>Created:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}</p>
              {selectedBooking.provider?.visitingCost !== undefined && <p><strong>Estimated Price:</strong> {selectedBooking.provider.visitingCost}</p>}
              {selectedBooking.reviewGiven !== undefined && <p><strong>Review given:</strong> {selectedBooking.reviewGiven ? 'Yes' : 'No'}</p>}
            </div>

            <div className="mt-4 flex gap-2 justify-end">
              {(!selectedBooking.reviewGiven && selectedBooking.status === 'completed') && (
                <button
                  onClick={() => { onSelectBooking?.(selectedBooking); closeModal(); }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Leave Review
                </button>
              )}

              <button onClick={closeModal} className="border px-4 py-2 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings;

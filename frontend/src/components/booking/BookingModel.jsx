import { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

/* ------------------ static data ------------------ */
const timeSlots = [
  { id: 1, time: "10:00 AM", available: true },
  { id: 2, time: "11:00 AM", available: true },
  { id: 3, time: "12:00 PM", available: true },
  { id: 4, time: "04:00 PM", available: true },
  { id: 5, time: "05:00 PM", available: true },
  { id: 6, time: "06:00 PM", available: true },
];

const steps = ["service", "datetime", "address", "summary"];
const today = new Date().toISOString().split("T")[0];

export default function BookingModel({ isOpen, onClose, provider }) {
  const [step, setStep] = useState("service");
  const [issue, setIssue] = useState("");

  const [booking, setBooking] = useState({
    date: "",
    timeSlot: null,
    address: {
      street: "",
      apartment: "",
      city: "",
      zipCode: "",
    },
  });

  const stepIndex = steps.indexOf(step);

  /* ------------------ validation ------------------ */
  const canProceed = () => {
    if (step === "service") return issue.trim().length > 0;

    if (step === "datetime")
      return booking.date && booking.timeSlot;

    if (step === "address")
      return (
        booking.address.street.trim() &&
        booking.address.city.trim() &&
        booking.address.zipCode.trim()
      );

    return true;
  };

  const next = () => canProceed() && setStep(steps[stepIndex + 1]);
  const back = () => stepIndex > 0 && setStep(steps[stepIndex - 1]);

  /* ------------------ confirm booking ------------------ */
  const confirmBooking = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/booking`, {
        provider: provider._id,
         issue,
        serviceDate: booking.date,
        serviceTime: booking.timeSlot.time,
        address: `${booking.address.street}, ${booking.address.apartment ? booking.address.apartment + ", " : ""}${booking.address.city} - ${booking.address.zipCode}`,
      }, { withCredentials: true });

      alert("✅ Booking Confirmed");

      // reset
      setStep("service");
      setIssue("");
      setBooking({
        date: "",
        timeSlot: null,
        address: { street: "", apartment: "", city: "", zipCode: "" },
      });

      onClose();
    } catch {
      alert("❌ Booking failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-lg p-5"
      >
        {/* header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-bold">Book Service</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* stepper */}
        <div className="flex items-center mb-5">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i < stepIndex
                    ? "bg-green-500 text-white"
                    : i === stepIndex
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < stepIndex ? <Check size={14} /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* ---------------- step content ---------------- */}
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === "service" && (
            <motion.div className="space-y-3">
              <div className="p-3 rounded-lg border bg-blue-50 text-sm">
                Visiting Cost: <b>₹{provider.visitingCost}</b>
              </div>
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Describe your issue"
                className="w-full border rounded-lg p-2 h-28"
              />
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === "datetime" && (
            <motion.div className="space-y-4">
              <label className="text-sm font-medium flex gap-1 items-center">
                <Calendar size={14} /> Date
              </label>
              <input
                type="date"
                min={today}
                className="w-full border rounded p-2"
                value={booking.date}
                onChange={(e) =>
                  setBooking({ ...booking, date: e.target.value })
                }
              />

              <label className="text-sm font-medium flex gap-1 items-center">
                <Clock size={14} /> Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((t) => (
                  <button
                    key={t.id}
                    disabled={!t.available}
                    onClick={() =>
                      setBooking({ ...booking, timeSlot: t })
                    }
                    className={`p-2 rounded border text-sm ${
                      booking.timeSlot?.id === t.id
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {t.time}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3 – ADDRESS (FIXED) */}
          {step === "address" && (
            <motion.div className="space-y-2">
              <input
                placeholder="Street *"
                className="w-full border rounded p-2"
                value={booking.address.street}
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    address: {
                      ...booking.address,
                      street: e.target.value,
                    },
                  })
                }
              />

              <input
                placeholder="Apartment"
                className="w-full border rounded p-2"
                value={booking.address.apartment}
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    address: {
                      ...booking.address,
                      apartment: e.target.value,
                    },
                  })
                }
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="City *"
                  className="border rounded p-2"
                  value={booking.address.city}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      address: {
                        ...booking.address,
                        city: e.target.value,
                      },
                    })
                  }
                />
                <input
                  placeholder="ZIP *"
                  className="border rounded p-2"
                  value={booking.address.zipCode}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      address: {
                        ...booking.address,
                        zipCode: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </motion.div>
          )}

          {/* STEP 4 – SUMMARY (FIXED) */}
          {step === "summary" && (
            <motion.div className="space-y-3">
              <h3 className="font-semibold">Booking Summary</h3>

              <div className="p-3 border rounded space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Issue</span>
                  <span className="text-right">{issue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span>{booking.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time</span>
                  <span>{booking.timeSlot?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Address</span>
                  <span className="text-right">
                    {booking.address.street}
                    {booking.address.apartment && `, ${booking.address.apartment}`}
                    <br />
                    {booking.address.city} - {booking.address.zipCode}
                  </span>
                </div>
              </div>

              <div className="p-3 border rounded bg-blue-50 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold">
                  ₹{provider.visitingCost}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* footer */}
        <div className="flex gap-2 mt-5">
          {step !== "service" && (
            <button
              onClick={back}
              className="flex-1 border rounded py-2"
            >
              <ChevronLeft className="inline w-4" /> Back
            </button>
          )}

          {step === "summary" ? (
            <button
              onClick={confirmBooking}
              className="flex-1 bg-blue-600 text-white rounded py-2"
            >
              Confirm
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!canProceed()}
              className="flex-1 bg-blue-100 rounded py-2 disabled:opacity-50"
            >
              Continue <ChevronRight className="inline w-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

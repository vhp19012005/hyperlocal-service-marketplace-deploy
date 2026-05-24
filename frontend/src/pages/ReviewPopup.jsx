import { useState } from "react";
import { Star, X, Send } from "lucide-react";
import axios from "axios";

const ReviewPopup = ({ booking, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (!rating) return;

    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/review`,
        {
          providerId: booking.provider._id,
          rating,
          comment,
        },
        { withCredentials: true }
      );

      onClose();
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-8 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20}/>
        </button>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-gray-800">
          How was your service?
        </h2>

        <p className="text-center text-gray-500 text-sm mt-1 mb-6">
          Your feedback helps us improve.
        </p>

        {/* Service Info */}
        <div className="bg-gray-50 border rounded-lg p-3 mb-6 text-sm">
          <p><strong>Service:</strong> {booking.provider.serviceName}</p>
          <p>
            <strong>Provider:</strong> {booking.provider.firstName} {booking.provider.lastName}
          </p>
          <p><strong>Date:</strong> {booking.serviceDate}</p>
        </div>

        {/* Rating */}
        <div className="flex justify-center gap-2 mb-6">
          {[1,2,3,4,5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <Star
                size={32}
                className={
                  star <= (hover || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
        </div>

        {/* Comment */}
        <textarea
          rows="3"
          placeholder="Tell us more about your experience..."
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Button */}
        <button
          onClick={submitReview}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
        >
          {loading ? "Submitting..." : <>
            Submit Feedback <Send size={16}/>
          </>}
        </button>

      </div>
    </div>
  );
};

export default ReviewPopup;
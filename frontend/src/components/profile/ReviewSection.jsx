import { useEffect, useState } from "react";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import axios from "axios";

/*  Static fallback reviews */
// const staticReviews = [
//   {
//     id: 1,
//     serviceName: "Home Cleaning",
//     providerName: "CleanPro Services",
//     rating: 5,
//     comment: "Excellent service!",
//     date: "Dec 18, 2024",
//     helpful: 12,
//   },
// ];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star} 
        size={16}
        className={
          star <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }
      />
    ))}
  </div>
);

const ReviewCard = ({ review }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    
    <div className="flex justify-between mb-3">
      <div>
        <h4 className="font-semibold">{review.provider.firstName} {review.provider.lastName}</h4>
        <p className="text-sm text-gray-500">{review.provider.serviceName}</p>
      </div>
      <StarRating rating={review.rating} />
    </div>

    <p className="text-sm mb-2">"{review.comment}"</p>

    <div className="flex justify-between text-sm text-gray-500">
      <span>{review.date}</span>
      <span className="flex items-center gap-1">
        <ThumbsUp size={14} /> {review.helpful}
      </span>
    </div>
  </div>
);


const ReviewSection = ({reviews, setReviews}) => {
  // const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/review/user/me`,
          { withCredentials: true }
        );

        if (Array.isArray(res.data)) {
          setReviews(res.data);
        }
      } catch {
        console.log("Using static reviews");
      }
    };
    fetchReviews();
  }, []);

  

  const avg =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-semibold flex gap-2">
          <MessageSquare /> My Reviews ({reviews.length})
        </h3>
        <span className="flex gap-1">
          <Star className="fill-yellow-400 text-yellow-400" /> {avg}
        </span>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <ReviewCard key={r._id} review={r} />
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;

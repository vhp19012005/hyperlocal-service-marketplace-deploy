import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";
import { tempReviewsData } from "../../data/tempReviewData";

/* --------------------
   Rating Bar
-------------------- */
const RatingBar = ({ stars, percentage }) => {
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm">
      <span className="w-3 text-slate-500">{stars}</span>
      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-10 text-right text-slate-500">
        {percentage}%
      </span>
    </div>
  );
};

/* --------------------
   Review Card
-------------------- */
const ReviewCard = ({ review }) => {
  const fullName = review.user
    ? `${review.user.firstName} ${review.user.lastName}`
    : "Anonymous";

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
          {initials}
        </div>

        <div className="flex-1">
          <span className="font-semibold text-slate-800">
            {fullName}
          </span>

          <div className="flex items-center gap-2 my-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-slate-600 mb-1">
            {review.comment}
          </p>

          <p className="text-xs text-slate-400">
            {new Date(review.createdAt).toDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};


const calculateRatingDistribution = (reviews) => {
  const total = reviews.length;

  const counts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach((review) => {
    counts[review.rating]++;
  });

  return [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    percentage:
      total === 0
        ? 0
        : Math.round((counts[star] / total) * 100),
  }));
};


/* --------------------
   Main Component
-------------------- */
const ReviewsSection = () => {
  const { providerId } = useParams();

  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(
    tempReviewsData.totalReviews || 0
  );
  const [reviews, setReviews] = useState(
    tempReviewsData.reviews || []
  );
const [ratingDistribution, setRatingDistribution] = useState([]);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/review/provider/${providerId}`
        );

        setRating(res.data.averageRating);
        setTotalReviews(res.data.totalReviews);
        setReviews(res.data.reviews);
      } catch (error) {
        console.log(
          "Backend not available, using static reviews"
        );
      }
    };

    if (providerId) fetchReviews();
  }, [providerId]);

  useEffect(() => {
    if (reviews.length > 0) {
      const distribution = calculateRatingDistribution(reviews);
      setRatingDistribution(distribution);
    }
  }, [reviews]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800">
          Reviews
        </h2>
      </div>

      {/* Rating Summary */}
      <div className="bg-white p-4 rounded-xl shadow border">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="text-center sm:text-left">
            <div className="text-4xl font-bold">
              {rating.toFixed(1)}
            </div>

            <div className="flex justify-center sm:justify-start my-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-slate-500">
              {totalReviews} reviews
            </p>
          </div>

          <div className="flex-1 space-y-2">
            {ratingDistribution.map((item) => (
              <RatingBar
                key={item.stars}
                stars={item.stars}
                percentage={item.percentage}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-500">
            No reviews yet
          </p>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review._id||index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
};

export default ReviewsSection;

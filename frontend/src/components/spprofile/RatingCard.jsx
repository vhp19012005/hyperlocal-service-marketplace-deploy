import { Star } from "lucide-react";

const RatingCard = ({ rating, renderStars }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-medium text-gray-900">{rating.user.firstName} {rating.user.lastName}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              {renderStars(rating.rating)}
            </div>
            <span className="text-sm text-gray-500">{rating.createdAt.split("T")[0]}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 text-sm">{rating.comment}</p>
    </div>
  );
}

export default RatingCard;

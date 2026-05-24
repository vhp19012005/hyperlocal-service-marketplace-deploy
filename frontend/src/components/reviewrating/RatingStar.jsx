import React from "react";

const RatingStar = ({ rating, setRating, max = 5 }) => {
  return (
    <div style={{ display: "flex", gap: "4px", cursor: "pointer" }}>
      {[...Array(max)].map((_, idx) => (
        <span
          key={idx}
          onClick={() => setRating(idx + 1)}
          style={{
            color: idx < rating ? "#FFD700" : "#ccc",
            fontSize: "2rem",
            transition: "color 0.2s",
          }}
          data-testid={`star-${idx + 1}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStar;
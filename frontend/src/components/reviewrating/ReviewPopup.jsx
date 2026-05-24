import React, { useState } from "react";
import RatingStar from "./RatingStar";

const ReviewPopup = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  // if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, review });
    setRating(0);
    setReview("");
    onClose();
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    popup: {
      background: "#fff",
      padding: "2rem",
      borderRadius: "8px",
      minWidth: "320px",
      position: "relative",
      boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
    },
    closeBtn: {
      position: "absolute",
      top: "8px",
      right: "12px",
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
    },
    textarea: {
      width: "100%",
      padding: "0.5rem",
      borderRadius: "4px",
      border: "1px solid #ccc",
      marginBottom: "1rem",
      resize: "vertical",
    },
    submitBtn: {
      background: "#007bff",
      color: "#fff",
      border: "none",
      padding: "0.5rem 1.5rem",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "1rem",
    },
  };
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <button style={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <h2>Leave a Review</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ margin: "1rem 0" }}>
            <RatingStar rating={rating} setRating={setRating} />
          </div>
          <textarea
            style={styles.textarea}
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            required
          />
          <button type="submit" style={styles.submitBtn}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};


export default ReviewPopup;
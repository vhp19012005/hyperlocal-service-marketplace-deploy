import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import HeroSection from "../components/landing/HeroSection";
import CategoriesSection from "../components/landing/CategoriesSection";
import SlidesSection from "../components/landing/SlidesSection"; 
import HowItWorksSection from "../components/landing/HowItWorksSection";
import StatsSection from "../components/landing/StatsSection";
import FAQSection from "../components/landing/FAQSection";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import ReviewPopup from "./ReviewPopup";
import { useEffect, useState } from "react";
import axios from "axios";
const LandingPage = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate("/map", { state: { query } });
  };

  const handleCategorySelect = (category) => {
    navigate("/map", { state: { query:category } });
  };
const [showPopup, setShowPopup] = useState(false);
const [booking, setBooking] = useState(null);

useEffect(() => {

  const checkPendingReview = async () => {
    try {

      const res = await axios.get(
        "{}/api/booking/",
        { withCredentials: true }
      );

      const pending = res.data
        .filter((b) => b.status === "completed" && !b.reviewGiven)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      if (pending) {
        setBooking(pending);
        setShowPopup(!pending.reviewGiven);
      }

    } catch (err) {
      console.log(err);
    }
  };

  checkPendingReview();

}, []);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
{showPopup && booking && (
  <ReviewPopup
    booking={booking}
    onClose={() => setShowPopup(false)}
  />
)}
      {/* HEADER */}
      <Header/>
      {/* HERO */}
      <HeroSection onSearch={handleSearch} />

      {/* CATEGORIES */}
      <CategoriesSection onCategorySelect={handleCategorySelect} />

      {/* SLIDES */}
      <SlidesSection /> 

      {/* HOWITWORKS */}
      <HowItWorksSection/>

      {/* STATSSECTION */}
      <StatsSection/>

      {/* FAQ */}

      <FAQSection/>
      {/* FOOTER */}
      <Footer/>
    </div>
  );
};

export default LandingPage;




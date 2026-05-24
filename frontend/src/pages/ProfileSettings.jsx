import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Camera,
  MapPin,
  Phone,
  Mail,
  Star,
  Briefcase,
  Check,
  X,
  Edit2,
  Clock
} from "lucide-react";
import ProfileHeader from "../components/spprofile/ProfileHeader";
import ProfileSummary from "../components/spprofile/ProfileSummary";
import NavigationMenu from "../components/spprofile/NavigationMenu";
import PersonalDetails from "../components/spprofile/PersonalDetails";
import ProfessionalInfo from "../components/spprofile/ProfessionalInfo";
import BusinessInfo from "../components/spprofile/BusinessInfo";
import AvailabilityStatus from "../components/spprofile/AvailabilityStatus";
import WorkingHours from "../components/spprofile/WorkingHours";
import AvailableDays from "../components/spprofile/AvailableDays";
import OverallRating from "../components/spprofile/OverallRating";
import RatingCard from "../components/spprofile/RatingCard";
import { ServiceProviderDataContext } from "../context/ServiceProviderContext";
import { useContext } from "react";
const ProfileSettings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@email.com",
    address: "123, Sector 15, Noida, Uttar Pradesh 201301",
    city: "Noida",
    zipcode: "201301",
    serviceArea: "Noida, Greater Noida, Ghaziabad",
    experience: "5 years",
    visitingCost: "₹150-200",
    businessName: "Rajesh Repair Services",
    businessType: "Individual",
    gstNumber: "09AAAPL1234C1ZV",
    profilePhoto: null,
    profileImageFilename: null,
    description: "Professional AC repair and plumbing services with 5+ years of experience. Certified technician with excellent customer ratings."
  });
  const { provider } = useContext(ServiceProviderDataContext);
  
  const [ratings,setRatings] = useState([]);

  const averageRating = 4.8;
  const totalJobs = 127;

  useEffect(() => {
    // Fetch provider profile data from backend on component mount
    const fetchProfileData = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/review/provider/${provider._id}`, { withCredentials: true });
        setRatings(res.data.reviews);
        console.log("Fetched profile data:", ratings);
    };
    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/provider/me`, { withCredentials: true });
        const p = res.data;
        setProfileData(prev => ({
          ...prev,
          name: `${p.firstName || ''} ${p.lastName || ''}`.trim() || prev.name,
          phone: p.phone || prev.phone,
          email: p.email || prev.email,
          address: p.address || prev.address,
          city: p.city || prev.city,
          pincode: p.pincode || prev.pincode,
          serviceArea: p.serviceArea || prev.serviceArea,
          experience: p.experience || prev.experience,
          visitingCost: p.visitingCost || prev.visitingCost,
          businessName: p.businessName || prev.businessName,
          businessType: p.businessType || prev.businessType,
          gstNumber: p.gstNumber || prev.gstNumber,
          description: p.description || prev.description,
          profileImageFilename: p.profileImage || null
        }));
        setIsAvailable(p.isAvailable ?? true);
      } catch (e) {
        console.error('Failed to fetch provider profile', e);
      }
    };
    fetchProvider();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const payload = {
        // Map fields appropriately
        firstName: profileData.name.split(' ')[0] || '',
        lastName: profileData.name.split(' ').slice(1).join(' ') || '',
        pincode: profileData.pincode,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        zipcode: profileData.zipcode,
        serviceArea: profileData.serviceArea,
        experience: profileData.experience,
        visitingCost: profileData.visitingCost,
        businessName: profileData.businessName,
        businessType: profileData.businessType,
        gstNumber: profileData.gstNumber,
        description: profileData.description,
      };
      const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/provider/me`, payload, { withCredentials: true });
      const p = res.data;
      setProfileData(prev => ({
        ...prev,
        name: `${p.firstName || ''} ${p.lastName || ''}`.trim() || prev.name,
        phone: p.phone || prev.phone,
        email: p.email || prev.email,
        address: p.address || prev.address,
        city: p.city || prev.city,
        zipcode: p.zipcode || prev.zipcode,
        serviceArea: p.serviceArea || prev.serviceArea,
        experience: p.experience || prev.experience,
        visitingCost: p.visitingCost || prev.visitingCost,
        businessName: p.businessName || prev.businessName,
        businessType: p.businessType || prev.businessType,
        gstNumber: p.gstNumber || prev.gstNumber,
        description: p.description || prev.description,
      }));
      setIsEditing(false);
    } catch (e) {
      console.error('Failed to update profile', e);
      alert('Failed to update profile');
    }
  };

  const handleProfileDataChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      handleSaveProfile();
    } else {
      setIsEditing(true);
    }
  };

  const handleProfilePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append('profileImage', file);
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/provider/upload-profile`,
          formData,
          { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
        );
        // Save local file for preview and server filename to display via /uploads later
        setProfileData(prev => ({
          ...prev,
          profilePhoto: file,
          profileImageFilename: res.data.profileImage
        }));
         window.location.reload(); // simple & safe
      } catch (err) {
        console.error('Profile photo upload failed:', err);
        alert('Failed to upload profile photo. Please try again.');
      }
    };
    // Append to DOM and trigger click
    document.body.appendChild(input);
    input.click();
    // Clean up after a short delay to ensure file dialog opens
    setTimeout(() => document.body.removeChild(input), 100);
  };

  const handleToggleAvailability = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/provider/availability`, { }, { withCredentials: true });
      setIsAvailable(res.data.isAvailable);
    } catch (e) {
      console.error('Failed to toggle availability', e);
      alert('Failed to update availability');
    }
  };

  const menuItems = [
    { key: "profile", label: "Profile", icon: User },
    { key: "availability", label: "Availability", icon: Clock },
    { key: "ratings", label: "Ratings & Reviews", icon: Star }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ProfileHeader navigate={navigate} />

      {/* Profile Summary */}
      <div className="px-4 sm:px-6 lg:px-8 mt-6 max-w-6xl mx-auto">
        <ProfileSummary 
          profileData={profileData}
          averageRating={averageRating}
          totalJobs={totalJobs}
          onPhotoUpload={handleProfilePhotoUpload}
          renderStars={renderStars}
        />
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
        {/* Navigation Menu */}
        <NavigationMenu 
          menuItems={menuItems}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Profile Section */}
        {activeSection === "profile" && (
          <div className="space-y-6">
            <PersonalDetails 
              profileData={profileData}
              isEditing={isEditing}
              onProfileDataChange={handleProfileDataChange}
              onToggleEdit={handleToggleEdit}
            />

            <ProfessionalInfo 
              profileData={profileData}
              isEditing={isEditing}
              onProfileDataChange={handleProfileDataChange}
              onToggleEdit={handleToggleEdit}
            />

            <BusinessInfo 
              profileData={profileData}
              isEditing={isEditing}
              onProfileDataChange={handleProfileDataChange}
              onToggleEdit={handleToggleEdit}
            />
          </div>
        )}

        {/* Availability Section */}
        {activeSection === "availability" && (
          <div className="space-y-6">
            <AvailabilityStatus 
              isAvailable={isAvailable}
              onToggle={handleToggleAvailability}
            />

            <WorkingHours 
              isEditing={isEditing}
              onToggleEdit={handleToggleEdit}
            />

            <AvailableDays isEditing={isEditing} />
          </div>
        )}

        {/* Ratings Section */}
        {activeSection === "ratings" && (
          <div className="space-y-4">
            <OverallRating 
              averageRating={averageRating}
              totalJobs={totalJobs}
              renderStars={renderStars}
            />

            <div className="space-y-3">
              {ratings.map((rating) => (
                <RatingCard 
                  key={rating._id}
                  rating={rating}
                  renderStars={renderStars}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProfileSettings;

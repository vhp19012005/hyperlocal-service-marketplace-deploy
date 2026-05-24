import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobDetailsHeader from "../components/spjobdetailsscreen/JobDetailsHeader";
import CustomerDetails from "../components/spjobdetailsscreen/CustomerDetails";
import ServiceInformation from "../components/spjobdetailsscreen/ServiceInformation";
import LocationMap from "../components/spjobdetailsscreen/LocationMap";
import SchedulePricing from "../components/spjobdetailsscreen/SchedulePricing";
import ActionButtons from "../components/spjobdetailsscreen/ActionButtons";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const JobDetailsScreen = () => {
  const navigate = useNavigate();
  const [jobStarted, setJobStarted] = useState(false);
  const { jobId } = useParams(); // Get job ID from URL params
  const requestId = jobId
  const [job, setJob] = useState({
    id: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    serviceType: "",
    description: "",
    address: "",
    scheduledTime: "",
    estimatedPrice: "",
    rating: 0,
    totalJobs: 0,
    urgency: "",
    specialInstructions: "",
    paymentMethod: "",
    status: "",
    lat: 0,
    long: 0,
  });
  
console.log("Job ID from URL:", jobId);
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/servicerequests/job/${jobId}`, { withCredentials: true });
        console.log("Fetched job details:", response.data);
        setJob(response.data.job);
      } catch (error) {
               console.error("Error fetching job details:", error);
           }
       };

       fetchJobDetails();
   }, []);

   const customerdetails = {
     name: job.customerName,
     address: job.address,
     startTime: job.scheduledTime,
     serviceType: job.serviceType,  
     basePrice: job.estimatedPrice,
     email: job.customerEmail,
   };

  const handleStartJob = () => {
    setJobStarted(true);
    navigate(`/ongoing-job/${job.id}`,{
      state: { customerdetails }
    });
  };

  const handleCancelJob = async() => {
    // Navigate to service requests with rejected tab active
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/booking/${requestId}/reject`, {}, { withCredentials: true });
    navigate('/service-requests', { 
      state: { 
        cancelledJobId: job.id,
        activeTab: 'rejected'
      } 
    });
  };

  const handleCallCustomer = () => {
    window.open(`tel:${job.customerPhone}`);
  };

  const handleChatCustomer = () => {
    // Chat functionality removed
    console.log("Chat feature is currently disabled");
  };

  const handleGetDirections = () => {
    // Open Google Maps or navigation app
    // const encodedAddress = encodeURIComponent(job.address);
    // window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
    console.log(`Opening directions for coordinates: ${job.lat}, ${job.long}`);
    window.open(`https://maps.google.com/?q=${job.lat},${job.long}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <JobDetailsHeader job={job} />

      <div className="px-4 sm:px-6 lg:px-8 mt-8 py-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left and Center Content - spans 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <CustomerDetails job={job} onCallCustomer={handleCallCustomer} />

            {/* Service Information */}
            <ServiceInformation job={job} />

            {/* Address with Map Preview */}
            <LocationMap job={job} onGetDirections={handleGetDirections} />
          </div>

          {/* Right Sidebar - 1 column on large screens */}
          <div className="space-y-6">
            {/* Schedule & Pricing */}
            <SchedulePricing job={job} />

            {/* Action Buttons */}
            <ActionButtons 
              onStartJob={handleStartJob}
              onCancelJob={handleCancelJob}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetailsScreen;

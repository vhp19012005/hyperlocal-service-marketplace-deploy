import { useState, useEffect } from "react";
import { useNavigate, useLocation,useParams } from "react-router-dom";
import { CheckCircle, Navigation, Briefcase } from "lucide-react";
import OngoingJobHeader from "../components/spongoingjob/OngoingJobHeader";
import StatusTracker from "../components/spongoingjob/StatusTracker";
import JobInfo from "../components/spongoingjob/JobInfo";
import ExtraCharges from "../components/spongoingjob/ExtraCharges";
import PhotoUpload from "../components/spongoingjob/PhotoUpload";
import PriceSummary from "../components/spongoingjob/PriceSummary";
import CompleteJobButton from "../components/spongoingjob/CompleteJobButton";
import OtpModal from "../components/spongoingjob/OtpModal";
import ExtraChargesModal from "../components/spongoingjob/ExtraChargesModal";
import axios from "axios";

export default function OngoingJobScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams();
  const [currentStatus, setCurrentStatus] = useState("accepted");
  const {customerdetails} = location.state || {};
  const [extraCharges, setExtraCharges] = useState();
  const [extraChargesReason, setExtraChargesReason] = useState("");
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [showExtraChargesModal, setShowExtraChargesModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [customerEmail, setCustomerEmail] = useState(customerdetails.email); // In real app, this would come from API
  const [uploadedServicePhotoFilename, setUploadedServicePhotoFilename] = useState(null);
  const [verifiedOtp,setVerifiedOtp] = useState(false)
  // Get job ID from URL or navigation state
  console.log("Job ID from URL:", customerdetails);

  // Dummy job data - in real app, this would come from API
  const allJobs = {
    "1": {
      id: "1",
      customerName: "Amit Sharma",
      customerPhone: "+91 98765 43210",
      serviceType: "AC Repair",
      address: "123, Sector 15, Noida, Uttar Pradesh 201301",
      startTime: "2:00 PM",
      estimatedPrice: "₹800-1200",
      basePrice: 800
    },
    "3": {
      id: "3",
      customerName: "Rahul Verma",
      customerPhone: "+91 98765 54321",
      serviceType: "Electrician",
      address: "789, Phase 2, Delhi",
      startTime: "2:00 PM",
      estimatedPrice: "₹600-1000",
      basePrice: 600
    }
  };

  const job = allJobs[jobId] || allJobs["1"];

  const statusSteps = [
    { key: "accepted", label: "Accepted", icon: CheckCircle, completed: true },
    { key: "onway", label: "On the Way", icon: Navigation, completed: false },
    { key: "inprogress", label: "In Progress", icon: Briefcase, completed: false },
    { key: "completed", label: "Completed", icon: CheckCircle, completed: false }
  ];

  const updateStatus = (newStatus) => {
    if (newStatus === 'onway' && currentStatus === 'accepted') {
      // Direct update to onway - no OTP required
      setCurrentStatus('onway');
    } else if (newStatus === 'inprogress' && currentStatus === 'onway') {
      // Generate OTP and send to customer email for inprogress
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      sendOtpToEmail(customerEmail, otp);
      setShowOtpModal(true);
      setOtpSent(true);
    } else {
      setCurrentStatus(newStatus);
    }
  };

  const sendOtpToEmail = async (email, otp) => {
    // Simulate sending OTP email (in real app, this would be an API call)
    alert(`OTP has been sent to ${email}`);
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/servicerequests/otp/${jobId}`, {  }, { withCredentials: true });
  };

  const verifyOtpAndProceed = async () => {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/servicerequests/verifyotp`, { otp: enteredOtp, jobId }, { withCredentials: true });
    if (res.data.success) {
      // OTP verified successfully
      setCurrentStatus('inprogress');
      setShowOtpModal(false);
      setVerifiedOtp(true)
      setEnteredOtp('');
    } else {
      alert(res.data.message);
    }
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setAfterPhoto(file);
      try {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('bookingId', jobId);
        const res = await axios.post(
          `${proce.env.VITE_BACKEND_URL}/api/servicephoto/upload-service-photo`,
          formData,
          { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setUploadedServicePhotoFilename(res.data.photoUrl);
      } catch (err) {
        console.error('Service photo upload failed:', err);
        alert('Failed to upload service photo. Please try again.');
      }
    };
    input.click();
  };

  const handleCompleteJob = () => {
    if (!afterPhoto) {
      alert("Please upload the service completion photo first");
      return;
    }
    
    // Update status to completed first
    setCurrentStatus('completed');
    
    
    
    // Navigate to completion screen or dashboard
    navigate("/service-requests");
  };

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === currentStatus);
  };

const totalPrice =
  Number(customerdetails?.basePrice || job.basePrice) + Number(extraCharges||0);

const totalPriceString = totalPrice.toString();

console.log("Total Price:", customerdetails?.basePrice, extraCharges, totalPrice);

  // Handler to send extra charge to backend
  const submitExtraCharge = async () => {
    if (!jobId) {
      alert('Booking id missing');
      return;
    }
    if (!extraCharges || Number(extraCharges) <= 0) {
      alert('Please enter a valid extra charge amount');
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/extracharge`,
        { bookingId: jobId, amount: Number(extraCharges), reason: extraChargesReason },
        { withCredentials: true }
      );
      alert('Extra charge submitted');
      setShowExtraChargesModal(false);
      // optionally clear reason or keep
      setExtraChargesReason('');
    } catch (err) {
      console.error('Failed to submit extra charge', err);
      alert('Failed to submit extra charge');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <OngoingJobHeader />

      <div className="px-4 sm:px-6 lg:px-8 mt-8 py-6 max-w-6xl mx-auto space-y-6">
        {/* Status Tracker */}
        <StatusTracker 
          currentStatus={currentStatus}
          statusSteps={statusSteps}
          updateStatus={updateStatus}
          getCurrentStepIndex={getCurrentStepIndex}
          otpSent={otpSent}
          setShowOtpModal={setShowOtpModal}
          handleCompleteJob={handleCompleteJob}
          afterPhoto={afterPhoto}
        />

        {/* Job Info */}
        <JobInfo  customerdetails={customerdetails} />

        {/* Extra Charges */}
        <ExtraCharges 
          extraCharges={extraCharges}
          extraChargesReason={extraChargesReason}
          onAddCharges={() => setShowExtraChargesModal(true)}
        />

        {/* Photo Upload */}
        <PhotoUpload 
         verifiedOtp={verifiedOtp}
          afterPhoto={afterPhoto}
          onPhotoUpload={handlePhotoUpload}
          onRemovePhoto={() => setAfterPhoto(null)}
        />

        {/* Price Summary */}
        <PriceSummary 
          job={customerdetails}
          extraCharges={extraCharges}
          totalPrice={totalPriceString}
        />
        {/* Complete Job Button */}
        <CompleteJobButton 
          currentStatus={currentStatus}
          afterPhoto={afterPhoto}
          onCompleteJob={handleCompleteJob}
          jobId={jobId}
        />
      </div>

      {/* OTP Modal */}
      <OtpModal 
        showOtpModal={showOtpModal}
        customerEmail={customerEmail}
        enteredOtp={enteredOtp}
        onOtpChange={(value) => setEnteredOtp(value)}
        onCancel={() => {
          setShowOtpModal(false);
          setEnteredOtp('');
        }}
        onVerifyOtp={verifyOtpAndProceed}
      />

      {/* Extra Charges Modal */}
      <ExtraChargesModal 
        showExtraChargesModal={showExtraChargesModal}
        extraCharges={extraCharges}
        extraChargesReason={extraChargesReason}
        onAmountChange={(value) => setExtraCharges(value)}
        onReasonChange={(value) => setExtraChargesReason(value)}
        onCancel={() => setShowExtraChargesModal(false)}
        onAddCharges={submitExtraCharge}
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ServiceRequestsHeader from "../components/spservicerequestlist/ServiceRequestsHeader";
import ServiceRequestsListComponent from "../components/spservicerequestlist/ServiceRequestsList";
import ServiceDetailsModal from "../components/spservicerequestlist/ServiceDetailsModal";
import axios from "axios";
const ServiceRequestsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState(() => {
    // Get saved tab from localStorage or default to "new"
    return localStorage.getItem('activeServiceTab') || "new";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [serviceRequests, setServiceRequests] = useState([]);

useEffect(() => {
  const fetchServiceRequests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/servicerequests`,
        { withCredentials: true }
      );

      console.log("API Response:", response.data.bookings);

      if (response.data && Array.isArray(response.data.bookings)) {
        setServiceRequests(response.data.bookings);
      } else {
        setServiceRequests([]);  // fallback
      }

    } catch (error) {
      console.error("Error fetching service requests:", error);
      setServiceRequests([]); // prevent crash
    }
  };

  fetchServiceRequests();
}, []);
``
  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeServiceTab', activeFilter);
  }, [activeFilter]);

  // Handle cancelled job from JobDetailsScreen
  useEffect(() => {
    if (location.state?.cancelledJobId && location.state?.activeTab === 'rejected') {
      // Update the job status to rejected
      setServiceRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === location.state.cancelledJobId 
            ? { ...request, status: "rejected" }
            : request
        )
      );
      // Switch to rejected tab
      setActiveFilter("rejected");
    }
  }, [location.state]);

  // Handle completed job from OngoingJobScreen
  useEffect(() => {
    if (location.state?.completedJobId) {
      // Update the job status to completed
      setServiceRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === location.state.completedJobId 
            ? { ...request, status: "completed" }
            : request
        )
      );
      // Switch to completed tab
      setActiveFilter("completed");
    }
  }, [location.state]);

  
 
  const filters = [
    { value: "pending", label: "Pending", count: serviceRequests.filter(r => r.status === "pending").length },
    { value: "accepted", label: "Accepted", count: serviceRequests.filter(r => r.status === "accepted").length },
    { value: "completed", label: "Completed", count: serviceRequests.filter(r => r.status === "completed").length },
    { value: "rejected", label: "Rejected", count: serviceRequests.filter(r => r.status === "rejected").length }
  ];

  const filteredRequests = serviceRequests.filter(request => {
    const matchesFilter = request.status === activeFilter;
    const matchesSearch = request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCallCustomer = (customerName) => {
    // Create a tel link to open the phone dialer
    const phoneNumber = '+919876543210'; // You can replace with actual customer phone number
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  const handleStartJob = (requestId) => {
    setServiceRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: "completed" }
          : request
      )
    );
    // Switch to completed tab to show the moved request
    setActiveFilter("completed");
    // Navigate to JobDetailsScreen
    navigate(`/job-details/${requestId}`);
  };

  const handleCompleteJob = (requestId) => {
    setServiceRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: "completed" }
          : request
      )
    );
    // Switch to completed tab to show the moved request
    setActiveFilter("completed");
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.post(`http://localhost:3000/api/booking/${requestId}/accept`, {}, { withCredentials: true });
      setServiceRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status: "accepted" }
            : request
        )
      );
      setActiveFilter("accepted");
    } catch (err) {
      console.error("Failed to accept booking:", err);
      alert("Failed to accept booking. Please try again.");
    }
  };

  const handleReject = async (requestId) => {
    
      await axios.post(`http://localhost:3000/api/booking/${requestId}/reject`, {}, { withCredentials: true });
      setServiceRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status: "rejected" }
            : request
        )
      );
      setActiveFilter("rejected");
   
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ServiceRequestsHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* Requests List */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
        <ServiceRequestsListComponent
          filteredRequests={filteredRequests}
          activeFilter={activeFilter}
          getStatusColor={getStatusColor}
          onAccept={handleAccept}
          onReject={handleReject}
          onViewDetails={handleViewDetails}
          onStartJob={handleStartJob}
        />
      </div>

      {/* Details Modal */}
      <ServiceDetailsModal
        showDetailsModal={showDetailsModal}
        selectedRequest={selectedRequest}
        onCloseModal={handleCloseModal}
        onCallCustomer={handleCallCustomer}
        getStatusColor={getStatusColor}
      />
    </div>
  );
}

export default ServiceRequestsList;

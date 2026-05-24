import { CheckCircle } from "lucide-react";
import axios from 'axios';

export function CompleteJobButton({ currentStatus, afterPhoto, onCompleteJob, jobId }) {
  const handleClick = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/booking/${jobId}/complete`, {}, { withCredentials: true });
      onCompleteJob();
    } catch (err) {
      console.error('Failed to mark completed:', err);
      alert('Failed to mark job as completed.');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={currentStatus !== "inprogress" || !afterPhoto}
      className={`w-full py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
        currentStatus === "inprogress" && afterPhoto
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }`}
    >
      <CheckCircle className="w-5 h-5" />
      {afterPhoto ? 'Mark as Completed' : 'Upload Photo First'}
    </button>
  );
}

export default CompleteJobButton;

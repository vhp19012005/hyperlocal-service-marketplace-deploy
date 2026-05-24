import { Play, Square } from "lucide-react";

const ActionButtons = ({ onStartJob, onCancelJob }) => {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onStartJob}
        className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <Play className="w-4 h-4 sm:w-5 sm:h-5" />
        Start Job
      </button>
      <button
        onClick={onCancelJob}
        className="w-full bg-gray-100 text-gray-700 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <Square className="w-4 h-4 sm:w-5 sm:h-5" />
        Cancel Job
      </button>
    </div>
  );
}

export default ActionButtons;

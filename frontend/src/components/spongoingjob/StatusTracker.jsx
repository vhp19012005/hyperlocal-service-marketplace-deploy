import { CheckCircle, Navigation, Briefcase } from "lucide-react";
import axios from "axios";

export function StatusTracker({ 
  currentStatus, 
  statusSteps, 
  updateStatus, 
  getCurrentStepIndex, 
  otpSent, 
  setShowOtpModal,
  handleCompleteJob,
  afterPhoto 
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Job Status</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Current:</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {statusSteps.find(step => step.key === currentStatus)?.label}
          </span>
        </div>
      </div>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${((getCurrentStepIndex() + 1) / statusSteps.length) * 100}%` }}
          />
        </div>

        {/* Status Steps */}
        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.key === currentStatus;
            const isCompleted = index < getCurrentStepIndex();
            const originalCanUpdate = index === getCurrentStepIndex() + 1 || (index <= getCurrentStepIndex());
            const isOnWayStep = step.key === 'onway';
            const isInProgressStep = step.key === 'inprogress';
            
            // Determine final canUpdate value
            let finalCanUpdate = originalCanUpdate;
            
            // Disable onway button until previous step is completed
            if (isOnWayStep && currentStatus !== 'accepted') {
              finalCanUpdate = false;
            }
            
            // Disable inprogress button until onway is completed and OTP is verified
            if (isInProgressStep && currentStatus !== 'onway') {
              finalCanUpdate = false;
            }
            
            return (
              <button
                key={step.key}
                onClick={() => finalCanUpdate && updateStatus(step.key)}
                disabled={!finalCanUpdate}
                className={`flex flex-col items-center gap-2 transition-all ${
                  finalCanUpdate ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'
                }`}
                title={finalCanUpdate ? `Click to update to ${step.label}` : 'Complete previous steps first'}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCompleted 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : isActive 
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${
                  isActive ? 'text-blue-600 font-bold' : isCompleted ? 'text-blue-600 font-bold' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Status Update Buttons */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Quick Actions:</p>
        <div className="grid grid-cols-2 gap-2">
          {statusSteps.slice(1).map((step) => {
            const currentIndex = getCurrentStepIndex();
            const stepIndex = statusSteps.findIndex(s => s.key === step.key);
            const canUpdate = stepIndex === currentIndex + 1;
            const isCompletedStep = step.key === 'completed';
            const canComplete = isCompletedStep ? afterPhoto : canUpdate;
            const isOnWayStep = step.key === 'onway';
            const isInProgressStep = step.key === 'inprogress';
            
            // Special handling for onway and inprogress buttons
            let buttonDisabled = !canComplete;
            let buttonText = `Mark as ${step.label}`;
            
            if (isInProgressStep && currentStatus === 'onway') {
              buttonText = otpSent ? 'Enter OTP' : 'Send OTP';
              buttonDisabled = false;
            } else if (isInProgressStep && currentStatus !== 'onway') {
              buttonDisabled = true;
              buttonText = 'Complete "On the Way" first';
            }
            
            return (
              <button
                key={step.key}
                onClick={() => {
                  if (isInProgressStep && currentStatus === 'onway') {
                    if (otpSent) {
                      setShowOtpModal(true);
                    } else {
                      updateStatus('inprogress');
                    }
                  } else if (step.key === 'completed' && canComplete) {
                    handleCompleteJob();
                  } else if (canComplete) {
                    updateStatus(step.key);
                  }
                }}
                disabled={buttonDisabled}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  !buttonDisabled
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <step.icon className="w-4 h-4" />
                {buttonText}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StatusTracker;

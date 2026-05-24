export function OtpModal({ 
  showOtpModal, 
  customerEmail, 
  enteredOtp, 
  onOtpChange, 
  onCancel, 
  onVerifyOtp 
}) {
  if (!showOtpModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter OTP</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              A 6-digit OTP has been sent to {customerEmail}
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
            <input
              type="text"
              value={enteredOtp}
              onChange={(e) => onOtpChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onVerifyOtp}
            disabled={enteredOtp.length !== 6}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              enteredOtp.length === 6
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default OtpModal;

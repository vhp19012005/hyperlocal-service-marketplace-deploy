import { Camera, X } from "lucide-react";

export function PhotoUpload({ afterPhoto, onPhotoUpload, onRemovePhoto,verifiedOtp }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Photo</h2>
      
      {afterPhoto ? (
        <div className="relative">
          <img 
            src={URL.createObjectURL(afterPhoto)} 
            alt="After Service" 
            className="w-full h-64 object-cover rounded-xl"
          />
          <button
            onClick={onRemovePhoto}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
         disabled={!verifiedOtp}
          onClick={onPhotoUpload}
          className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-blue-400 transition"
        >
          <Camera className="w-12 h-12 text-gray-400 mb-3" />
          <span className="text-sm text-gray-500">Add Service Photo</span>
        </button>
      )}
    </div>
  );
}

export default PhotoUpload;

import { useEffect, useState } from "react";
import { Home, IndianRupee, Info } from "lucide-react";
import axios from "axios";

const ServicesList = ({provider}) => {
  const [visitingCost, setVisitingCost] = useState(99);
  useEffect(() => {
    if (provider && provider.visitingCost) {
      setVisitingCost(provider.visitingCost);
    }
  }, [provider]);
  
  return (
     <>
      {/* SERVICES TITLE */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">
        Services
      </h2>

      {/* SERVICE CARD */}
      <div className="bg-white border border-black rounded-xl p-5">
        <div className="flex justify-between gap-6">

          {/* LEFT */}  
          <div className="flex-1">
            {/* ICON + TITLE ROW */}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                House Visit / Inspection
              </h3>
            </div>

          
            <p className="text-sm text-gray-600 mb-1">
              The provider will visit your home to inspect the issue.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Final service cost depends on the problem and work required.
            </p>

            {/* INFO */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Info className="w-4 h-4" />
              <span>Service cost depends on your issue</span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">
              Visiting Cost
            </p>
            <div className="flex items-center justify-end gap-1 text-2xl font-semibold text-gray-900">
              <IndianRupee className="w-5 h-5" />
              {visitingCost}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ServicesList;
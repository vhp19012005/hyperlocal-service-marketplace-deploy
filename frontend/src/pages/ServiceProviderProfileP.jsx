

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import ServicesList from "../components/provider/ServicesList";
import ReviewsSection from "../components/provider/ReviewSection";
import ProviderDetails from "../components/provider/ProviderDetails";
import ServiceProviderHeader from "../components/provider/ProviderHeader";
import UserNavbar from "../components/profile/UserNavbar";

import { staticProvider } from "../data/StaticProvider";
import ServicePhotos from "../components/provider/ServicePhotos";

const ServiceProviderP = () => {
  const { providerId } = useParams();
  

  const [provider, setProvider] = useState({});

  useEffect(() => {
    const fetchProvider = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/getprovider/${providerId}`,{ withCredentials: true }
      );
      console.log("Fetched provider data:", res.data.provider.visitingCost);
      setProvider(res.data.provider);

    };

    fetchProvider();
  }, [providerId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <UserNavbar />
      <div className="h-2 bg-slate-100"></div>

      <ServiceProviderHeader provider={provider} />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ServicesList provider={provider} />
            <ServicePhotos providerId={providerId} />
            <ReviewsSection providerId={providerId} />
          </div>

          <div>
            <ProviderDetails provider={provider} />
          </div>  
        </div>
      </main>
    </div>
  );
};

export default ServiceProviderP;

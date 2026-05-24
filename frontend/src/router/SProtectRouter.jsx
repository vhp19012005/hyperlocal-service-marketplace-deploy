import { Navigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ServiceProviderDataContext } from "../context/ServiceProviderContext";

const SProtectRouter = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const { setProvider } = useContext(ServiceProviderDataContext);

  useEffect(() => {
    axios
      .get(`${process.env.VITE_BACKEND_URL}/api/home/sprovider/profile`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsAuth(true);
        // backend returns { serviceprovider: { firstName, lastName, ... } }
        const sp = res.data?.serviceprovider;
        if (sp) setProvider(sp);
      })
      .catch(() => setIsAuth(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Checking authentication...</p>;

  return isAuth ? children : <Navigate to="/service-provider-login" />;
};

export default SProtectRouter;

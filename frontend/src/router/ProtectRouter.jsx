import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const ProtectRouter = ({ children }) => {
  const { user } = useContext(UserDataContext);
  const location = useLocation();

  


  if (user.loading) {
    return <p>Checking authentication...</p>;
  }

  if (!user.isAuth) {
    return (
      <Navigate
        to="/user-login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default ProtectRouter;

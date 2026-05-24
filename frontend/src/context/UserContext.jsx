import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    isAuth: false,
    loading: true,
    profile: null,
    loggingOut: false
  });

 
useEffect(() => {
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/api/home/user/profile`, {
      withCredentials: true,
    })
    .then((res) => {
      setUser(prev => ({
        ...prev,
        isAuth: true,
        loading: false,
        profile: res.data.user,
      }));
    })
    .catch(() => {
      setUser(prev => ({
        ...prev,
        isAuth: false,
        loading: false,
        profile: null,
      }));
    });
}, []);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;

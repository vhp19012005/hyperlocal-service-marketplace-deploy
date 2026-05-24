import React, { useContext } from "react";
import { UserDataContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, LogIn, User } from "lucide-react";
import axios from "axios";

const IsLoginBtn = () => {
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    navigate("/", { replace: true });

    setUser({
      isAuth: false,
      loading: false,
      profile: null,
    });

    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
      {},                       // ✅ body
      { withCredentials: true } // ✅ config
    );
  } catch (error) {
    console.error("Logout failed", error);
  }
};

  return (
    <>
      {user.isAuth ? (
        <div className="flex items-center gap-4">
          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
            {user.profile?.profileImage ? (
              <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/users/${user.profile?.profileImage}`} alt={`${user.profile?.firstName} ${user.profile?.lastName}`} className="h-12 w-12 object-center rounded-full" />
            ) : (
              <span className="w-12 h-12 flex items-center justify-center bg-gray-300 rounded-full text-xs text-gray-600 ">
                <User className="w-5 h-5 text-black fill-black" />
              </span>
            )}
          </Link>
          <button onClick={handleLogout} className="px-3 py-2 text-red-600 hover:bg-gray-100 rounded-lg flex items-center gap-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      ) : (
        <Link
          to="/user-login"
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Login
        </Link>
      )}
    </>
  );
};

export default IsLoginBtn;

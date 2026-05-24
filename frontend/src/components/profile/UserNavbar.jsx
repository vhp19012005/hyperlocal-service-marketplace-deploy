import { useContext, useState } from "react";
import { Menu, X, MapPin, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../../context/UserContext";
import IsLoginBtn from "../landing/IsLoginBtn";

const ProfileNavbar = () => {
  const { user, setUser } = useContext(UserDataContext);
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* SAME WIDTH AS HEADER */}
      <div className="max-w-7xl mx-auto px-4">
        {/* SAME HEIGHT AS HEADER (h-16) */}
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <MapPin className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              LocalServe
            </span>
          </Link>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
              <IsLoginBtn/>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-4 mt-4">

              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-gray-700"
              >
                <User size={18} />
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-left text-red-600"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ProfileNavbar;

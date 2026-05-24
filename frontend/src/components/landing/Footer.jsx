import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    navigate("/map", { state: { category: service } });
  };

  return (
    <footer className="bg-gray-900 text-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div>
            <div
              className="flex items-center gap-2 mb-4 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">LocalServe</span>
            </div>

            <p className="text-gray-400 text-sm mb-5">
              Connecting you with trusted local service providers for all your needs.
            </p>

            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Services</li>
              <li className="hover:text-white cursor-pointer">Become a Provider</li>
              <li className="hover:text-white cursor-pointer">Help Center</li>
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="font-semibold mb-4">Popular Services</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li
                onClick={() => handleServiceClick("plumbing")}
                className="hover:text-white cursor-pointer"
              >
                Plumbing
              </li>
              <li
                onClick={() => handleServiceClick("electrical")}
                className="hover:text-white cursor-pointer"
              >
                Electrical
              </li>
              <li
                onClick={() => handleServiceClick("cleaning")}
                className="hover:text-white cursor-pointer"
              >
                House Cleaning
              </li>
              <li
                onClick={() => handleServiceClick("ac-repair")}
                className="hover:text-white cursor-pointer"
              >
                AC Repair
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                vp9328008166@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                1-800-LOCAL
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2025 LocalServe. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

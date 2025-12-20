import React, { useState, useEffect, useRef } from "react";
import { LuBrain } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { FiSettings, FiBook, FiCreditCard, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { USE_MOCK_API } from "../../api/mockApi";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({ username: "", email: "" });
  const dropdownRef = useRef(null);

  // Load user info from localStorage
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    };

    loadUser();

    // Listen for updates from AccountSettings
    window.addEventListener("storage", loadUser);

    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <nav className="w-full bg-neutral-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between fixed top-0 left-0 z-20">
      {/* LEFT — Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <LuBrain className="text-3xl bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg p-1" />
        <h1 className="text-xl font-bold text-white">Promptly AI</h1>
      </div>

      {/* CENTER — Username's Workspace */}
      <div className="hidden md:flex items-center gap-2 text-gray-300">
        <span className="font-medium">
          {user.username ? `${user.username}'s Workspace` : "Workspace"}
        </span>
        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
          Free
        </span>
      </div>

      {/* RIGHT — Profile Icon */}
      <div className="relative" ref={dropdownRef}>
        {user.profileImage ? (
          <img
            src={
              USE_MOCK_API
                ? user.profileImage
                : `http://localhost:3000${user.profileImage}`
            }
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer border border-gray-700"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
        ) : (
          <FaUserCircle
            className="text-3xl text-white cursor-pointer hover:text-gray-300 transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Profile Menu"
          />
        )}

        {/* DROPDOWN MENU */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-64 bg-neutral-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-30"
            >
              {/* User Info Section */}
              <div className="px-4 py-4 bg-gradient-to-r from-blue-600/10 to-violet-600/10 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  {user.profileImage ? (
                    <img
                      src={
                        USE_MOCK_API
                          ? user.profileImage
                          : `http://localhost:3000${user.profileImage}`
                      }
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center text-white text-lg font-bold">
                      {user.username
                        ? user.username.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">
                      {user.username || "User"}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {user.email || "email@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    navigate("/dashboard/settings");
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-neutral-700 hover:text-white transition"
                >
                  <FiSettings className="text-lg" />
                  <span>Account Settings</span>
                </button>

                <button
                  onClick={() => {
                    navigate("/documentation");
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-neutral-700 hover:text-white transition"
                >
                  <FiBook className="text-lg" />
                  <span>Documentation</span>
                </button>

                <button
                  onClick={() => {
                    navigate("/dashboard/settings", {
                      state: { activeTab: "subscription" },
                    });
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-neutral-700 hover:text-white transition"
                >
                  <FiCreditCard className="text-lg" />
                  <span>Account Plan</span>
                </button>
              </div>

              {/* Logout Section */}
              <div className="border-t border-gray-700 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                >
                  <FiLogOut className="text-lg" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default DashboardNavbar;

import React, { useState, useEffect, useRef } from "react";
import { LuBrain } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-neutral-900 border border-gray-700 rounded-xl shadow-lg p-4 z-30">
            {/* Username + Email */}
            <div className="pb-3 border-b border-gray-700">
              <p className="text-white font-semibold">{user.username}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-3 mt-3">
              <button
                onClick={() => navigate("/dashboard/settings")}
                className="w-full text-center bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Account Settings
              </button>

              <button className="w-full text-center bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              href="/docs">
                Documentation
              </button>

              <button
                onClick={() => {
                  navigate("/dashboard/settings", {
                    state: { activeTab: "subscription" },
                  });
                  setDropdownOpen(false);
                }}
                className="w-full text-center bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Account Plan
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full text-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition mt-2"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar;

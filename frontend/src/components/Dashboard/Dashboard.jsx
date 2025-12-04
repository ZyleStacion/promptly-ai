import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar.jsx";


const isAuthenticated = () => !!localStorage.getItem("token");

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) navigate("/signin");
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 pt-24 pb-10">
      {/* Top navigation bar */}
      <DashboardNavbar />

      {/* Dashboard Content */}
      <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard 👋</h1>

      <p className="text-gray-400 mb-8">
        This is your private space. Chatbots, analytics, and settings will appear here.
      </p>

      <div className="bg-neutral-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-semibold mb-2">Your Chatbots</h2>
        <p className="text-gray-400">You don't have any chatbots yet.</p>
      </div>
    </div>
  );
};

export default Dashboard;

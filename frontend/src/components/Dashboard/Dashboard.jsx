import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Simple auth check
const isAuthenticated = () => !!localStorage.getItem("token");

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/signin");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard 👋</h1>

      <p className="text-gray-400 mb-8">
        This is your private space. Once we add chatbot creation, user settings,
        and analytics — all will appear here.
      </p>

      <div className="bg-neutral-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-semibold mb-2">Your Chatbots</h2>
        <p className="text-gray-400">You don't have any chatbots yet.</p>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/signin");
        }}
        className="mt-6 px-6 py-3 bg-red-600 rounded-lg font-medium hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

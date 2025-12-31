import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUsers, FaChartPie, FaCrown, FaArrowLeft, FaBug } from "react-icons/fa";

const AdminLayout = () => {
  const navigate = useNavigate();

  const [feedbackCount, setFeedbackCount] = useState(0);
useEffect(() => {
  const loadFeedbackCount = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/admin/feedback/notifications/count",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setFeedbackCount(data.count || 0);
    } catch (err) {
      console.error("Failed to load admin feedback count");
    }
  };

  loadFeedbackCount();
}, []);

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-gray-700 p-6 space-y-6">

        <div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-gray-400 text-sm">Promptly AI</p>
        </div>

        <nav className="space-y-3">
          <Link
            to="/admin"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-700 transition"
          >
            <FaChartPie /> Dashboard
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-700 transition"
          >
            <FaUsers /> User Management
          </Link>

          <Link
            to="/admin/chatbots"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-700 transition"
          >
            <FaUsers /> chatbot Management
          </Link>

          <Link
            to="/admin/feedback"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-700 transition"
          >
            <div className="flex items-center gap-3">
              <FaUsers />
              Feedback
            </div>

            {feedbackCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {feedbackCount}
              </span>
            )}
          </Link>

        </nav>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full flex items-center gap-3 p-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition"
        >
          <FaArrowLeft /> Back to User Dashboard
        </button>
      </aside>

      {/* Main Content Outlet */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

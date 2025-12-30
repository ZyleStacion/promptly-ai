import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUsers, FaChartPie, FaCrown, FaArrowLeft } from "react-icons/fa";

const AdminLayout = () => {
  const navigate = useNavigate();

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

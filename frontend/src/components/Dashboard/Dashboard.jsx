/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import DashboardNavbar from "./DashboardNavbar.jsx";
import ModelsSection from "./ModelsSection.jsx";
import UsageSection from "./UsageSection.jsx";
import WorkspaceSettings from "./WorkspaceSettings.jsx";
import TrainingSourcesModal from "./TrainingSourcesModal.jsx";
import EditChatbotModal from "./EditChatbotModal.jsx";
import ChatInterface from "./ChatInterface.jsx";
import FeedbackButton from "../Feedback/FeedbackButton.jsx";
import Notification from "./Notification.jsx";

import { api } from "../../api/mockApi";

const isAuthenticated = () => !!localStorage.getItem("token");

const Dashboard = () => {
  const navigate = useNavigate();
  const feedbackRef = useRef(null);

  /* ===================== STATE ===================== */
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("models");
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🔔 Notification
  const [notificationCount, setNotificationCount] = useState(0);

  /* ===================== INIT ===================== */
  useEffect(() => {
    if (!isAuthenticated()) navigate("/signin");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(user.isAdmin || false);

    loadChatbots();
    loadNotificationCount();
  }, []);

  /* ===================== LOADERS ===================== */
  const loadChatbots = async () => {
    try {
      setLoading(true);
      const res = await api.getChatbots();
      if (res.success) setChatbots(res.chatbots || []);
    } catch {
      setError("Failed to load chatbots");
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationCount = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/feedback/notifications/count",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setNotificationCount(data.count || 0);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  /* ===================== RENDER ===================== */
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardNavbar
        notificationCount={notificationCount}
        onFeedbackClick={() => feedbackRef.current?.openModal()}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex pt-10">
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="hidden lg:block w-64 bg-neutral-900 fixed left-0 min-h-screen p-6">
          <nav className="space-y-3 pt-10">
            <SidebarButton
              label="Models"
              active={activeSection === "models"}
              onClick={() => setActiveSection("models")}
            />

            <SidebarButton
              label="Usage"
              active={activeSection === "usage"}
              onClick={() => setActiveSection("usage")}
            />

            <SidebarButton
              label="Workspace setting"
              active={activeSection === "settings"}
              onClick={() => setActiveSection("settings")}
            />

            <SidebarButton
              label="Notification"
              active={activeSection === "notification"}
              onClick={() => {
                setActiveSection("notification");
                setNotificationCount(0);
              }}
              badge={notificationCount}
            />

            {isAdmin && (
              <SidebarButton
                label="Admin Panel"
                color="amber"
                onClick={() => navigate("/admin")}
              />
            )}
          </nav>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="lg:ml-64 flex-1 p-8 pt-20">
          {error && (
            <div className="mb-4 p-3 bg-red-600/20 border border-red-600 rounded text-red-400">
              {error}
            </div>
          )}

          {activeSection === "models" && (
            <ModelsSection
              loading={loading}
              chatbots={chatbots}
              onCreateChatbot={() => setShowTrainingModal(true)}
            />
          )}

          {activeSection === "usage" && <UsageSection chatbots={chatbots} />}

          {activeSection === "settings" && <WorkspaceSettings />}

          {activeSection === "notification" && (
            <Notification onViewed={() => setNotificationCount(0)} />
          )}
        </main>
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="w-64 h-full bg-neutral-900 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-3 pt-6">
                <MobileButton
                  label="Models"
                  onClick={() => {
                    setActiveSection("models");
                    setIsSidebarOpen(false);
                  }}
                />

                <MobileButton
                  label="Usage"
                  onClick={() => {
                    setActiveSection("usage");
                    setIsSidebarOpen(false);
                  }}
                />

                <MobileButton
                  label="Workspace setting"
                  onClick={() => {
                    setActiveSection("settings");
                    setIsSidebarOpen(false);
                  }}
                />

                <MobileButton
                  label={`Notification ${notificationCount > 0 ? `(${notificationCount})` : ""}`}
                  onClick={() => {
                    setActiveSection("notification");
                    setNotificationCount(0);
                    setIsSidebarOpen(false);
                  }}
                />

                {isAdmin && (
                  <MobileButton
                    label="Admin Panel"
                    onClick={() => {
                      navigate("/admin");
                      setIsSidebarOpen(false);
                    }}
                  />
                )}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= FLOATING FEEDBACK ================= */}
      <FeedbackButton ref={feedbackRef} />
    </div>
  );
};

/* ===================== COMPONENTS ===================== */

const SidebarButton = ({ label, active, onClick, badge, color }) => (
  <motion.button
    whileHover={{ scale: 1.03, x: 5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
      color === "amber"
        ? "bg-amber-600 hover:bg-amber-700"
        : active
        ? "bg-gradient-to-r from-blue-600 to-violet-600"
        : "bg-neutral-700 hover:bg-neutral-600"
    }`}
  >
    {label}
    {badge > 0 && (
      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </motion.button>
);

const MobileButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition"
  >
    {label}
  </button>
);

export default Dashboard;

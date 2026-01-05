import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { API_URL } from "../../api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
        setError(true);
      }
    };

    loadStats();
  }, []);

  if (error)
    return (
      <p className="text-red-400 dark:text-red-600">
        Failed to load dashboard data
      </p>
    );

  if (!stats)
    return (
      <p className="text-white dark:text-gray-900">Loading dashboard...</p>
    );

  const hasSignupData = stats.dailySignups?.some((d) => d.count > 0);

  const hasChatbotActivity = stats.dailyChatbots?.some((d) => d.count > 0);
  const hasTransactionActivity = stats.dailyTransactions?.some(
    (d) => d.count > 0
  );

  return (
    <div className="text-white dark:text-gray-900">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* ================= KPIs ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Admin Accounts" value={stats.totalAdmins} />
        <StatCard label="Total Chatbots" value={stats.totalChatbots} />
        <StatCard label="Total Transactions" value={stats.totalTransactions} />
      </div>

      {/* ================= USER SIGNUPS ================= */}
      <Section title="User Signup Activity (Last 14 Days)">
        {hasSignupData ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.dailySignups}>
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Placeholder message="No signup activity yet" />
        )}
      </Section>

      {/* ================= CHATBOT ACTIVITY ================= */}
      <Section title="Chatbot Creation Activity (Last 14 Days)">
        {hasChatbotActivity ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.dailyChatbots}>
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Placeholder message="No chatbot activity yet" />
        )}
      </Section>

      {/* ================= TRANSACTION ACTIVITY ================= */}
      <Section title="Transaction Activity (Last 14 Days)">
        {hasTransactionActivity ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.dailyTransactions}>
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Placeholder message="No transactions yet" />
        )}
      </Section>
    </div>
  );
};

export default AdminDashboard;

/* ======================= COMPONENTS ======================= */

const StatCard = ({ label, value, positive }) => (
  <div className="bg-neutral-800 dark:bg-white p-6 rounded-xl border border-gray-700 dark:border-gray-200 shadow-sm">
    <p className="text-gray-400 dark:text-gray-600 text-sm mb-1">{label}</p>
    <p
      className={`text-4xl font-bold ${
        positive === undefined
          ? "text-white dark:text-gray-900"
          : positive
          ? "text-green-400 dark:text-green-600"
          : "text-red-400 dark:text-red-600"
      }`}
    >
      {value ?? 0}
    </p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-neutral-800 dark:bg-white p-6 rounded-xl border border-gray-700 dark:border-gray-200 mb-12 shadow-sm">
    <h2 className="text-xl font-semibold mb-4 text-white dark:text-gray-900">
      {title}
    </h2>
    {children}
  </div>
);

const Placeholder = ({ message }) => (
  <div className="py-12 text-center text-gray-400 dark:text-gray-600 text-lg">
    {message}
  </div>
);

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/admin/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats({ error: true }));
  }, []);

  if (!stats) return <p className="text-white">Loading...</p>;

  const hasSignupData =
    stats.dailySignups && stats.dailySignups.some((d) => d.count > 0);
  const hasChatbotData = stats.totalChatbots > 0;

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card label="Total Users" value={stats.totalUsers || 0} />
        <Card label="Admin Accounts" value={stats.totalAdmins || 0} />
        <Card label="Total Chatbots" value={stats.totalChatbots || 0} />
        <Card
          label="User Growth (7 days)"
          value={`${stats.growthPercentage || 0}%`}
          positive={stats.growthPercentage >= 0}
        />
      </div>

      {/* Signup Activity Chart */}
      <Section title="User Signup Activity">
        {hasSignupData ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.dailySignups}>
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Placeholder message="No signup activity yet" />
        )}
      </Section>

      {/* Chatbot Usage */}
      <Section title="Chatbot Usage">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Chatbots</p>
            <p className="text-5xl font-bold text-indigo-400">
              {stats.totalChatbots || 0}
            </p>
          </div>

          {/* Visual indicator */}
          <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 flex items-center justify-center">
            <span className="text-indigo-400 text-lg font-semibold">
              {stats.totalChatbots}
            </span>
          </div>
        </div>
      </Section>

    </div>
  );
};

// ---------------------- COMPONENTS --------------------------

const Card = ({ label, value, positive }) => (
  <div className="bg-neutral-800 p-6 rounded-xl border border-gray-700">
    <h2 className="text-lg text-gray-300">{label}</h2>
    <p
      className={`text-4xl font-bold ${positive === undefined
          ? ""
          : positive
            ? "text-green-400"
            : "text-red-400"
        }`}
    >
      {value}
    </p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-neutral-800 p-6 rounded-xl border border-gray-700 mb-10">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const Placeholder = ({ message }) => (
  <div className="py-10 text-center text-gray-400 text-lg">{message}</div>
);

export default AdminDashboard;

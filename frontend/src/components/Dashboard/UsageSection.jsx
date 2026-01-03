import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CHATBOT_LIMITS = {
  Basic: 1,
  Pro: 5,
  Enterprise: 20,
};

const UsageSection = ({ chatbots = [], user }) => {
  const [usage, setUsage] = useState(null);
  const isAdmin = user?.isAdmin === true;

  useEffect(() => {
    const loadUsage = async () => {
      try {
        const res = await fetch("http://localhost:3000/usage/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setUsage(data);
      } catch (err) {
        console.error("Failed to load usage data", err);
      }
    };

    loadUsage();
  }, []);

  const plan = isAdmin ? "Admin" : usage?.plan || "Basic";
  const chatbotLimit = isAdmin ? Infinity : CHATBOT_LIMITS[plan] ?? 1;

  const chatbotUsed = chatbots.length;
  const percentUsed = isAdmin
    ? 100
    : Math.min((chatbotUsed / chatbotLimit) * 100, 100);

  return (
    <div>
      {/* ================= HEADER ================= */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold mb-6 text-white dark:text-gray-900"
      >
        Usage
      </motion.h2>

      {/* ================= USAGE CARDS ================= */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {/* ================= PLAN / ADMIN ACCESS ================= */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className={`bg-neutral-800 dark:bg-white p-6 rounded-xl border ${
            isAdmin
              ? "border-amber-500/50 dark:border-amber-400"
              : "border-gray-700 dark:border-gray-200"
          }`}
        >
          <h3
            className={`text-sm mb-2 ${
              isAdmin
                ? "text-amber-400 dark:text-amber-600"
                : "text-gray-400 dark:text-gray-600"
            }`}
          >
            {isAdmin ? "Admin Access" : "Plan Capacity"}
          </h3>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {isAdmin ? "Unlimited" : chatbotLimit}
            </span>
            {!isAdmin && <span className="text-gray-400">max chatbots</span>}
          </div>

          <p className="text-sm text-gray-400 dark:text-gray-600 mt-3">
            {isAdmin ? (
              "Admin accounts are not restricted by subscription plans."
            ) : (
              <>
                You are currently on the{" "}
                <span className="font-semibold capitalize text-white dark:text-gray-900">
                  {plan}
                </span>{" "}
                plan.
              </>
            )}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {isAdmin
              ? "Full access to all chatbot features."
              : "Upgrade your plan to increase chatbot capacity."}
          </p>
        </motion.div>

        {/* ================= CHATBOT USAGE ================= */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="bg-neutral-800 dark:bg-white p-6 rounded-xl border border-gray-700 dark:border-gray-200"
        >
          <h3 className="text-gray-400 dark:text-gray-600 text-sm mb-2">
            {isAdmin ? "Total Chatbots (System)" : "Chatbots Used"}
          </h3>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white dark:text-gray-900">
              {chatbotUsed}
            </span>
            {!isAdmin && (
              <span className="text-gray-400 dark:text-gray-600">
                / {chatbotLimit}
              </span>
            )}
          </div>

          <div className="mt-4 bg-gray-700 dark:bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                isAdmin
                  ? "bg-amber-500"
                  : "bg-gradient-to-r from-blue-600 to-violet-600"
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {isAdmin ? "System-wide chatbot count" : `Current plan: ${plan}`}
          </p>
        </motion.div>
      </div>

      {/* ================= USAGE HISTORY ================= */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="bg-neutral-800 dark:bg-white p-6 rounded-xl border border-gray-700 dark:border-gray-200"
      >
        <h3 className="text-xl font-semibold mb-4 text-white dark:text-gray-900">
          {isAdmin ? "System Activity" : "Usage History"}
        </h3>

        <div className="space-y-3">
          {chatbots.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-600 text-center py-8">
              No usage history yet
            </p>
          ) : (
            chatbots.map((bot) => (
              <div
                key={bot._id}
                className="flex justify-between text-sm text-gray-300 dark:text-gray-700 border-b border-gray-700 dark:border-gray-200 pb-2"
              >
                <span>{bot.name}</span>
                <span>{new Date(bot.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UsageSection;

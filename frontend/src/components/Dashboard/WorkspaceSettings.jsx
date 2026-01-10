import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const WorkspaceSettings = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.isAdmin === true;

  const navigate = useNavigate();

  const settingsOptions = [
    !isAdmin && {
      title: "Plans",
      description: "Manage and upgrade your Promptly AI plan",
      path: "/dashboard/plans",
    },
    !isAdmin && {
      title: "Billing",
      description: "View your billing history",
      path: "/dashboard/billing",
    },
  ].filter(Boolean);

  const MODEL_BLOCKLIST = ["gemma3:1b-it-qat", "gemma3:1b", "gemma3:4b"];

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold mb-6 text-white dark:text-gray-900"
      >
        Workspace Settings
      </motion.h2>
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-neutral-800 dark:bg-white border border-gray-700 dark:border-gray-200 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-2 text-white dark:text-gray-900">
            Admin Account
          </h3>
          <p className="text-gray-400 dark:text-gray-600 text-sm">
            Subscription plans and billing are disabled for admin accounts. You
            have unlimited access to all features.
          </p>
        </motion.div>
      )}

      <div className="space-y-4">
        {settingsOptions.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
            whileHover={{
              scale: 1.02,
              borderColor: "rgba(156, 163, 175, 0.5)",
            }}
            onClick={() => {
              if (isAdmin) return;
              option.path && navigate(option.path);
            }}
            className="bg-neutral-800 dark:bg-white p-5 rounded-xl border border-gray-700 dark:border-gray-200 hover:border-gray-600 dark:hover:border-gray-300 transition cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-white dark:text-gray-900">
              {option.title}
            </h3>
            <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">
              {option.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceSettings;

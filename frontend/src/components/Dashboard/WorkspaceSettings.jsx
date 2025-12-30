import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const WorkspaceSettings = () => {
  const navigate = useNavigate();

  const settingsOptions = [
    { title: "Plans", description: "Manage and upgrade your Promptly AI plan", path: "/dashboard/plans" },
    { title: "Billing", description: "Modify your billing details", path: "/dashboard/billing" },
    { title: "Support", description: "Get help from our support team", path: null },
  ];

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold mb-6"
      >
        Workspace Settings
      </motion.h2>

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
            onClick={() => option.path && navigate(option.path)}
            className="bg-neutral-800 p-5 rounded-xl border border-gray-700 hover:border-gray-600 transition cursor-pointer"
          >
            <h3 className="text-lg font-semibold">{option.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{option.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceSettings;

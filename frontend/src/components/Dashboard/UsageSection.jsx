import React from "react";
import { motion } from "framer-motion";

const UsageSection = ({ chatbots }) => {
  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold mb-6"
      >
        Usage
      </motion.h2>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {/* Credit Used Box */}
        {/* no logic yet to fectch actually used credits  */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="bg-neutral-800 p-6 rounded-xl border border-gray-700"
        >
          <h3 className="text-gray-400 text-sm mb-2">Credit Used</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">1</span>
            <span className="text-gray-400">/ 50</span>
          </div>
          <div className="mt-4 bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-violet-600 h-full"
              style={{ width: "2%" }}
            ></div>
          </div>
        </motion.div>

        {/* Chatbot Used Box */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="bg-neutral-800 p-6 rounded-xl border border-gray-700"
        >
          <h3 className="text-gray-400 text-sm mb-2">Chatbot Used</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{chatbots.length}</span>
            <span className="text-gray-400">chatbots</span>
          </div>
        </motion.div>
      </div>

      {/* Usage History */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="bg-neutral-800 p-6 rounded-xl border border-gray-700"
      >
        <h3 className="text-xl font-semibold mb-4">Usage History</h3>
        <div className="space-y-3">
          {/* Placeholder for usage history */}
          <p className="text-gray-400 text-center py-8">No usage history yet</p>
        </div>
      </motion.div>
    </div>
  );
};

export default UsageSection;

import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UpgradeModal = ({ isOpen, onClose, plan, limit }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-neutral-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4"
        >
          <h2 className="text-xl font-bold text-white mb-2">
            Chatbot limit reached 🚫
          </h2>

          <p className="text-gray-400 text-sm mb-4">
            Your <span className="font-semibold text-white">{plan}</span> plan
            allows up to <span className="font-semibold text-white">{limit}</span>{" "}
            chatbot{limit > 1 ? "s" : ""}.
          </p>

          <div className="bg-neutral-800 border border-gray-700 rounded-lg p-3 mb-4 text-sm text-gray-300">
            Upgrade your plan to create more chatbots and unlock advanced
            features.
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition"
            >
              Cancel
            </button>

            <button
              onClick={() => navigate("/dashboard/plans")}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Upgrade Plan
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpgradeModal;

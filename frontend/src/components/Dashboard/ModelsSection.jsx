import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ModelsSection = ({ loading, chatbots, onCreateChatbot }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-2xl font-bold">Your Models</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateChatbot}
          className="bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2 font-semibold rounded-lg transition hover:sca hover:font-bold"
        >
          + Create Chatbot
        </motion.button>
      </motion.div>

      {loading ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400"
        >
          Loading...
        </motion.p>
      ) : chatbots.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-neutral-800 p-8 rounded-xl border border-gray-700 text-center"
        >
          <p className="text-gray-400 mb-4">You don't have any chatbots yet.</p>
          <p className="text-gray-500 text-sm">
            Click "Create Chatbot" to get started!
          </p>
        </motion.div>
      ) : (
        // list of chatbots
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chatbots.map((bot, index) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 20px rgba(59,130,246,0.5)",
                transition: { duration: 0.1 },
              }}
              className="bg-neutral-800 p-5 rounded-xl border border-gray-700 hover:border-gray-600 transition cursor-pointer"
            >
              {/* Top Part - Profile Picture */}
              <div className="w-full h-32 mb-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center">
                {bot.profilePicture ? (
                  <img
                    src={bot.profilePicture}
                    alt={bot.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {bot.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Bottom Part - Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{bot.name}</h3>
                <p className="text-gray-400 text-xs">{bot.description}</p>
                <div className="flex justify-between items-center pt-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      bot.status === "active"
                        ? "bg-green-600/20 text-green-400"
                        : "bg-gray-600/20 text-gray-400"
                    }`}
                  >
                    {bot.status}
                  </span>

                  {/* Three Dots Menu */}
                  <div
                    className="relative"
                    ref={openMenuId === bot.id ? menuRef : null}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === bot.id ? null : bot.id);
                      }}
                      className="text-gray-400 hover:text-white p-1 rounded hover:bg-neutral-700 transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <circle cx="10" cy="5" r="1.5" />
                        <circle cx="10" cy="10" r="1.5" />
                        <circle cx="10" cy="15" r="1.5" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {openMenuId === bot.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 bottom-full mb-2 w-48 bg-neutral-700 rounded-lg shadow-xl border border-gray-600 py-1 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              console.log("Change name for", bot.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-600 transition flex items-center gap-2"
                          >
                            <span>✏️</span>
                            Change Chatbot Name
                          </button>
                          <button
                            onClick={() => {
                              console.log("Change profile image for", bot.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-600 transition flex items-center gap-2"
                          >
                            <span>🖼️</span>
                            Change Profile Image
                          </button>
                          <button
                            onClick={() => {
                              console.log("Delete chatbot", bot.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-600 transition flex items-center gap-2"
                          >
                            <span>🗑️</span>
                            Delete Chatbot
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelsSection;

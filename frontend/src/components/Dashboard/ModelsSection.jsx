/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Link as LinkIcon, Pencil, Trash2, Copy } from "lucide-react";

const ModelsSection = ({ loading, chatbots, onCreateChatbot, onDeleteChatbot, onTestChatbot, onEditChatbot }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showEmbedCode, setShowEmbedCode] = useState(null);
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

  const handleEditChatbot = (bot) => {
    onEditChatbot(bot);
    setOpenMenuId(null);
  };

  // helper: append alpha to hex color like #RRGGBB -> #RRGGBBAA
  const withAlpha = (hex, alpha) => {
    try {
      if (!hex || typeof hex !== "string") return hex;
      if (!hex.startsWith("#") || (hex.length !== 7 && hex.length !== 9)) return hex;
      const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
      // if already has alpha (#RRGGBBAA), keep original
      return hex.length === 9 ? hex : `${hex}${a}`;
    } catch {
      return hex;
    }
  };

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
          className="bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2 font-semibold rounded-lg transition hover:scale hover:font-bold"
        >
          + Create Chatbot
        </motion.button>
      </motion.div>

      {(() => {
        if (loading) {
          return (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400"
            >
              Loading...
            </motion.p>
          );
        }

        if (chatbots.length === 0) {
          return (
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
          );
        }

        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chatbots.map((bot, index) => (
              <motion.div
                key={bot._id}
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
                <div
                  className="w-full h-32 mb-3 rounded-lg flex items-center justify-center overflow-hidden"
                  style={{
                    background: `linear-gradient(90deg, ${withAlpha(bot.primaryColor || "#3B82F6", 1)}, ${withAlpha(bot.primaryColor || "#3B82F6", 0.6)})`,
                  }}
                >
                  {bot.profilePicture ? (
                    <img
                      src={bot.profilePicture}
                      alt={bot.name}
                      className="w-full h-full object-cover"
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
                    {(() => {
                      const isActive = (bot.status || "active") === "active";
                      const activeStyle = isActive
                        ? {
                            backgroundColor: withAlpha(bot.primaryColor || "#3B82F6", 0.18),
                            color: bot.primaryColor || "#3B82F6",
                          }
                        : undefined;
                      return (
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            isActive ? "" : "bg-gray-600/20 text-gray-400"
                          }`}
                          style={activeStyle}
                        >
                          {bot.status || "active"}
                        </span>
                      );
                    })()}

                    {/* Three Dots Menu */}
                    <div
                      className="relative"
                      ref={openMenuId === bot._id ? menuRef : null}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === bot._id ? null : bot._id);
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
                        {openMenuId === bot._id && (
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
                                onTestChatbot(bot);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-600 transition flex items-center gap-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Test Chatbot</span>
                            </button>
                            <button
                              onClick={() => {
                                setShowEmbedCode(bot._id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-600 transition flex items-center gap-2"
                            >
                              <LinkIcon className="w-4 h-4" />
                              <span>Get Embed Code</span>
                            </button>
                            <button
                              onClick={() => handleEditChatbot(bot)}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-600 transition flex items-center gap-2"
                            >
                              <Pencil className="w-4 h-4" />
                              <span>Edit Chatbot</span>
                            </button>
                            <button
                              onClick={() => {
                                onDeleteChatbot(bot._id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-600 transition flex items-center gap-2 text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete Chatbot</span>
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
        );
      })()}

      {/* Embed Code Modal */}
      <AnimatePresence>
        {showEmbedCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmbedCode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-800 rounded-xl p-6 max-w-2xl w-full border border-gray-700"
            >
              <h3 className="text-xl font-bold mb-4">Embed Code</h3>
              <p className="text-gray-400 text-sm mb-4">
                Copy and paste this code into your website's HTML to embed your chatbot:
              </p>
              <div className="bg-neutral-900 p-4 rounded-lg mb-4 border border-gray-700">
                <pre className="text-sm text-green-400 overflow-x-auto">
                  {`<!-- Promptly Chatbot Widget -->
<div data-promptly-chatbot-id="${showEmbedCode}"></div>
<script>
  globalThis.PROMPTLY_API_URL = '${globalThis.location.protocol}//${globalThis.location.hostname}:3000';
  // Adjust :3000 to your backend port if different
</script>
<script src="${globalThis.location.protocol}//${globalThis.location.hostname}:5173/promptly-widget.js"></script>`}
                </pre>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const code = `<!-- Promptly Chatbot Widget -->\n<div data-promptly-chatbot-id="${showEmbedCode}"></div>\n<script>\n  globalThis.PROMPTLY_API_URL = '${globalThis.location.protocol}//${globalThis.location.hostname}:3000';\n  // Adjust :3000 to your backend port if different\n</script>\n<script src="${globalThis.location.protocol}//${globalThis.location.hostname}:5173/promptly-widget.js"></script>`;
                    navigator.clipboard.writeText(code);
                    alert('Embed code copied to clipboard!');
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:opacity-90 transition flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </button>
                <button
                  onClick={() => setShowEmbedCode(null)}
                  className="px-4 py-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModelsSection;

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatbotManagement = () => {
  const [chatbots, setChatbots] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  const loadChatbots = () => {
    fetch("http://localhost:3000/admin/chatbots", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setChatbots(data.chatbots || []));
  };

  useEffect(() => {
    loadChatbots();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuId &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId].contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const deleteChatbot = (id) => {
    if (!confirm("Are you sure you want to delete this chatbot?")) return;

    fetch(`http://localhost:3000/admin/chatbots/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(() => loadChatbots());
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Chatbot Management</h1>

      <div className="bg-neutral-800 border border-gray-700 rounded-xl overflow-visible">
        <table className="w-full text-left">
          <thead className="bg-neutral-900">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {chatbots.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-400"
                >
                  No chatbots created yet
                </td>
              </tr>
            )}

            {chatbots.map((bot) => (
              <tr key={bot._id} className="border-t border-gray-700">
                <td className="p-3 font-medium text-indigo-400">
                  {bot.name}
                </td>

                <td className="p-3 text-gray-300">
                  {bot.description || "—"}
                </td>

                <td className="p-3 text-gray-400">
                  {bot.ownerEmail || "Unknown"}
                </td>

                <td className="p-3 text-gray-400">
                  {bot.createdAt
                    ? new Date(bot.createdAt).toLocaleDateString()
                    : "—"}
                </td>

                <td className="p-3 relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === bot._id ? null : bot._id
                      )
                    }
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    ⋮
                  </button>

                  <AnimatePresence>
                    {openMenuId === bot._id && (
                      <motion.div
                        ref={(el) =>
                          (menuRefs.current[bot._id] = el)
                        }
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 bg-neutral-700 border border-gray-600 rounded-lg shadow-lg z-50 min-w-[160px]"
                      >
                        <button
                          onClick={() => {
                            deleteChatbot(bot._id);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-600 rounded-lg text-red-400"
                        >
                          Delete Chatbot
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChatbotManagement;

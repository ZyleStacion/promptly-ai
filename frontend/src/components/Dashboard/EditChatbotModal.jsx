import React from "react";
import { FileText, Edit3, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EditChatbotModal = ({
  isOpen,
  onClose,
  chatbot,
  chatbotName,
  setChatbotName,
  description,
  setDescription,
  welcomeMessage,
  setWelcomeMessage,
  primaryColor,
  setPrimaryColor,
  chatbotType,
  setChatbotType,
  chatbotPersonality,
  setChatbotPersonality,
  selectedModel,
  setSelectedModel,
  profilePreview,
  onUploadProfile,
  onDeleteProfile,
  availableModels = [],
  editingTrainingData = [],
  onRemoveTrainingItem,
  onAddFiles,
  onAddText,
  onSave,
  saving,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
          >
            <h3 className="text-xl font-bold mb-2">Edit Chatbot</h3>
            <p className="text-gray-400 text-sm mb-6">Update settings, training data and avatar.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left - Form */}
              <div>
                {/* Name */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-300">Chatbot Name *</label>
                  <input
                    type="text"
                    value={chatbotName}
                    onChange={(e) => setChatbotName(e.target.value)}
                    className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-300">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Welcome Message */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-300">Welcome Message</label>
                  <textarea
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    rows={2}
                    className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Appearance */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-300">Appearance</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer bg-neutral-700 border border-gray-600"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Profile Picture */}
                <div className="mb-4">
                  <label className="block mb-2 text-xs text-gray-400">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-700 border border-gray-600 overflow-hidden flex items-center justify-center">
                      {profilePreview ? (
                        <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-500 text-xs">No image</span>
                      )}
                    </div>
                    <label className="px-4 py-2 bg-neutral-700 rounded-lg border border-gray-600 cursor-pointer hover:bg-neutral-600 transition text-sm">
                      Upload Image
                      <input type="file" accept="image/*" onChange={onUploadProfile} className="hidden" />
                    </label>
                    <button
                      onClick={onDeleteProfile}
                      className="px-4 py-2 bg-neutral-700 rounded-lg border border-gray-600 hover:bg-neutral-600 transition text-sm text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Personality & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 text-sm text-gray-300">Personality</label>
                    <select
                      value={chatbotPersonality}
                      onChange={(e) => setChatbotPersonality(e.target.value)}
                      className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="friendly">Warm and Friendly</option>
                      <option value="professional">Professional</option>
                      <option value="support">Warm and Concise</option>
                      <option value="sales">Short and Direct</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-300">Use-case</label>
                    <select
                      value={chatbotType}
                      onChange={(e) => setChatbotType(e.target.value)}
                      className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="general">General Purpose</option>
                      <option value="support">Customer Support</option>
                      <option value="sales">Sales Assistant</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                {/* Model */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-300">Select Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    {availableModels.map((m) => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right - Training Data */}
              <div className="bg-neutral-900 rounded-lg p-4 border border-gray-700 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Training Data</h3>
                  <div className="flex gap-2">
                    <label className="px-3 py-2 bg-neutral-800 rounded border border-gray-600 cursor-pointer hover:bg-neutral-700 text-sm">
                      + Upload File
                      <input type="file" multiple accept=".txt" onChange={(e) => onAddFiles(Array.from(e.target.files))} className="hidden" />
                    </label>
                    <button className="px-3 py-2 bg-neutral-800 rounded border border-gray-600 hover:bg-neutral-700 text-sm" onClick={() => onAddText(prompt("Enter text snippet:") || "")}>+ Add Text</button>
                  </div>
                </div>

                <div className="space-y-2 overflow-y-auto">
                  {editingTrainingData.length === 0 && (
                    <p className="text-sm text-gray-400">No training data added yet.</p>
                  )}
                  {editingTrainingData.map((data, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-neutral-800 p-3 rounded border border-gray-600">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate inline-flex items-center gap-2">
                          {data.type === "file" ? (
                            <>
                              <FileText className="w-4 h-4" /> {data.filename}
                            </>
                          ) : (
                            <>
                              <Edit3 className="w-4 h-4" /> Text snippet
                            </>
                          )}
                        </p>
                        {data.type === "text" && (
                          <p className="text-xs text-gray-400 mt-1 truncate">{data.content.slice(0, 80)}{data.content.length > 80 ? "…" : ""}</p>
                        )}
                      </div>
                      <button onClick={() => onRemoveTrainingItem(idx)} className="ml-2 text-red-400 hover:text-red-300 text-sm font-semibold flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 px-4 py-3 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition">Cancel</button>
              <button onClick={onSave} disabled={saving || !chatbotName.trim()} className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditChatbotModal;

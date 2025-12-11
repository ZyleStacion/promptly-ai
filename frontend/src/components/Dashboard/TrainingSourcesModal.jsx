import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const TrainingSourcesModal = ({
  showTrainingModal,
  setShowTrainingModal,
  trainingFiles,
  setTrainingFiles,
  trainingText,
  selectedModel,
  chatbotType,
  chatbotPersonality, 
  handleFileChange,
  handleRemoveFile,
  setTrainingText,
  setSelectedModel,
  setChatbotType,
  setChatbotPersonality, 
  handleTrainContinue,
}) => {
  return (
    <AnimatePresence>
      {showTrainingModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-neutral-800 rounded-xl p-8 max-w-5xl w-full mx-4 border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
          >
            <h2 className="text-2xl font-bold mb-2">Add training sources</h2>
            <p className="text-gray-400 text-sm mb-6">
              You can add multiple sources to train your Agent, let's start with
              a file or a link to your site.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto flex-1 mb-6">
              {/* Left Column - Form Inputs */}
              <div>
                {/* File Upload */}
                <div className="mb-4">
                  <label className="flex items-center justify-between p-4 bg-neutral-700 rounded-lg border border-gray-600 cursor-pointer hover:bg-neutral-600 transition">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">📄</span>
                      <span>File</span>
                    </span>
                    <span className="text-2xl text-gray-400">+</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Text Input */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-300">
                    Text
                  </label>
                  <textarea
                    value={trainingText}
                    onChange={(e) => setTrainingText(e.target.value)}
                    placeholder="Enter training text..."
                    className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    rows="2"
                  />
                </div>

                {/* Select Model Dropdown */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-300">
                    Select Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="" disabled hidden>Select a model...</option>
                    <option value="ollama1">Ollama1</option>
                    <option value="ollama2">Ollama2</option>
                    <option value="ollama3">Ollama3</option>
                  </select>
                </div>

                {/* Type of Chatbot's personalities Dropdown */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-300">
                    Personality
                  </label>
                  <select
                    value={chatbotPersonality}
                    onChange={(e) => setChatbotPersonality(e.target.value)}
                    className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="" disabled hidden>Select Personality</option>
                    <option value="warm-concise">Warm and Concise</option>
                    <option value="short-direct">Short and Direct</option>
                  </select>
                </div>

                {/* Type of Chatbot Dropdown */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-300">
                    Use-case
                  </label>
                  <select
                    value={chatbotType}
                    onChange={(e) => setChatbotType(e.target.value)}
                    className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="" disabled hidden>Select Use-case</option>
                    <option value="support">Customer Support</option>
                    <option value="sales">Sales Assistant</option>
                    <option value="general">General Purpose</option>
                  </select>
                </div>
              </div>

              {/* Right Column - Sources Preview (CORRECT/ONLY ONE) */}
              <div className="bg-neutral-900 rounded-lg p-4 border border-gray-700 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Sources</h3>
                  {(trainingFiles.length > 0 || trainingText) && (
                    <button
                      onClick={() => {
                        setTrainingFiles([]);
                        setTrainingText("");
                      }}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded transition"
                    >
                      Delete All
                    </button>
                  )}
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {trainingFiles.length === 0 && !trainingText ? (
                    <p className="text-gray-500 text-sm text-center py-8">
                      No sources added yet
                    </p>
                  ) : (
                    <>
                      {trainingFiles.map((file, index) => {
                        const sizeInKB = (file.size / 1024).toFixed(2);
                        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                        const displaySize =
                          file.size > 1048576
                            ? `${sizeInMB} MB`
                            : `${sizeInKB} KB`;
                        return (
                          <div
                            key={index}
                            className="flex items-start justify-between bg-neutral-800 p-3 rounded border border-gray-600"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">
                                📄 {file.name}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {displaySize}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="ml-2 text-red-400 hover:text-red-300 text-sm font-semibold flex-shrink-0"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                      {trainingText && (
                        <div className="bg-neutral-800 p-3 rounded border border-gray-600">
                          <p className="text-sm text-white">📝 Text Input</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {trainingText.length} characters
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total size</span>
                    <span className="text-white font-semibold">
                      {trainingFiles.length > 0
                        ? `${(
                            trainingFiles.reduce(
                              (sum, file) => sum + file.size,
                              0
                            ) / 1024
                          ).toFixed(2)} KB`
                        : "0 KB"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTrainingModal(false)}
                className="flex-1 px-4 py-3 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleTrainContinue}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Train & Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrainingSourcesModal;
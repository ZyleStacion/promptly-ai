import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardNavbar from "./DashboardNavbar.jsx";
import ModelsSection from "./ModelsSection.jsx";
import UsageSection from "./UsageSection.jsx";
import WorkspaceSettings from "./WorkspaceSettings.jsx";
import TrainingSourcesModal from "./TrainingSourcesModal.jsx";
import { mockApi, USE_MOCK_API } from "../../api/mockApi";

const isAuthenticated = () => !!localStorage.getItem("token");

const Dashboard = () => {
  const navigate = useNavigate();
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("models"); // models, usage, settings
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showChatbotUIModal, setShowChatbotUIModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Training form state
  const [trainingFiles, setTrainingFiles] = useState([]);
  const [trainingText, setTrainingText] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [chatbotType, setChatbotType] = useState("");

  // Chatbot UI form state
  const [chatbotName, setChatbotName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) navigate("/signin");

    // Check if user is admin
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(user.isAdmin || false);

    loadChatbots();
  }, []);

  const loadChatbots = async () => {
    try {
      setLoading(true);
      if (USE_MOCK_API) {
        const response = await mockApi.getChatbots();
        setChatbots(response.chatbots);
      }
    } catch (error) {
      console.error("Error loading chatbots:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setTrainingFiles([...trainingFiles, ...newFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setTrainingFiles(
      trainingFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleTrainContinue = () => {
    setShowTrainingModal(false);
    setShowChatbotUIModal(true);
  };

  const handleDone = () => {
    // Placeholder for creating chatbot
    console.log("Creating chatbot:", {
      chatbotName,
      primaryColor,
      profilePicture,
    });
    setShowChatbotUIModal(false);
    // Reset forms
    setTrainingFiles([]);
    setTrainingText("");
    setSelectedModel("");
    setChatbotType("");
    setChatbotName("");
    setPrimaryColor("#3B82F6");
    setProfilePicture(null);
    setProfilePreview("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardNavbar />

      <div className="flex pt-10">
        {/* Left Sidebar Navigation */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-64 min-h-screen bg-neutral-900 border-r border-gray-700 p-6 fixed left-0"
        >
          <nav className="space-y-3 pt-10">
            <motion.button
              whileHover={{ scale: 1.03, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection("models")}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeSection === "models"
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 font-semibold"
                  : "bg-neutral-700 hover:bg-neutral-600"
              }`}
            >
              Models
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection("usage")}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeSection === "usage"
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 font-semibold"
                  : "bg-neutral-700 hover:bg-neutral-600"
              }`}
            >
              Usage
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection("settings")}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeSection === "settings"
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 font-semibold"
                  : "bg-neutral-700 hover:bg-neutral-600"
              }`}
            >
              Workspace setting
            </motion.button>

            {/* Admin Panel Button - Only visible for admins */}
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.03, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin")}
                className="w-full text-left px-4 py-3 rounded-lg transition bg-amber-600 hover:bg-amber-700 font-semibold"
              >
                Admin Panel
              </motion.button>
            )}
          </nav>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="ml-64 flex-1 p-8 pt-20"
        >
          {activeSection === "models" && (
            <ModelsSection
              loading={loading}
              chatbots={chatbots}
              onCreateChatbot={() => setShowTrainingModal(true)}
            />
          )}
          {activeSection === "usage" && <UsageSection chatbots={chatbots} />}
          {activeSection === "settings" && <WorkspaceSettings />}
        </motion.div>
      </div>

      {/* Add Training Sources Modal */}
      <TrainingSourcesModal
        showTrainingModal={showTrainingModal}
        setShowTrainingModal={setShowTrainingModal}
        trainingFiles={trainingFiles}
        setTrainingFiles={setTrainingFiles}
        trainingText={trainingText}
        selectedModel={selectedModel}
        chatbotType={chatbotType}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        setTrainingText={setTrainingText}
        setSelectedModel={setSelectedModel}
        setChatbotType={setChatbotType}
        handleTrainContinue={handleTrainContinue}
      />

      {/* Chatbot UI Modal */}
      <AnimatePresence>
        {showChatbotUIModal && (
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
              className="bg-neutral-800 rounded-xl p-8 max-w-4xl w-full mx-4 border border-gray-700"
            >
              <h2 className="text-2xl font-bold mb-2">Chatbot UI</h2>
              <p className="text-gray-400 text-sm mb-6">
                Customize your chatbot appearance and see how it will look.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Form Inputs */}
                <div>
                  {/* Chatbot Name */}
                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-300">
                      Chatbot Name
                    </label>
                    <input
                      type="text"
                      value={chatbotName}
                      onChange={(e) => setChatbotName(e.target.value)}
                      placeholder="Enter chatbot name..."
                      className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Appearance Label */}
                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-300">
                      Appearance
                    </label>

                    {/* Primary Color */}
                    <div className="mb-3">
                      <label className="block mb-2 text-xs text-gray-400">
                        Primary Color
                      </label>
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
                    <div>
                      <label className="block mb-2 text-xs text-gray-400">
                        Profile Picture
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-neutral-700 border border-gray-600 overflow-hidden flex items-center justify-center">
                          {profilePreview ? (
                            <img
                              src={profilePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-500 text-xs">
                              No image
                            </span>
                          )}
                        </div>
                        <label className="flex-1 px-4 py-2 bg-neutral-700 rounded-lg border border-gray-600 cursor-pointer hover:bg-neutral-600 transition text-center text-sm">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Chatbot Preview */}
                <div className="bg-neutral-900 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Preview</h3>
                  <div className="bg-neutral-800 p-5 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {profilePreview ? (
                          <img
                            src={profilePreview}
                            alt="Chatbot"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white">
                            {chatbotName
                              ? chatbotName.charAt(0).toUpperCase()
                              : "?"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                          {chatbotName || "Untitled Chatbot"}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {chatbotType
                            ? `${chatbotType
                                .charAt(0)
                                .toUpperCase()}${chatbotType.slice(1)}`
                            : "General Purpose"}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                      <span className="text-xs px-3 py-1 rounded-full bg-green-600/20 text-green-400">
                        active
                      </span>
                      <span className="text-xs text-gray-400">0 chats</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    This is how your chatbot will appear in the list
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowChatbotUIModal(false)}
                  className="flex-1 px-4 py-3 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleDone}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

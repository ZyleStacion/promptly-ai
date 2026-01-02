/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardNavbar from "./DashboardNavbar.jsx";
import ModelsSection from "./ModelsSection.jsx";
import UsageSection from "./UsageSection.jsx";
import WorkspaceSettings from "./WorkspaceSettings.jsx";
import TrainingSourcesModal from "./TrainingSourcesModal.jsx";
import EditChatbotModal from "./EditChatbotModal.jsx";
import ChatInterface from "./ChatInterface.jsx";
import FeedbackButton from "../Feedback/FeedbackButton.jsx";
import Notification from "./Notification.jsx";

import { API_URL } from "../../api/api.js";
import api from '../../api/chatbot';

const isAuthenticated = () => !!localStorage.getItem("token");

// Helper function to read file as text
const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const feedbackRef = useRef(null);

  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("models"); // models, usage, settings
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showChatbotUIModal, setShowChatbotUIModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingChatbot, setEditingChatbot] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Training form state
  const [trainingFiles, setTrainingFiles] = useState([]);
  const [trainingText, setTrainingText] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [availableModels, setAvailableModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [chatbotType, setChatbotType] = useState("general");
  const [chatbotPersonality, setChatbotPersonality] = useState("friendly");

  // Chatbot UI form state
  const [chatbotName, setChatbotName] = useState("");
  const [description, setDescription] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [profileDeleted, setProfileDeleted] = useState(false);

  // Edit-specific training data state
  const [editingTrainingData, setEditingTrainingData] = useState([]);

  // Chat interface state
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [showChatInterface, setShowChatInterface] = useState(false);

  // 🔔 Notification
  const [notificationCount, setNotificationCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  useEffect(() => {
    if (!isAuthenticated()) navigate("/signin");

    // Check if user is admin
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(user.isAdmin || false);

    loadChatbots();
    loadOllamaModels();
    loadNotificationCount();

  }, []);


  // Prefill from workspace settings
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("workspaceSettings") || "{}");
    if (saved.welcomeMessage && !welcomeMessage) {
      setWelcomeMessage(saved.welcomeMessage);
    }
  }, []);

  const loadOllamaModels = async () => {
    try {
      setLoadingModels(true);
      const response = await fetch(`${API_URL}/chat/models`);
      const data = await response.json();

      if (data.success && data.models) {
        setAvailableModels(data.models);
        const saved = JSON.parse(localStorage.getItem("workspaceSettings") || "{}");
        const savedDefault = saved.defaultModel;
        if (savedDefault && data.models.some((m) => m.name === savedDefault)) {
          setSelectedModel(savedDefault);
        } else if (data.models.length > 0 && !selectedModel) {
          setSelectedModel(data.models[0].name);
        }
      }
    } catch (err) {
      console.error("Failed to load Ollama models:", err);
      // Fallback to a default model
      setAvailableModels([{ name: "gemma3:1b-it-qat", size: 0 }]);
      setSelectedModel("gemma3:1b-it-qat");
    } finally {
      setLoadingModels(false);
    }
  };

  const loadChatbots = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const resp = await api.getChatbots();
      setChatbots(resp.chatbots || []);
    } catch (error) {
      console.error("Error loading chatbots:", error);
      setError("Failed to load chatbots. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationCount = async () => {
    try {
      const res = await fetch(
        // Replace this with .env API path
        `${API_URL}/feedback/notifications/count`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setNotificationCount(data.count || 0);
    } catch (err) {
      console.error("Failed to load notifications", err);
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

  const handleDone = async () => {
    if (!chatbotName.trim()) {
      setError("Chatbot name is required");
      return;
    }

    try {
      setCreating(true);
      setError("");

      // Prepare training data
      let trainingData = [];

      // If editing and using editingTrainingData (from EditChatbotModal)
      if (editingChatbot && editingTrainingData.length > 0) {
        trainingData = editingTrainingData;
      } else {
        // Read and add file contents from trainingFiles
        for (const file of trainingFiles) {
          try {
            const fileContent = await readFileAsText(file);
            trainingData.push({
              type: "file",
              filename: file.name,
              content: fileContent,
            });
          } catch (err) {
            console.error(`Failed to read file ${file.name}:`, err);
            setError(`Failed to read file: ${file.name}`);
            setCreating(false);
            return;
          }
        }

        // Add text
        if (trainingText.trim()) {
          trainingData.push({
            type: "text",
            content: trainingText,
          });
        }
      }

      // Create chatbot payload
      const ws = JSON.parse(localStorage.getItem("workspaceSettings") || "{}");
      const systemPromptStr = ws.systemPrompt || `You are ${chatbotName}, a helpful AI assistant. Answer questions based on the provided information.`;
      const payload = {
        name: chatbotName,
        description: description || chatbotName,
        welcomeMessage: welcomeMessage || ws.welcomeMessage || `Hi! I'm ${chatbotName}. How can I help you today?`,
        businessName: chatbotName,
        businessDescription: description,
        chatbotType: chatbotType,
        modelName: selectedModel,
        systemPrompt: systemPromptStr,
        primaryColor,
        profilePicture: profilePreview || null,
        trainingData,
      };

      let response;
      if (editingChatbot) {
        // Update existing chatbot
        response = await api.updateChatbot(editingChatbot._id, payload);
      } else {
        // Create new chatbot
        response = await api.createChatbot(payload);
      }

      // If API call succeeded (helper throws on non-OK), refresh list and reset form
      await loadChatbots();

      // Reset forms
      setShowChatbotUIModal(false);
      setEditingChatbot(null);
      setEditingTrainingData([]);
      setTrainingFiles([]);
      setTrainingText("");
      setSelectedModel(availableModels.length > 0 ? availableModels[0].name : "");
      setChatbotType("general");
      setChatbotPersonality("friendly");
      setChatbotName("");
      setDescription("");
      setWelcomeMessage("");
      setPrimaryColor("#3B82F6");
      setProfilePicture(null);
      setProfilePreview("");
      setProfileDeleted(false);
    } catch (err) {
      console.error(`Error ${editingChatbot ? 'updating' : 'creating'} chatbot:`, err);
      setError(`Failed to ${editingChatbot ? 'update' : 'create'} chatbot. Please try again.`);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteChatbot = async (id) => {
    if (!window.confirm("Are you sure you want to delete this chatbot?")) {
      return;
    }

    try {
      await api.deleteChatbot(id);
      await loadChatbots();
    } catch (err) {
      console.error("Error deleting chatbot:", err);
      setError(err.message || "Failed to delete chatbot");
    }
  };

  const handleTestChatbot = (chatbot) => {
    setSelectedChatbot(chatbot);
    setShowChatInterface(true);
  };

  const handleEditChatbot = (chatbot) => {
    // Set editing state
    setEditingChatbot(chatbot);

    // Populate all form fields with existing chatbot data
    setChatbotName(chatbot.name || "");
    setDescription(chatbot.description || "");
    setWelcomeMessage(chatbot.welcomeMessage || "");
    setPrimaryColor(chatbot.primaryColor || "#3B82F6");
    setProfilePreview(chatbot.profilePicture || "");
    setProfileDeleted(false);
    setChatbotType(chatbot.chatbotType || "general");
    setChatbotPersonality(chatbot.personality || "friendly");
    setSelectedModel(chatbot.modelName || (availableModels.length > 0 ? availableModels[0].name : ""));

    // Use array-based training data for edit mode
    setEditingTrainingData(chatbot.trainingData || []);

    // Open edit modal
    setShowEditModal(true);
  };

  const handleCloseChatInterface = () => {
    setShowChatInterface(false);
    setSelectedChatbot(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardNavbar
        notificationCount={notificationCount}
        onFeedbackClick={() => feedbackRef.current?.openModal()}
        onMenuClick={() => setIsSidebarOpen(true)}
      />


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
              className={`w-full text-left px-4 py-3 rounded-lg transition ${activeSection === "models"
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
              className={`w-full text-left px-4 py-3 rounded-lg transition ${activeSection === "usage"
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
              className={`w-full text-left px-4 py-3 rounded-lg transition ${activeSection === "settings"
                ? "bg-gradient-to-r from-blue-600 to-violet-600 font-semibold"
                : "bg-neutral-700 hover:bg-neutral-600"
                }`}
            >
              Workspace setting
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveSection("notification");
                setNotificationCount(0);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${activeSection === "notification"
                ? "bg-gradient-to-r from-blue-600 to-violet-600 font-semibold"
                : "bg-neutral-700 hover:bg-neutral-600"
                }`}
            >
              Notification
              {notificationCount > 0 && (
                <span className="ml-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
                  {notificationCount}
                </span>
              )}
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
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-600/20 border border-red-600 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
          {activeSection === "models" && (
            <ModelsSection
              loading={loading}
              chatbots={chatbots}
              onCreateChatbot={() => setShowTrainingModal(true)}
              onDeleteChatbot={handleDeleteChatbot}
              onTestChatbot={handleTestChatbot}
              onEditChatbot={handleEditChatbot}
            />
          )}
          {activeSection === "usage" && <UsageSection chatbots={chatbots} />}
          {activeSection === "settings" && <WorkspaceSettings />}
          {activeSection === "notification" && (
            <Notification onViewed={() => setNotificationCount(0)} />
          )}

        </motion.div>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="w-64 h-full bg-neutral-900 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-3 pt-6">
                <MobileButton label="Models" onClick={() => setActiveSection("models")} />
                <MobileButton label="Usage" onClick={() => setActiveSection("usage")} />
                <MobileButton label="Workspace setting" onClick={() => setActiveSection("settings")} />
                <MobileButton
                  label={`Notification ${notificationCount > 0 ? `(${notificationCount})` : ""}`}
                  onClick={() => {
                    setActiveSection("notification");
                    setNotificationCount(0);
                  }}
                />
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <FeedbackButton ref={feedbackRef} />



      {/* Add Training Sources Modal */}
      <TrainingSourcesModal
        showTrainingModal={showTrainingModal}
        setShowTrainingModal={setShowTrainingModal}
        trainingFiles={trainingFiles}
        setTrainingFiles={setTrainingFiles}
        trainingText={trainingText}
        selectedModel={selectedModel}
        availableModels={availableModels}
        loadingModels={loadingModels}
        chatbotType={chatbotType}
        chatbotPersonality={chatbotPersonality}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        setTrainingText={setTrainingText}
        setSelectedModel={setSelectedModel}
        setChatbotType={setChatbotType}
        setChatbotPersonality={setChatbotPersonality}
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
                      Chatbot Name *
                    </label>
                    <input
                      type="text"
                      value={chatbotName}
                      onChange={(e) => setChatbotName(e.target.value)}
                      placeholder="Enter chatbot name..."
                      className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your chatbot..."
                      rows="3"
                      className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  {/* Welcome Message */}
                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-300">
                      Welcome Message
                    </label>
                    <textarea
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                      placeholder={`Hi! I'm ${chatbotName || 'your assistant'}. How can I help you today?`}
                      rows="2"
                      className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
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
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowChatbotUIModal(false);
                    // If editing, also clear editing state and reset forms
                    if (editingChatbot) {
                      setEditingChatbot(null);
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition disabled:opacity-50"
                  disabled={creating}
                >
                  Back
                </button>
                <button
                  onClick={handleDone}
                  disabled={creating || !chatbotName.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {creating ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Chatbot Modal */}
      {showEditModal && editingChatbot && (
        <EditChatbotModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingChatbot(null); }}
          chatbot={editingChatbot}
          chatbotName={chatbotName}
          setChatbotName={setChatbotName}
          description={description}
          setDescription={setDescription}
          welcomeMessage={welcomeMessage}
          setWelcomeMessage={setWelcomeMessage}
          primaryColor={primaryColor}
          setPrimaryColor={setPrimaryColor}
          chatbotType={chatbotType}
          setChatbotType={setChatbotType}
          chatbotPersonality={chatbotPersonality}
          setChatbotPersonality={setChatbotPersonality}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          profilePreview={profilePreview}
          onUploadProfile={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setProfilePreview(reader.result);
                setProfileDeleted(false);
              };
              reader.readAsDataURL(file);
            }
          }}
          onDeleteProfile={() => { setProfilePreview(""); setProfileDeleted(true); }}
          availableModels={availableModels}
          editingTrainingData={editingTrainingData}
          onRemoveTrainingItem={(idx) => {
            setEditingTrainingData((prev) => prev.filter((_, i) => i !== idx));
          }}
          onAddFiles={async (files) => {
            for (const file of files) {
              const content = await readFileAsText(file);
              setEditingTrainingData((prev) => [...prev, { type: "file", filename: file.name, content }]);
            }
          }}
          onAddText={(text) => {
            const t = (text || "").trim();
            if (t) setEditingTrainingData((prev) => [...prev, { type: "text", content: t }]);
          }}
          onSave={async () => {
            if (!chatbotName.trim()) return;
            try {
              setCreating(true);
              const ws = JSON.parse(localStorage.getItem("workspaceSettings") || "{}");
              const systemPromptStr = ws.systemPrompt || `You are ${chatbotName}, a helpful AI assistant. Answer questions based on the provided information.`;
              const payload = {
                name: chatbotName,
                description: description || chatbotName,
                welcomeMessage: welcomeMessage || ws.welcomeMessage || `Hi! I'm ${chatbotName}. How can I help you today?`,
                businessName: chatbotName,
                businessDescription: description,
                chatbotType: chatbotType,
                modelName: selectedModel,
                systemPrompt: systemPromptStr,
                primaryColor,
                profilePicture: profileDeleted ? null : (profilePreview || null),
                trainingData: editingTrainingData,
              };
              await api.updateChatbot(editingChatbot._id, payload);
              await loadChatbots();
              setShowEditModal(false);
              setEditingChatbot(null);
              setEditingTrainingData([]);
              setProfilePreview("");
              setProfileDeleted(false);
              setChatbotName("");
              setDescription("");
              setWelcomeMessage("");
              setSelectedModel(availableModels.length > 0 ? availableModels[0].name : "");
              setChatbotType("general");
              setChatbotPersonality("friendly");
              setPrimaryColor("#3B82F6");
            } finally {
              setCreating(false);
            }
          }}
          saving={creating}
        />
      )}

      {/* Chat Interface Modal */}
      {showChatInterface && selectedChatbot && (
        <ChatInterface
          chatbot={selectedChatbot}
          onClose={handleCloseChatInterface}
          apiUrl={import.meta.env.VITE_API_URL || "http://localhost:3000"}
        />
      )}
    </div>
  );
};

export default Dashboard;
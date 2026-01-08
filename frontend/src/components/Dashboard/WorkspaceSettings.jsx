import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";
import { API_URL } from '../../api/api';

const WorkspaceSettings = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.isAdmin === true;

  const navigate = useNavigate();

  const settingsOptions = [
    !isAdmin && {
      title: "Plans",
      description: "Manage and upgrade your Promptly AI plan",
      path: "/dashboard/plans",
    },
    !isAdmin && {
      title: "Billing",
      description: "View your billing history",
      path: "/dashboard/billing",
    },
  ].filter(Boolean);

  const [availableModels, setAvailableModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  // Creation defaults
  const [defaultModel, setDefaultModel] = useState("");
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [streamingDefault, setStreamingDefault] = useState(true);
  const [markdownDefault, setMarkdownDefault] = useState(true);

  // Personality & prompts
  const [personality, setPersonality] = useState("friendly");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant."
  );
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hi! How can I help you today?"
  );

  // Training & indexing
  const [maxFileSizeMB, setMaxFileSizeMB] = useState(5);
  const [allowedTypes, setAllowedTypes] = useState(".txt,.md");
  const [chunkSize, setChunkSize] = useState(800);
  const [chunkOverlap, setChunkOverlap] = useState(200);

  // Enabled models
  const [enabledModels, setEnabledModels] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("workspaceSettings") || "{}");
    if (saved.defaultModel) setDefaultModel(saved.defaultModel);
    if (saved.temperature !== undefined) setTemperature(saved.temperature);
    if (saved.maxTokens !== undefined) setMaxTokens(saved.maxTokens);
    if (saved.streamingDefault !== undefined)
      setStreamingDefault(saved.streamingDefault);
    if (saved.markdownDefault !== undefined)
      setMarkdownDefault(saved.markdownDefault);
    if (saved.personality) setPersonality(saved.personality);
    if (saved.systemPrompt) setSystemPrompt(saved.systemPrompt);
    if (saved.welcomeMessage) setWelcomeMessage(saved.welcomeMessage);
    if (saved.maxFileSizeMB !== undefined)
      setMaxFileSizeMB(saved.maxFileSizeMB);
    if (saved.allowedTypes) setAllowedTypes(saved.allowedTypes);
    if (saved.chunkSize !== undefined) setChunkSize(saved.chunkSize);
    if (saved.chunkOverlap !== undefined) setChunkOverlap(saved.chunkOverlap);
    if (Array.isArray(saved.enabledModels))
      setEnabledModels(saved.enabledModels);
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingModels(true);
        const res = await fetch(`${API_URL}/chat/models`);
        const data = await res.json();
        if (data.success && data.models) {
          setAvailableModels(data.models);
          if (!defaultModel && data.models.length > 0) {
            setDefaultModel(data.models[0].name);
          }
          if (enabledModels.length === 0) {
            setEnabledModels(data.models.map((m) => m.name));
          }
        }
      } catch (e) {
        console.error("Failed to load models:", e);
      } finally {
        setLoadingModels(false);
      }
    };
    loadModels();
  }, []);

  const saveSettings = () => {
    const payload = {
      defaultModel,
      temperature,
      maxTokens,
      streamingDefault,
      markdownDefault,
      personality,
      systemPrompt,
      welcomeMessage,
      maxFileSizeMB,
      allowedTypes,
      chunkSize,
      chunkOverlap,
      enabledModels,
    };
    localStorage.setItem("workspaceSettings", JSON.stringify(payload));
    alert("Workspace model creation settings saved.");
  };

  const exportSettings = () => {
    const text = localStorage.getItem("workspaceSettings") || "{}";
    navigator.clipboard.writeText(text);
    alert("Settings JSON copied to clipboard.");
  };

  const toggleModel = (name) => {
    setEnabledModels((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold mb-6 text-white dark:text-gray-900"
      >
        Workspace Settings
      </motion.h2>
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-neutral-800 dark:bg-white border border-gray-700 dark:border-gray-200 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-2 text-white dark:text-gray-900">
            Admin Account
          </h3>
          <p className="text-gray-400 dark:text-gray-600 text-sm">
            Subscription plans and billing are disabled for admin accounts. You
            have unlimited access to all features.
          </p>
        </motion.div>
      )}

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
            onClick={() => {
              if (isAdmin) return;
              option.path && navigate(option.path);
            }}
            className="bg-neutral-800 dark:bg-white p-5 rounded-xl border border-gray-700 dark:border-gray-200 hover:border-gray-600 dark:hover:border-gray-300 transition cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-white dark:text-gray-900">
              {option.title}
            </h3>
            <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">
              {option.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceSettings;

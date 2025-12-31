import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";

const WorkspaceSettings = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate();

  const settingsOptions = [
    { title: "Plans", description: "Manage and upgrade your Promptly AI plan", path: "/dashboard/plans" },
    { title: "Billing", description: "View your billing history", path: "/dashboard/billing" },
  ];
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
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant.");
  const [welcomeMessage, setWelcomeMessage] = useState("Hi! How can I help you today?");

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
    if (saved.streamingDefault !== undefined) setStreamingDefault(saved.streamingDefault);
    if (saved.markdownDefault !== undefined) setMarkdownDefault(saved.markdownDefault);
    if (saved.personality) setPersonality(saved.personality);
    if (saved.systemPrompt) setSystemPrompt(saved.systemPrompt);
    if (saved.welcomeMessage) setWelcomeMessage(saved.welcomeMessage);
    if (saved.maxFileSizeMB !== undefined) setMaxFileSizeMB(saved.maxFileSizeMB);
    if (saved.allowedTypes) setAllowedTypes(saved.allowedTypes);
    if (saved.chunkSize !== undefined) setChunkSize(saved.chunkSize);
    if (saved.chunkOverlap !== undefined) setChunkOverlap(saved.chunkOverlap);
    if (Array.isArray(saved.enabledModels)) setEnabledModels(saved.enabledModels);
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingModels(true);
        const res = await fetch(`${apiUrl}/chat/models`);
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
        className="text-2xl font-bold mb-6"
      >
        Workspace Settings
      </motion.h2>

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
            onClick={() => option.path && navigate(option.path)}
            className="bg-neutral-800 p-5 rounded-xl border border-gray-700 hover:border-gray-600 transition cursor-pointer"
          >
            <h3 className="text-lg font-semibold">{option.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{option.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Chatbot Model Creation Settings */}
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold mb-6 pt-6"
      >
        Chatbot Model Creation Settings
      </motion.h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Defaults */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-neutral-800 p-5 rounded-xl border border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-3">Model Defaults</h3>
          <div className="space-y-3">
            <label className="block text-sm text-gray-300">Default Model</label>
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              disabled={loadingModels}
              className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white"
            >
              {availableModels.map((m) => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>

            <label className="block text-sm text-gray-300 mt-3">Temperature ({temperature})</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full"
            />

            <label className="block text-sm text-gray-300 mt-3">Max Tokens</label>
            <input
              type="number"
              min={128}
              max={4096}
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white"
            />

            <div className="flex items-center gap-3 mt-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={streamingDefault} onChange={(e) => setStreamingDefault(e.target.checked)} />
                Enable Streaming by Default
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={markdownDefault} onChange={(e) => setMarkdownDefault(e.target.checked)} />
                Markdown Formatting by Default
              </label>
            </div>
          </div>
        </motion.div>

        {/* Personality & Prompts */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-neutral-800 p-5 rounded-xl border border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-3">Personality & Prompts</h3>
          <div className="space-y-3">
            <label className="block text-sm text-gray-300">Default Personality</label>
            <select
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white"
            >
              <option value="friendly">Warm and Friendly</option>
              <option value="professional">Professional</option>
              <option value="support">Warm and Concise</option>
              <option value="sales">Short and Direct</option>
            </select>

            <label className="block text-sm text-gray-300">System Prompt Template</label>
            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white resize-none"
            />

            <label className="block text-sm text-gray-300">Default Welcome Message</label>
            <input
              type="text"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white"
            />
          </div>
        </motion.div>

        {/* Training & Indexing */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-neutral-800 p-5 rounded-xl border border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-3">Training & Indexing Defaults</h3>
          <div className="space-y-3">
            <label className="block text-sm text-gray-300">Max File Size (MB)</label>
            <input
              type="number"
              min={1}
              max={50}
              value={maxFileSizeMB}
              onChange={(e) => setMaxFileSizeMB(Number(e.target.value))}
              className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white"
            />

            <label className="block text-sm text-gray-300">Allowed File Types (comma)</label>
            <input
              type="text"
              value={allowedTypes}
              onChange={(e) => setAllowedTypes(e.target.value)}
              className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-300">Chunk Size</label>
                <input
                  type="number"
                  min={200}
                  max={2000}
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300">Chunk Overlap</label>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={chunkOverlap}
                  onChange={(e) => setChunkOverlap(Number(e.target.value))}
                  className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enable/Disable Models */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-neutral-800 p-5 rounded-xl border border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-3">Enabled Models</h3>
          <div className="space-y-2">
            {availableModels.map((m) => (
              <label key={m.name} className="flex items-center justify-between bg-neutral-900 rounded p-3 border border-gray-700">
                <span className="text-sm text-white">{m.name}</span>
                <input
                  type="checkbox"
                  checked={enabledModels.includes(m.name)}
                  onChange={() => toggleModel(m.name)}
                />
              </label>
            ))}
            {availableModels.length === 0 && (
              <p className="text-sm text-gray-400">No models available. Ensure Ollama is running.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button onClick={saveSettings} className="px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg font-semibold hover:opacity-90 transition">Save Settings</button>
        <button onClick={exportSettings} className="px-4 py-3 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition flex items-center gap-2">
          <Copy className="w-4 h-4" /> Export JSON
        </button>
      </div>
    </div>
  );
};

export default WorkspaceSettings;

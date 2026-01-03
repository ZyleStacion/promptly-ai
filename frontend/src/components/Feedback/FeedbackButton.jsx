import React, { useState, forwardRef, useImperativeHandle } from "react";
import { AnimatePresence } from "framer-motion";
import { Bug, X, Upload } from "lucide-react";
import { API_URL } from "../../api/api";

const FeedbackButton = forwardRef((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [bugDescription, setBugDescription] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal: () => setIsModalOpen(true),
  }));

  const bugLabels = [
    "UI/UX Issue",
    "Performance",
    "Functionality",
    "Security",
    "Documentation",
    "Integration",
    "API",
    "Authentication",
    "Other",
  ];

  const handleLabelToggle = (label) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScreenshot(file);
    const reader = new FileReader();
    reader.onloadend = () => setScreenshotPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!bugDescription.trim()) return;

    const token = localStorage.getItem("token");

    // 🔴 NOT LOGGED IN → show login popup
    if (!token) {
      setIsModalOpen(false);
      setShowLoginPrompt(true);
      return;
    }

    const formData = new FormData();
    formData.append("description", bugDescription);
    formData.append("labels", JSON.stringify(selectedLabels));
    if (screenshot) formData.append("screenshot", screenshot);

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error();

      handleClose();
    } catch (err) {
      console.error("Feedback error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setBugDescription("");
    setSelectedLabels([]);
    setScreenshot(null);
    setScreenshotPreview(null);
  };

  return (
    <>
      {/* ================= FEEDBACK BUTTON ================= */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="hidden md:flex fixed right-0 top-[60%]
        bg-gradient-to-b from-purple-600 to-blue-600
        text-white px-3 py-6 rounded-l-lg shadow-lg z-50
        items-center gap-2"
        style={{ writingMode: "vertical-rl" }}
      >
        <Bug className="w-5 h-5 rotate-90" />
        <span className="font-semibold text-sm tracking-wider">FEEDBACK</span>
      </button>

      {/* ================= FEEDBACK MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <div
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 z-50"
            />

            <div
              className="fixed top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              bg-neutral-800 dark:bg-white
              rounded-xl shadow-2xl z-50
              w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-50 rounded-lg">
                      <Bug className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-white dark:text-gray-900">
                      Report an Issue
                    </h2>
                  </div>
                  <button onClick={handleClose}>
                    <X className="text-white dark:text-gray-900" />
                  </button>
                </div>

                {/* Description */}
                <textarea
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  rows="6"
                  placeholder="Describe the issue..."
                  className="w-full p-3 rounded border bg-neutral-700 dark:bg-gray-100 border-gray-600 dark:border-gray-300 text-white dark:text-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500 mb-6"
                />

                {/* Labels */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {bugLabels.map((label) => (
                    <button
                      key={label}
                      onClick={() => handleLabelToggle(label)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        selectedLabels.includes(label)
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 dark:bg-gray-100 text-gray-700 dark:text-gray-900"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Upload */}
                <label className="flex items-center gap-2 mb-4 cursor-pointer text-white dark:text-gray-900">
                  <Upload />
                  <span>Upload Screenshot</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleScreenshotUpload}
                  />
                </label>

                {screenshotPreview && (
                  <img
                    src={screenshotPreview}
                    className="max-h-40 rounded mb-4 border border-gray-600 dark:border-gray-300"
                    alt="preview"
                  />
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600
                  py-3 rounded text-white font-semibold hover:opacity-90 transition"
                >
                  {loading ? "Sending..." : "Send Feedback"}
                </button>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ================= LOGIN REQUIRED POPUP ================= */}
      <AnimatePresence>
        {showLoginPrompt && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowLoginPrompt(false)}
            />

            <div
              className="fixed top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              bg-neutral-800 dark:bg-white
              rounded-xl shadow-2xl z-50
              w-full max-w-sm p-6 text-center"
            >
              <h3 className="text-xl font-bold text-white dark:text-gray-900 mb-2">
                Login Required
              </h3>

              <p className="text-gray-400 dark:text-gray-600 mb-6">
                You must be logged in to report an issue.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 py-2 rounded bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-600 dark:hover:bg-gray-300 transition"
                >
                  Cancel
                </button>

                <a
                  href="/signin"
                  className="flex-1 py-2 rounded
                  bg-purple-600 text-white font-semibold hover:opacity-90 transition"
                >
                  Go to Login
                </a>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

FeedbackButton.displayName = "FeedbackButton";
export default FeedbackButton;

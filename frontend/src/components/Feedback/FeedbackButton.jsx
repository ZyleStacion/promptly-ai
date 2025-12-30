import React, { useState, forwardRef, useImperativeHandle } from "react";
import { AnimatePresence } from "framer-motion";
import { Bug, X, Upload, Send } from "lucide-react";

const FeedbackButton = forwardRef((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bugDescription, setBugDescription] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  // Expose openModal to parent components
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
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!bugDescription.trim()) {
      alert("Please describe the bug");
      return;
    }

    // Here you would send the feedback to your backend
    const formData = new FormData();
    formData.append("description", bugDescription);
    formData.append("labels", JSON.stringify(selectedLabels));
    if (screenshot) {
      formData.append("screenshot", screenshot);
    }

    try {
      // TODO: Replace with your actual API endpoint
      // await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: formData
      // });

      alert("Feedback submitted successfully!");
      handleClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
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
      {/* Vertical Feedback Button - Hidden on mobile */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="hidden md:flex fixed right-0 top-[60%] bg-gradient-to-b from-purple-600 to-blue-600 text-white px-3 py-6 rounded-l-lg shadow-lg hover:shadow-xl transition-shadow duration-300 z-50 items-center gap-2"
        style={{ writingMode: "vertical-rl" }}
      >
        <Bug className="w-5 h-5" style={{ transform: "rotate(90deg)" }} />
        <span className="font-semibold text-sm tracking-wider">FEEDBACK</span>
      </button>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={handleClose}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />

            {/* Modal Card */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Bug className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Report a Bug
                    </h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Bug Description */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Describe the bug *
                  </label>
                  <textarea
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    placeholder="Please provide detailed information about the bug you encountered..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    rows="6"
                  />
                </div>

                {/* Labels */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Add a label
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {bugLabels.map((label) => (
                      <button
                        key={label}
                        onClick={() => handleLabelToggle(label)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedLabels.includes(label)
                            ? "bg-purple-600 text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Screenshot Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Upload Screenshot (optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors">
                      <Upload className="w-5 h-5" />
                      <span className="text-sm font-medium">Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                      />
                    </label>
                    {screenshot && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {screenshot.name}
                      </span>
                    )}
                  </div>
                  {screenshotPreview && (
                    <div className="mt-3 relative inline-block">
                      <img
                        src={screenshotPreview}
                        alt="Screenshot preview"
                        className="max-w-full h-auto max-h-48 rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        onClick={() => {
                          setScreenshot(null);
                          setScreenshotPreview(null);
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <Send className="w-5 h-5" />
                  Send Feedback
                </button>
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

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef } from "react";

const TextSnippetModal = ({ isOpen, onClose, onAddSnippet }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [textFormat, setTextFormat] = useState("normal");
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const textareaRef = useRef(null);

  const formatOptions = [
    { value: "normal", label: "Normal Text" },
    { value: "h1", label: "Heading 1" },
    { value: "h2", label: "Heading 2" },
    { value: "h3", label: "Heading 3" },
  ];

  const applyFormat = (format) => {
    const editor = textareaRef.current;
    if (!editor) return;

    editor.focus();

    try {
      switch (format) {
        case "bold":
          document.execCommand("bold", false, null);
          break;
        case "italic":
          document.execCommand("italic", false, null);
          break;
        case "underline":
          document.execCommand("underline", false, null);
          break;
        case "orderedList":
          document.execCommand("insertOrderedList", false, null);
          break;
        case "bulletList":
          document.execCommand("insertUnorderedList", false, null);
          break;
        default:
          break;
      }
      // Update content state
      setContent(editor.innerHTML);
    } catch (error) {
      console.error("Format command failed:", error);
    }
  };

  const insertLink = () => {
    if (!linkText || !linkUrl) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    const link = `<a href="${linkUrl}" target="_blank">${linkText}</a>`;
    document.execCommand("insertHTML", false, link);

    setLinkText("");
    setLinkUrl("");
    setShowLinkModal(false);
  };

  const applyHeading = (headingType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();

    switch (headingType) {
      case "h1":
        document.execCommand("formatBlock", false, "h1");
        break;
      case "h2":
        document.execCommand("formatBlock", false, "h2");
        break;
      case "h3":
        document.execCommand("formatBlock", false, "h3");
        break;
      case "normal":
        document.execCommand("formatBlock", false, "p");
        break;
      default:
        break;
    }
  };

  const handleAddSnippet = () => {
    const textarea = textareaRef.current;
    if (!title.trim() || !textarea || !textarea.innerHTML.trim()) return;

    onAddSnippet({
      title,
      content: textarea.innerHTML,
      format: textFormat,
      timestamp: Date.now(),
    });

    // Reset form
    setTitle("");
    if (textarea) {
      textarea.innerHTML = "";
    }
    setContent("");
    setTextFormat("normal");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-neutral-800 rounded-xl p-6 max-w-3xl w-full mx-4 border border-gray-700 max-h-[85vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6">Text</h2>

            {/* Add Snippet Section */}
            <div className="bg-neutral-900 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Add snippet</h3>

              {/* Title Input */}
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter snippet title..."
                  className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* main area snippet */}

              {/* Toolbar */}
              <div className="mb-2 flex items-center gap-2 p-2 bg-neutral-800 rounded-lg border border-gray-600 flex-wrap">
                {/* Text Format Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowFormatMenu(!showFormatMenu)}
                    className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded border border-gray-600 flex items-center gap-1 text-sm"
                    type="button"
                  >
                    <span className="font-semibold">T</span>
                    <span className="text-xs">▼</span>
                  </button>
                  <AnimatePresence>
                    {showFormatMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-1 bg-neutral-700 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]"
                      >
                        {formatOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              applyHeading(option.value);
                              setTextFormat(option.value);
                              setShowFormatMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-neutral-600 first:rounded-t-lg last:rounded-b-lg text-sm"
                            type="button"
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bold, Italic, Underline Group */}
                <div className="flex items-center gap-1 border-l border-gray-600 pl-2">
                  <button
                    onClick={() => applyFormat("bold")}
                    className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded border border-gray-600 font-bold text-sm"
                    title="Bold"
                    type="button"
                  >
                    B
                  </button>
                  <button
                    onClick={() => applyFormat("italic")}
                    className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded border border-gray-600 italic text-sm"
                    title="Italic"
                    type="button"
                  >
                    I
                  </button>
                  <button
                    onClick={() => applyFormat("underline")}
                    className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded border border-gray-600 underline text-sm"
                    title="Underline"
                    type="button"
                  >
                    U
                  </button>
                </div>

                {/* List Group */}
                <div className="flex items-center gap-1 border-l border-gray-600 pl-2">
                  <button
                    onClick={() => applyFormat("orderedList")}
                    className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded border border-gray-600 text-sm"
                    title="Ordered List"
                    type="button"
                  >
                    1.
                  </button>
                  <button
                    onClick={() => applyFormat("bulletList")}
                    className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded border border-gray-600 text-sm"
                    title="Bullet List"
                    type="button"
                  >
                    •
                  </button>
                </div>

                {/* Link Button */}
                <div className="border-l border-gray-600 pl-2">
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded border border-gray-600 text-sm"
                    title="Add Link"
                    type="button"
                  >
                    🔗
                  </button>
                </div>
              </div>

              {/* Text Content Area */}
              <div className="mb-4">
                <div
                  ref={textareaRef}
                  contentEditable
                  onInput={(e) => setContent(e.currentTarget.innerHTML)}
                  placeholder="Enter your text here..."
                  className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-[300px] text-sm resize-none overflow-y-auto"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                  suppressContentEditableWarning={true}
                />
              </div>

              {/* Add Text Snippet Button */}
              <button
                onClick={handleAddSnippet}
                disabled={!title.trim() || !content.trim()}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Text Snippet
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full mt-4 px-4 py-3 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition"
            >
              Close
            </button>
          </motion.div>

          {/* Link Modal */}
          <AnimatePresence>
            {showLinkModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]"
                onClick={() => setShowLinkModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-neutral-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold mb-4">Add Link</h3>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-300">
                      Link Text
                    </label>
                    <input
                      type="text"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="Enter link text..."
                      className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-300">
                      URL
                    </label>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-neutral-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowLinkModal(false)}
                      className="flex-1 px-4 py-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={insertLink}
                      disabled={!linkText.trim() || !linkUrl.trim()}
                      className="flex-1 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Insert
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TextSnippetModal;

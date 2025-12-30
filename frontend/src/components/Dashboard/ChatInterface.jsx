/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const ChatInterface = ({ chatbot, onClose, apiUrl }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    const welcomeMsg = chatbot.welcomeMessage 
      || `Hi! I'm ${chatbot.name}. How can I help you today?`;
    
    setMessages([
      {
        id: Date.now() + Math.random(),
        role: "bot",
        content: welcomeMsg,
      },
    ]);
  }, [chatbot]);

  const formatBotContent = (content, role) => {
    if (role === "user") {
      // show user input as plain text with preserved breaks
      const s = String(content);
      return DOMPurify.sanitize(s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\n', '<br>'));
    }
    try {
      marked.setOptions({ gfm: true, breaks: true });
      const html = marked.parse(String(content ?? ""));
      const safe = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
      return safe;
    } catch {
      return DOMPurify.sanitize(String(content ?? ""));
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now() + Math.random(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/chat/public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          chatbotId: chatbot._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = { id: Date.now() + Math.random(), role: "bot", content: "" };

      setMessages((prev) => [...prev, botMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.trim().split("\n");

        for (const line of lines) {
          if (!line.startsWith("{")) continue;

          try {
            const json = JSON.parse(line);
            if (json.response) {
              botMessage.content += json.response;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...botMessage };
                return updated;
              });
            }
          } catch (err) {
            console.warn("Skipping invalid JSON line:", line);
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "⚠️ Error: Could not connect to the chatbot server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
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
          className="bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col overflow-hidden border border-gray-700"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b border-gray-700"
            style={{ backgroundColor: `${chatbot.primaryColor}15` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
                style={{ backgroundColor: chatbot.primaryColor }}
              >
                {chatbot.profilePicture ? (
                  <img
                    src={chatbot.profilePicture}
                    alt={chatbot.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{chatbot.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{chatbot.name}</h2>
                <p className="text-sm text-gray-400">
                  {chatbot.chatbotType || "General Purpose"} • Active
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-950">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                      : "bg-neutral-800 text-gray-100 border border-gray-700"
                  }`}
                  style={
                    msg.role === "bot" && chatbot.primaryColor
                      ? { borderColor: `${chatbot.primaryColor}40` }
                      : {}
                  }
                >
                  {msg.role === "bot" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white overflow-hidden"
                        style={{ backgroundColor: chatbot.primaryColor }}
                      >
                        {chatbot.profilePicture ? (
                          <img
                            src={chatbot.profilePicture}
                            alt={chatbot.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          chatbot.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-xs font-semibold text-gray-400">
                        {chatbot.name}
                      </span>
                    </div>
                  )}
                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatBotContent(msg.content, msg.role) }}
                  />
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 rounded-2xl px-4 py-3 border border-gray-700 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-400">
                    {chatbot.name} is typing...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700 bg-neutral-900">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${chatbot.name}...`}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-neutral-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                style={
                  !loading && input.trim()
                    ? { background: chatbot.primaryColor }
                    : {}
                }
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Testing mode • Responses are powered by Ollama
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatInterface;

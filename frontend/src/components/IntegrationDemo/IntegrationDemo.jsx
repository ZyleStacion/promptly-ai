/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import ChatbotWidget from '../Chatbot/ChatbotWidget';

const IntegrationDemo = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            Integrate Promptly Chatbot in React
          </h1>
          <p className="text-gray-400 text-lg">
            See a working example below! The chatbot appears in the bottom-right corner.
          </p>
        </motion.div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Static HTML Example */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-blue-400">
              📄 Static HTML
            </h2>
            <div className="bg-gray-900 rounded p-4 overflow-x-auto text-sm">
              <pre className="text-gray-300">
{`<!-- Add to your HTML file -->
<div data-promptly-chatbot-id="YOUR_CHATBOT_ID"></div>
<script>
  window.PROMPTLY_API_URL = 
    'http://localhost:3000';
</script>
<script src=
  "http://localhost:5173/promptly-widget.js">
</script>`}
              </pre>
            </div>
            <p className="text-gray-400 text-xs mt-3">
              ✅ Works on any website
              <br/>✅ No dependencies
            </p>
          </div>

          {/* React Example */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-purple-400">
              ⚛️ React Component
            </h2>
            <div className="bg-gray-900 rounded p-4 overflow-x-auto text-sm">
              <pre className="text-gray-300">
{`// Import component
import ChatbotWidget 
  from './components/Chatbot/ChatbotWidget';

// Use in your component
<ChatbotWidget 
  chatbotId="YOUR_CHATBOT_ID"
/>

// Or with custom API URL
<ChatbotWidget 
  chatbotId="YOUR_CHATBOT_ID"
  apiUrl="https://your-api.com"
/>`}
              </pre>
            </div>
            <p className="text-gray-400 text-xs mt-3">
              ✅ Works in React apps
              <br/>✅ Reusable component
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-bold mb-2">Easy Setup</h3>
            <p className="text-sm text-gray-200">
              Just a few lines of code to get started
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-bold mb-2">Customizable</h3>
            <p className="text-sm text-gray-200">
              Match your brand colors and style
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-lg p-6">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-bold mb-2">Responsive</h3>
            <p className="text-sm text-gray-200">
              Works on mobile, tablet, and desktop
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-bold mb-2">Lightning Fast</h3>
            <p className="text-sm text-gray-200">
              Powered by Ollama AI models
            </p>
          </div>
        </motion.div>

        {/* Integration Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Integration Steps</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 flex-shrink-0">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h3 className="font-bold mb-2">Create a Chatbot</h3>
                <p className="text-gray-400">
                  Go to Dashboard → Create Chatbot → Upload training files → Select model → Done
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 flex-shrink-0">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h3 className="font-bold mb-2">Get Chatbot ID</h3>
                <p className="text-gray-400">
                  Click "Get Embed Code" in your chatbot menu to copy the chatbot ID
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 flex-shrink-0">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="font-bold mb-2">Add to Your Website</h3>
                <p className="text-gray-400">
                  Paste the code snippet into your HTML or React component
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 flex-shrink-0">
                <span className="font-bold">4</span>
              </div>
              <div>
                <h3 className="font-bold mb-2">Test It</h3>
                <p className="text-gray-400">
                  Look for the chat button in bottom-right corner and test the chatbot
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Props Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-800 rounded-lg p-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-6">ChatbotWidget Props</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-900 rounded p-4">
              <div className="font-mono text-sm mb-2">
                <span className="text-green-400">chatbotId</span>
                <span className="text-gray-400">: string (required)</span>
              </div>
              <p className="text-gray-400 text-sm">
                The ID of your chatbot from the Promptly dashboard
              </p>
            </div>

            <div className="bg-gray-900 rounded p-4">
              <div className="font-mono text-sm mb-2">
                <span className="text-green-400">apiUrl</span>
                <span className="text-gray-400">: string (optional)</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your backend API URL. Default: <code>http://localhost:3000</code>
              </p>
            </div>

            <div className="bg-gray-900 rounded p-4">
              <div className="font-mono text-sm mb-2">
                <span className="text-green-400">widgetScript</span>
                <span className="text-gray-400">: string (optional)</span>
              </div>
              <p className="text-gray-400 text-sm">
                Widget script URL. Default: <code>http://localhost:5173/promptly-widget.js</code>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Example Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-gray-400 text-sm"
        >
          <p>👇 See a working example below!</p>
          <p className="text-xs mt-2">The chatbot widget appears in the bottom-right corner</p>
        </motion.div>
      </div>

      {/* Live Demo - Chatbot Widget */}
      <ChatbotWidget chatbotId="chatbot-1766958224299" />
    </div>
  );
};

export default IntegrationDemo;

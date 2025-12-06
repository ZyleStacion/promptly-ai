import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Documentation
            </h1>
            <p className="text-gray-400 text-lg">
              Learn how to integrate and use Promptly AI chatbots in your applications
            </p>
          </div>

          {/* Getting Started */}
          <section className="mb-12 bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Getting Started</h2>
            <p className="text-gray-300 mb-4">
              Welcome to Promptly AI! This guide will help you set up and integrate our AI chatbot into your application.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Create an account and sign in</li>
              <li>Navigate to your dashboard</li>
              <li>Create a new chatbot with your business information</li>
              <li>Train your chatbot with custom data</li>
              <li>Integrate the chatbot into your website</li>
            </ol>
          </section>

          {/* API Reference */}
          <section className="mb-12 bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">API Reference</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Authentication</h3>
              <p className="text-gray-300 mb-2">All API requests require authentication using a Bearer token.</p>
              <div className="bg-gray-900 p-4 rounded-md overflow-x-auto">
                <code className="text-green-400 text-sm">
                  Authorization: Bearer YOUR_API_TOKEN
                </code>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Create Chatbot</h3>
              <p className="text-gray-300 mb-2">POST /api/chatbot</p>
              <div className="bg-gray-900 p-4 rounded-md overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`{
  "businessName": "Your Business",
  "businessDescription": "Description",
  "systemPrompt": "Your prompt",
  "personality": "Friendly and helpful",
  "modelName": "llama3"
}`}
                </pre>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Chat Endpoint</h3>
              <p className="text-gray-300 mb-2">POST /api/ollama/chat</p>
              <div className="bg-gray-900 p-4 rounded-md overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`{
  "model": "llama3",
  "prompt": "Your message here"
}`}
                </pre>
              </div>
            </div>
          </section>

          {/* Integration Guide */}
          <section className="mb-12 bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Integration Guide</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">JavaScript Integration</h3>
              <p className="text-gray-300 mb-2">Add this code to your website:</p>
              <div className="bg-gray-900 p-4 rounded-md overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`<script>
  // Initialize Promptly AI Chatbot
  (function() {
    const chatbot = document.createElement('div');
    chatbot.id = 'promptly-chatbot';
    document.body.appendChild(chatbot);
    
    const script = document.createElement('script');
    script.src = 'https://cdn.promptly-ai.com/chatbot.js';
    script.setAttribute('data-chatbot-id', 'YOUR_CHATBOT_ID');
    document.body.appendChild(script);
  })();
</script>`}
                </pre>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">React Integration</h3>
              <div className="bg-gray-900 p-4 rounded-md overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Load Promptly AI Chatbot
    const script = document.createElement('script');
    script.src = 'https://cdn.promptly-ai.com/chatbot.js';
    script.setAttribute('data-chatbot-id', 'YOUR_CHATBOT_ID');
    document.body.appendChild(script);
  }, []);

  return <div>Your App</div>;
}`}
                </pre>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-12 bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">FAQs</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How do I get my API token?</h3>
                <p className="text-gray-300">
                  Navigate to your dashboard and go to Settings. Your API token will be displayed in the API section.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What models are available?</h3>
                <p className="text-gray-300">
                  We currently support Llama3 and other Ollama-compatible models. More models are being added regularly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Can I customize the chatbot appearance?</h3>
                <p className="text-gray-300">
                  Yes! You can customize colors, position, and behavior through the dashboard settings.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Is there a rate limit?</h3>
                <p className="text-gray-300">
                  Free tier allows 1,000 messages per month. Paid plans offer higher limits and additional features.
                </p>
              </div>
            </div>
          </section>

          {/* Support */}
          <section className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Need Help?</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions or need assistance, feel free to reach out to our support team.
            </p>
            <div className="flex gap-4">
              <a 
                href="mailto:support@promptly-ai.com" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="/dashboard" 
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Documentation;
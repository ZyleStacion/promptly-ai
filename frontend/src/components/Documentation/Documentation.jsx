import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuBrain } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBook,
  FiPlay,
  FiSettings,
  FiUpload,
  FiDownload,
  FiShield,
  FiZap,
  FiCode,
  FiDatabase,
  FiMessageSquare,
  FiTrendingUp,
  FiHelpCircle,
  FiCheckCircle,
} from "react-icons/fi";

const Documentation = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("getting-started");
  const [isTocOpen, setIsTocOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  const sections = [
    { id: "getting-started", title: "Getting Started", icon: <FiPlay /> },
    { id: "features", title: "Key Features", icon: <FiZap /> },
    { id: "upload-data", title: "Upload Data", icon: <FiUpload /> },
    { id: "train-model", title: "Train Your Model", icon: <FiTrendingUp /> },
    { id: "download-deploy", title: "Download & Deploy", icon: <FiDownload /> },
    { id: "data-security", title: "Data Security", icon: <FiShield /> },
    { id: "best-practices", title: "Best Practices", icon: <FiDatabase /> },
    { id: "faq", title: "FAQ", icon: <FiHelpCircle /> },
  ];

  // Detect which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for navbar

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 80; // Approximate navbar height
      const elementPosition = element.offsetTop - navbarHeight;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation */}
      <nav className="bg-neutral-900 border-b border-gray-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white transition flex items-center gap-2"
            >
              <FiArrowLeft className="text-xl" />
              <span className="hidden md:inline">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <LuBrain className="text-3xl bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg p-1" />
              <h1 className="text-xl font-bold text-white">Promptly AI</h1>
              <span className="text-gray-400 hidden md:inline">
                | Documentation
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="lg:hidden text-gray-400 hover:text-white transition p-2"
              title="Table of Contents"
            >
              <FiBook className="text-2xl" />
            </button>
            <button
              onClick={() => {
                if (isLoggedIn) navigate("/dashboard");
                else navigate("/signin");
              }}
              className="primary-btn"
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-neutral-800 rounded-xl border border-gray-700 p-4">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <FiBook /> Table of Contents
              </h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 text-sm ${
                      activeSection === section.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-neutral-700 hover:text-white"
                    }`}
                  >
                    {section.icon}
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile TOC Modal */}
          <AnimatePresence>
            {isTocOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20"
                onClick={() => setIsTocOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-neutral-800 rounded-xl border border-gray-700 p-4 mx-4 max-w-md w-full max-h-[70vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold flex items-center gap-2">
                      <FiBook /> Table of Contents
                    </h2>
                    <button
                      onClick={() => setIsTocOpen(false)}
                      className="text-gray-400 hover:text-white transition"
                    >
                      <FiArrowLeft className="text-xl" />
                    </button>
                  </div>
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => {
                          scrollToSection(section.id);
                          setIsTocOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 text-sm ${
                          activeSection === section.id
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:bg-neutral-700 hover:text-white"
                        }`}
                      >
                        {section.icon}
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Promptly AI Documentation
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Learn how to train custom AI models with your business data
              </p>
            </motion.div>

            {/* Getting Started */}
            <Section
              id="getting-started"
              title="Getting Started"
              activeSection={activeSection}
            >
              <p className="text-gray-300 mb-4">
                Welcome to Promptly AI! This platform enables you to create
                custom AI models trained on your own business data. Follow these
                steps to get started:
              </p>
              <div className="space-y-4">
                <Step number="1" title="Create an Account">
                  Sign up for a free account to access the platform. You can use
                  email registration or sign in with Google for faster access.
                </Step>
                <Step number="2" title="Set Up Your Workspace">
                  Once logged in, you'll be taken to your personal workspace
                  where you can manage chatbots, upload data, and monitor
                  training progress.
                </Step>
                <Step number="3" title="Create Your First Chatbot">
                  Click "Create Chatbot" to start training your first AI model.
                  Give it a name and description that reflects its purpose.
                </Step>
                <Step number="4" title="Upload Your Data">
                  Upload documents, text files, or other data sources that will
                  teach your AI about your specific business needs.
                </Step>
              </div>
            </Section>

            {/* Key Features */}
            <Section
              id="features"
              title="Key Features"
              activeSection={activeSection}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard
                  icon={<FiDatabase />}
                  title="Custom Training"
                  description="Train AI models using your own proprietary business data for personalized responses."
                />
                <FeatureCard
                  icon={<FiShield />}
                  title="Data Privacy"
                  description="Your data stays secure and private. We never use your data to train other models."
                />
                <FeatureCard
                  icon={<FiZap />}
                  title="Fast Processing"
                  description="Efficient training algorithms ensure your model is ready quickly."
                />
                <FeatureCard
                  icon={<FiDownload />}
                  title="Local Deployment"
                  description="Download your trained model and deploy it on your own infrastructure."
                />
              </div>
            </Section>

            {/* Upload Data */}
            <Section
              id="upload-data"
              title="Upload Data"
              activeSection={activeSection}
            >
              <p className="text-gray-300 mb-4">
                The quality of your AI model depends on the data you provide.
                Here's how to upload and manage your training data:
              </p>
              <h3 className="text-white font-semibold text-lg mb-3">
                Supported Formats
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Text files (.txt)</li>
                <li>PDF documents (.pdf)</li>
                <li>Word documents (.doc, .docx)</li>
                <li>Markdown files (.md)</li>
                <li>CSV files (.csv)</li>
              </ul>
              <h3 className="text-white font-semibold text-lg mb-3">
                Upload Process
              </h3>
              <div className="space-y-4">
                <Step number="1" title="Navigate to Your Chatbot">
                  Select the chatbot you want to train from your dashboard.
                </Step>
                <Step number="2" title="Click 'Add Training Source'">
                  In the Training Sources section, click the upload button.
                </Step>
                <Step number="3" title="Select Files">
                  Choose files from your computer. You can upload multiple files
                  at once.
                </Step>
                <Step number="4" title="Confirm Upload">
                  Review your files and click confirm. The system will process
                  and prepare them for training.
                </Step>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mt-6">
                <p className="text-yellow-200 text-sm">
                  <strong>Tip:</strong> For best results, provide clear,
                  well-organized data. Remove any irrelevant information that
                  might confuse the model.
                </p>
              </div>
            </Section>

            {/* Train Your Model */}
            <Section
              id="train-model"
              title="Train Your Model"
              activeSection={activeSection}
            >
              <p className="text-gray-300 mb-4">
                Once you've uploaded your data, you're ready to train your AI
                model.
              </p>
              <h3 className="text-white font-semibold text-lg mb-3">
                Training Process
              </h3>
              <div className="space-y-4 mb-6">
                <Step number="1" title="Configure Settings">
                  Select your base model (e.g., Llama, GPT) and adjust training
                  parameters if needed. Default settings work well for most use
                  cases.
                </Step>
                <Step number="2" title="Start Training">
                  Click "Start Training" to begin the process. Training time
                  varies based on data size and model complexity.
                </Step>
                <Step number="3" title="Monitor Progress">
                  Track training progress in real-time through the dashboard.
                  You'll see metrics like loss, accuracy, and estimated
                  completion time.
                </Step>
                <Step number="4" title="Test Your Model">
                  Once training completes, test your model using the chat
                  interface to ensure it meets your needs.
                </Step>
              </div>
              <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                <h4 className="text-blue-200 font-semibold mb-2">
                  Available Models (Powered by Ollama)
                </h4>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>
                    • <strong>Llama 2:</strong> Great for general-purpose tasks
                  </li>
                  <li>
                    • <strong>Llama 3:</strong> Enhanced reasoning and context
                  </li>
                  <li>
                    • <strong>Mistral:</strong> Efficient for faster responses
                  </li>
                  <li>
                    • <strong>CodeLlama:</strong> Optimized for code-related
                    tasks
                  </li>
                </ul>
              </div>
            </Section>

            {/* Download & Deploy */}
            <Section
              id="download-deploy"
              title="Download & Deploy"
              activeSection={activeSection}
            >
              <p className="text-gray-300 mb-4">
                After training your model, you can download it for local
                deployment and integration into your own systems.
              </p>
              <h3 className="text-white font-semibold text-lg mb-3">
                Download Your Model
              </h3>
              <div className="space-y-4 mb-6">
                <Step number="1" title="Navigate to Models Section">
                  Go to your chatbot's details page and find the Models tab.
                </Step>
                <Step number="2" title="Select Model Version">
                  Choose the trained model version you want to download.
                </Step>
                <Step number="3" title="Download Files">
                  Click the download button to get model files, configuration,
                  and documentation.
                </Step>
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">
                Deployment Options
              </h3>
              <div className="space-y-4">
                <DeploymentOption
                  title="Local Server"
                  description="Run the model on your own server using Ollama or similar frameworks."
                />
                <DeploymentOption
                  title="Cloud Deployment"
                  description="Deploy to AWS, Azure, or Google Cloud for scalable access."
                />
                <DeploymentOption
                  title="Docker Container"
                  description="Use provided Docker images for easy containerized deployment."
                />
              </div>
            </Section>

            {/* Data Security */}
            <Section
              id="data-security"
              title="Data Security & Privacy"
              activeSection={activeSection}
            >
              <p className="text-gray-300 mb-4">
                For SMBs, data security is paramount. We take your business data
                and privacy seriously. Here's how we protect your information:
              </p>
              <div className="space-y-4">
                <SecurityFeature
                  title="End-to-End Encryption"
                  description="All data transfers are encrypted using industry-standard TLS/SSL protocols."
                />
                <SecurityFeature
                  title="Data Isolation"
                  description="Your training data is isolated and never mixed with other users' data."
                />
                <SecurityFeature
                  title="No Cross-Training"
                  description="Your proprietary data is never used to improve models for other customers."
                />
                <SecurityFeature
                  title="Secure Storage"
                  description="Data is stored in encrypted databases with strict access controls."
                />
                <SecurityFeature
                  title="GDPR Compliant"
                  description="We comply with GDPR and other international data protection regulations."
                />
                <SecurityFeature
                  title="Data Deletion"
                  description="You can permanently delete your data and models at any time."
                />
              </div>
            </Section>

            {/* Best Practices */}
            <Section
              id="best-practices"
              title="Best Practices"
              activeSection={activeSection}
            >
              <h3 className="text-white font-semibold text-lg mb-3">
                Data Preparation
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>
                  Clean your data before uploading - remove duplicates and
                  irrelevant content
                </li>
                <li>
                  Organize data by topic or category for better model
                  understanding
                </li>
                <li>
                  Include diverse examples to improve model generalization
                </li>
                <li>Use clear, consistent formatting across all documents</li>
              </ul>
              <h3 className="text-white font-semibold text-lg mb-3">
                Model Training
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>
                  Start with a smaller dataset to test and iterate quickly
                </li>
                <li>
                  Monitor training metrics to detect overfitting or underfitting
                </li>
                <li>
                  Test your model with various question types before deployment
                </li>
                <li>
                  Retrain periodically with new data to keep the model
                  up-to-date
                </li>
              </ul>
              <h3 className="text-white font-semibold text-lg mb-3">
                Production Use
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Implement rate limiting to prevent API abuse</li>
                <li>Monitor model performance and user feedback</li>
                <li>
                  Have a fallback mechanism for unclear or inappropriate
                  responses
                </li>
                <li>Regularly update your model with new training data</li>
              </ul>
            </Section>

            {/* FAQ */}
            <Section
              id="faq"
              title="Frequently Asked Questions"
              activeSection={activeSection}
            >
              <div className="space-y-4">
                <FAQ
                  question="How long does it take to train a model?"
                  answer="Training time varies based on data size and model complexity. Small datasets (< 1MB) typically take 10-30 minutes, while larger datasets may take several hours. You can monitor progress in real-time from your dashboard."
                />
                <FAQ
                  question="What happens to my data after training?"
                  answer="Your data is stored securely in our encrypted database and used only for your models. You can delete it anytime from your account settings. We never use your data to train models for other users."
                />
                <FAQ
                  question="Can I use my model offline?"
                  answer="Yes! After training, you can download your model and run it locally using Ollama or other compatible frameworks. This gives you complete control and offline access."
                />
                <FAQ
                  question="What's the difference between the free and paid plans?"
                  answer="The free plan includes basic features with limited number of chatbots created and less credits. Paid plans offer more number of chatbots, faster training and priority support"
                />
                <FAQ
                  question="Can I fine-tune an existing model?"
                  answer="No, currently we only support training custom models from your own data. However, you can choose from several base models like Llama 2, Llama 3, Mistral, and CodeLlama to start your training."
                />
                <FAQ
                  question="Is there a limit on file uploads?"
                  answer="Free accounts have a 100MB storage limit. Pro and Enterprise plans offer significantly more storage. Individual files are limited to 50MB each."
                />
                <FAQ
                  question="How do I get support?"
                  answer="Contact our support team at contact@promptlyai.com or use the chat widget in your dashboard. Pro and Enterprise users get priority support with faster response times."
                />
              </div>
            </Section>

            {/* Get Started CTA */}
            {!isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl p-8 text-center"
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Create your account today and start training custom AI models
                  with your own business data.
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Create Free Account
                </button>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const Section = ({ id, title, children, activeSection }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className={`rounded-xl border p-6 md:p-8 transition-all duration-300 ${
      activeSection === id
        ? "bg-blue-900/30 border-blue-600 shadow-lg shadow-blue-600/20"
        : "bg-neutral-800 border-gray-700"
    }`}
  >
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{title}</h2>
    {children}
  </motion.section>
);

const Step = ({ number, title, children }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
      {number}
    </div>
    <div className="flex-1">
      <h4 className="text-white font-semibold mb-1">{title}</h4>
      <p className="text-gray-400 text-sm">{children}</p>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-neutral-700/50 rounded-lg p-4 border border-gray-600">
    <div className="text-blue-400 text-2xl mb-2">{icon}</div>
    <h4 className="text-white font-semibold mb-2">{title}</h4>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const SecurityFeature = ({ title, description }) => (
  <div className="flex gap-3">
    <FiCheckCircle className="text-green-400 text-xl flex-shrink-0 mt-1" />
    <div>
      <h4 className="text-white font-semibold mb-1">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

const DeploymentOption = ({ title, description }) => (
  <div className="bg-neutral-700/50 rounded-lg p-4 border border-gray-600">
    <h4 className="text-white font-semibold mb-2">{title}</h4>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const CodeBlock = ({ code }) => (
  <div className="bg-neutral-900 rounded-lg p-4 border border-gray-700 overflow-x-auto">
    <pre className="text-sm text-gray-300">
      <code>{code}</code>
    </pre>
  </div>
);

const FAQ = ({ question, answer }) => (
  <div className="bg-neutral-700/50 rounded-lg p-4 border border-gray-600">
    <h4 className="text-white font-semibold mb-2 flex items-start gap-2">
      <FiHelpCircle className="text-blue-400 flex-shrink-0 mt-1" />
      {question}
    </h4>
    <p className="text-gray-400 text-sm ml-7">{answer}</p>
  </div>
);

export default Documentation;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import WhyChooseOurPlatform from "./components/WhyChooseOurPlatform/WhyChooseOurPlatform";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import SignIn from "./components/SignInUp/SignIn";
import SignUp from "./components/SignInUp/SignUp";
import Dashboard from "./components/Dashboard/Dashboard";
import AccountSetting from "./components/Dashboard/AccountSettings";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Documentation from "./components/Documentation/Documentation";
import IntegrationDemo from "./components/IntegrationDemo/IntegrationDemo";
import ChatbotWidget from "./components/Chatbot/ChatbotWidget";
import FeedbackButton from "./components/Feedback/FeedbackButton";

// Admin pages
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserManagement from "./components/Admin/UseraManagement";
import AdminRoute from "./components/Admin/AdminProtectedRoute";
import ChatbotManagement from "./components/Admin/ChatbotManagement";
import AdminFeedback from "./components/Admin/AdminFeedback";


const HomePage = () => (
  <main className="overflow-x-hidden bg-gray-900">
    <Navbar />
    <Hero />
    <HowItWorks />
    <WhyChooseOurPlatform />
    <Footer />
    {/* Promptly Chatbot Widget - Shows how to integrate on React sites */}
    <ChatbotWidget chatbotId="6951ca5594649fca1064b26e" />
  </main>
);

export const App = () => {
  return (
    <Router>
      <FeedbackButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/settings" element={<AccountSetting />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/integration-demo" element={<IntegrationDemo />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="chatbots" element={<ChatbotManagement />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

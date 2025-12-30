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
import PlansPage from "./components/Dashboard/PlansPage";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Documentation from "./components/Documentation/Documentation";

// Admin pages
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserManagement from "./components/Admin/UseraManagement";
import AdminRoute from "./components/Admin/AdminProtectedRoute";
import PaymentSuccess from "./components/Payment/PaymentSuccess";
import PaymentCanceled from "./components/Payment/PaymentCanceled";

// Stripe
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe('pk_test_51O6acYKS89qhN4fbUWEj4DgDtfJZLJ19QKbGPJq9pQ0y8UVbn1mQ3XlFczGuGnkrC3zyRY3i2V5yaMT0XVO4CN4M00Mpy2QUPK');

// Get user from localStorage
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.id || user._id || "";
};

const HomePage = () => (
  <main className="overflow-x-hidden bg-gray-900">
    <Navbar />
    <Hero />
    <HowItWorks />
    <WhyChooseOurPlatform />
    <Footer />
  </main>
);

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/settings" element={<AccountSetting />} />
        <Route path="/dashboard/plans" element={<PlansPage userId={getUserId()} />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<PaymentCanceled />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/documentation" element={<Documentation />} />

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
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

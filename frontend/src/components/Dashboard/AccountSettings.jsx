import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaCreditCard, FaFileInvoice } from "react-icons/fa";
import { mockApi, USE_MOCK_API } from "../../api/mockApi";
import { getInvoices } from "../../api/payments";
import CheckoutButton from "../Payment/CheckoutButton";

const AccountSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || (location.pathname === "/dashboard/billing" ? "billing" : "profile")
  );

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Profile image data
  const [profileImage, setProfileImage] = useState(""); // URL from DB
  const [profileFile, setProfileFile] = useState(null); // selected image file
  const [previewImage, setPreviewImage] = useState(""); // preview URL

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' | 'yearly'
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState("");

  // Clear message when switching tabs
  useEffect(() => {
    setMessage("");
  }, [activeTab]);

  // --------------------------------------------------
  // LOAD USER ON PAGE LOAD
  // --------------------------------------------------
  useEffect(() => {
    const loadUser = async () => {
      try {
        let data;

        if (USE_MOCK_API) {
          data = await mockApi.getUserProfile();
        } else {
          const token = localStorage.getItem("token");
          console.log("Token:", token ? "exists" : "missing");

          const res = await fetch("http://localhost:3000/user/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("Response status:", res.status);
          data = await res.json();
          console.log("User data:", data);
        }

        const u = data.user;
        setUser(u);
        setUsername(u.username);
        setEmail(u.email);
        setPhone(u.phone || "");
        setBusinessName(u.businessName || "");

        // existing db image
        const fullImg = u.profileImage
          ? USE_MOCK_API
            ? u.profileImage
            : `http://localhost:3000${u.profileImage}`
          : "";

        setProfileImage(fullImg);
        setPreviewImage(fullImg);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    loadUser();
  }, []);

  // Track changes
  useEffect(() => {
    if (!user) return;
    const changed =
      username !== user.username ||
      email !== user.email ||
      phone !== (user.phone || "") ||
      businessName !== (user.businessName || "") ||
      profileFile !== null;
    setHasChanges(changed);
  }, [username, email, phone, businessName, profileFile, user]);

  // --------------------------------------------------
  // HANDLE IMAGE SELECTION
  // --------------------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileFile(file);

    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // show live preview
    }
  };

  // --------------------------------------------------
  // SAVE PROFILE CHANGES
  // --------------------------------------------------
  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("businessName", businessName);

      if (profileFile) {
        formData.append("profileImage", profileFile);
      }

      let data;

      if (USE_MOCK_API) {
        data = await mockApi.updateUserProfile(formData);
      } else {
        const res = await fetch("http://localhost:3000/user/update-info", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });
        data = await res.json();
      }

      setMessage(data.message);

      if (data.user) {
        const img = data.user.profileImage
          ? USE_MOCK_API
            ? data.user.profileImage
            : `http://localhost:3000${data.user.profileImage}`
          : "";

        setUser(data.user);
        setPreviewImage(img); // update live image

        // Save to localStorage so navbar updates
        localStorage.setItem("user", JSON.stringify(data.user));

        // Notify Navbar to refresh
        window.dispatchEvent(new Event("storage"));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile");
    }
  };

  // --------------------------------------------------
  // CHANGE PASSWORD
  // --------------------------------------------------
  const handleChangePassword = async () => {
    try {
      let data;

      if (USE_MOCK_API) {
        data = await mockApi.changePassword({ currentPassword, newPassword });
      } else {
        const res = await fetch("http://localhost:3000/user/change-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        data = await res.json();
      }

      setMessage(data.message);

      if (data.success) {
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Error changing password");
    }
  };

  // --------------------------------------------------
  // DELETE ACCOUNT
  // --------------------------------------------------
  const handleDeleteAccount = async () => {
    try {
      if (USE_MOCK_API) {
        await mockApi.deleteAccount();
      } else {
        await fetch("http://localhost:3000/user/delete", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/signup");
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage("Error deleting account");
    }
    setShowDeleteModal(false);
  };

    // Fetch invoices when Billing tab is active
    useEffect(() => {
      const fetchPayments = async () => {
        setPaymentsError("");
        setPaymentsLoading(true);
        try {
          const res = await getInvoices();
          setPayments(res.payments || []);
        } catch (err) {
          console.error("Error fetching invoices:", err);
          setPaymentsError(err.message || "Error fetching billing history");
        } finally {
          setPaymentsLoading(false);
        }
      };

      if (activeTab === "billing") {
        fetchPayments();
      }
    }, [activeTab]);

  if (!user) return <p className="text-white">Loading...</p>;

  // Determine current subscription plan from user object
  const currentPlan = (user.subscriptionPlan && user.subscriptionPlan.trim()) ||
    (user.subscriptionStatus && user.subscriptionStatus.toLowerCase() !== "none"
      ? "Basic"
      : "Free");
  const isCurrentPlan = (name) => {
    if (!name) return false;
    return currentPlan.toLowerCase() === name.toLowerCase();
  };
  // helper to format prices based on billing cycle (yearly uses 10% discount)
  const formatPrice = (monthly) => {
    if (billingCycle === "monthly") return `$${monthly}`;
    const yearly = Math.round(monthly * 10);
    return `$${yearly}`;
  };
  const billingLabel = billingCycle === "monthly" ? "/month" : "/year";
  // --------------------------------------------------
  // FRONTEND UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </button>
        <div className="h-6 w-px bg-gray-700"></div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-neutral-800 rounded-xl p-4 border border-gray-700">
            <nav className="space-y-2">
              {[
                { id: "profile", label: "Profile", icon: FaUser },
                { id: "security", label: "Security", icon: FaLock },
                {
                  id: "subscription",
                  label: "Subscription",
                  icon: FaCreditCard,
                },
                { id: "billing", label: "Billing", icon: FaFileInvoice },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                      : "text-gray-400 hover:bg-neutral-700 hover:text-white"
                    }`}
                >
                  <tab.icon className="text-xl" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 px-4 py-3 rounded-lg border ${message.toLowerCase().includes("incorrect") ||
                  message.toLowerCase().includes("error") ||
                  message.toLowerCase().includes("failed")
                  ? "bg-red-600/20 text-red-400 border-red-600/50"
                  : "bg-green-600/20 text-green-400 border-green-600/50"
                }`}
            >
              {message}
            </motion.div>
          )}

          {/* Profile Section */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-neutral-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-2">Profile Information</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Update your personal information and profile picture
                </p>

                {/* Profile Picture */}
                <div className="mb-6">
                  <label className="block mb-3 text-gray-300 font-medium">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={previewImage || "https://via.placeholder.com/120"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                    />
                    <label className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg cursor-pointer transition border border-gray-600">
                      <span className="text-white">Upload New Picture</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Input Fields - 2 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Full Name */}
                  <div>
                    <label className="block mb-2 text-gray-300 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-neutral-700 border border-gray-600 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block mb-2 text-gray-300 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-700 border border-gray-600 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block mb-2 text-gray-300 font-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-700 border border-gray-600 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Business Name */}
                  <div>
                    <label className="block mb-2 text-gray-300 font-medium">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-neutral-700 border border-gray-600 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter your business name"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleUpdateProfile}
                  disabled={!hasChanges}
                  className={`w-full py-3 rounded-lg font-semibold transition ${hasChanges
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white cursor-pointer"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}

          {/* Security Section */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Change Password Box */}
              <div className="bg-neutral-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-2">Change Password</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Update your password to keep your account secure
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-gray-300 font-medium">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-neutral-700 border border-gray-600 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => navigate("/forgot-password")}
                      className="text-blue-500 hover:text-blue-400 text-sm font-medium transition"
                    >
                      Forgot your password?
                    </button>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-300 font-medium">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-neutral-700 border border-gray-600 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-300 font-medium">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-neutral-700 border border-gray-600 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold transition"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-neutral-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      Two-Step Authentication
                    </h2>
                    <p className="text-gray-400 text-sm mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <p className="text-gray-500 text-xs">
                      {twoFactorEnabled
                        ? "Two-factor authentication is currently enabled"
                        : "Two-factor authentication is currently disabled"}
                    </p>
                  </div>
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${twoFactorEnabled ? "bg-blue-600" : "bg-gray-600"
                      }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? "translate-x-7" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>
              </div>

              {/* Delete Account */}
              <div className="bg-neutral-800 rounded-xl p-6 border border-red-700/50">
                <h2 className="text-2xl font-bold mb-2 text-red-400">
                  Delete Account
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg text-white font-semibold transition"
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          )}

          {/* Subscription Section */}
          {activeTab === "subscription" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Current Plan */}
              <div className="bg-neutral-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-4">Current Plan</h2>
                <div className="bg-neutral-900 rounded-lg p-6 border border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {currentPlan} Plan
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {currentPlan === "Free" || currentPlan === "Basic"
                          ? "Perfect for getting started"
                          : currentPlan === "Pro"
                          ? "Great for growing teams"
                          : "Enterprise features and support"}
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {currentPlan === "Free" || currentPlan === "Basic" ? "$0" : currentPlan === "Pro" ? "$29" : "$99"}
                    </span>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    {currentPlan.toLowerCase() === "free" || currentPlan.toLowerCase() === "basic" ? (
                      <>
                        <li className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          <span>50 credits per month</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          <span>1 chatbot</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          <span>Basic analytics</span>
                        </li>
                      </>
                    ) : currentPlan.toLowerCase() === "pro" ? (
                      <>
                        <li className="flex items-center gap-2">
                          <span className="text-blue-400">✓</span>
                          <span>500 credits/month</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-blue-400">✓</span>
                          <span>Unlimited chatbots</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-blue-400">✓</span>
                          <span>Advanced analytics</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2">
                          <span className="text-violet-400">✓</span>
                          <span>Unlimited credits</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-violet-400">✓</span>
                          <span>Unlimited chatbots</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-violet-400">✓</span>
                          <span>Custom integrations</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Available Plans */}
              <div className="bg-neutral-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">Select billing cycle</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${billingCycle === "monthly" ? "bg-white text-black" : "bg-neutral-700 text-gray-300"}`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle("yearly")}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${billingCycle === "yearly" ? "bg-white text-black" : "bg-neutral-700 text-gray-300"}`}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pro Plan */}
                  <div className="bg-neutral-900 rounded-lg p-6 border border-blue-500/50 hover:border-blue-500 transition">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        Pro Plan
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">
                          {formatPrice(29)}
                        </span>
                        <span className="text-gray-400">{billingLabel}</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6 text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span>500 credits/month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span>Unlimited chatbots</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span>Advanced analytics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span>
                        <span>Priority support</span>
                      </li>
                    </ul>
                    {isCurrentPlan("Pro") ? (
                      <button
                        disabled
                        className="w-full bg-gray-700 text-gray-400 py-2 rounded-lg font-semibold cursor-not-allowed"
                      >
                        Current Plan
                      </button>
                    ) : (
                      <CheckoutButton
                        priceId={billingCycle === "monthly" ? "price_1Sk0ju3tBDM4Uh8AID3qhu5S" : "price_1Sk0s13tBDM4Uh8Ag7oIwytw"}
                        userId={user.id || user._id}
                        planName="Pro"
                      />
                    )}
                  </div>

                  {/* Enterprise Plan */}
                  <div className="bg-neutral-900 rounded-lg p-6 border border-violet-500/50 hover:border-violet-500 transition">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        Enterprise Plan
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">
                          {formatPrice(99)}
                        </span>
                        <span className="text-gray-400">{billingLabel}</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6 text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="text-violet-400">✓</span>
                        <span>Unlimited credits</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-violet-400">✓</span>
                        <span>Unlimited chatbots</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-violet-400">✓</span>
                        <span>Custom integrations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-violet-400">✓</span>
                        <span>
                          Dedicated support + 1 kiss from each of us developers
                        </span>
                      </li>
                    </ul>
                    {isCurrentPlan("Enterprise") || isCurrentPlan("Max") ? (
                      <button
                        disabled
                        className="w-full bg-gray-700 text-gray-400 py-2 rounded-lg font-semibold cursor-not-allowed"
                      >
                        Current Plan
                      </button>
                    ) : (
                      <CheckoutButton
                        priceId={billingCycle === "monthly" ? "price_1SjxRI3tBDM4Uh8AU9CbUNeI" : "price_1Sk0tE3tBDM4Uh8AZFTTWsWW"}
                        userId={user.id || user._id}
                        planName="Enterprise"
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Billing Section */}
          {activeTab === "billing" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Payment Methods
              <div className="bg-neutral-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">
                    No payment methods added yet
                  </p>
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition">
                    + Add Payment Method
                  </button>
                </div>
              </div> */}

              {/* Billing History */}
              <div className="bg-neutral-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-4">Billing History</h2>
                {paymentsLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading...</div>
                ) : paymentsError ? (
                  <div className="text-center py-8 text-red-400">{paymentsError}</div>
                ) : payments && payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-gray-400 text-sm">
                          <th className="pb-2">Date</th>
                          <th className="pb-2">Amount</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2">Period</th>
                          <th className="pb-2">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => {
                          const date = p.createdAtStripe
                            ? new Date(p.createdAtStripe * 1000)
                            : p.createdAt
                              ? new Date(p.createdAt)
                              : null;
                          const amount = p.amountPaid != null ? (p.amountPaid / 100).toFixed(2) : "0.00";
                          const currency = (p.currency || "USD").toUpperCase();
                          const periodStart = p.periodStart ? new Date(p.periodStart * 1000) : null;
                          const periodEnd = p.periodEnd ? new Date(p.periodEnd * 1000) : null;

                          return (
                            <tr key={p._id || p.stripeInvoiceId} className="border-t border-gray-700">
                              <td className="py-3 text-sm text-gray-300">{date ? date.toLocaleDateString() : "-"}</td>
                              <td className="py-3 text-sm text-gray-300">{currency} {amount}</td>
                              <td className="py-3 text-sm text-gray-300">{p.status || "-"}</td>
                              <td className="py-3 text-sm text-gray-300">{periodStart && periodEnd ? `${periodStart.toLocaleDateString()} — ${periodEnd.toLocaleDateString()}` : "-"}</td>
                              <td className="py-3 text-sm text-gray-300">
                                {p.hostedInvoiceUrl ? (
                                  <a href={p.hostedInvoiceUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">View</a>
                                ) : p.invoicePdf ? (
                                  <a href={p.invoicePdf} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Download</a>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No billing history available</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-800 rounded-xl p-6 max-w-md w-full mx-4 border border-red-700/50"
          >
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Delete Account?
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete your account? This action is
              permanent and cannot be undone. All your data will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition"
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;

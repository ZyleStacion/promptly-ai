import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LuBrain } from "react-icons/lu";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/auth";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------- GOOGLE SIGNUP ----------------
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        const res = await fetch("http://localhost:3000/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        });

        const data = await res.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        }
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signup-btn"),
      {
        theme: "outline",
        size: "large",
        width: "350",
        text: "signup_with",
      }
    );
  }, []);
  // ------------------------------------------------

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.acceptedTerms)
      newErrors.acceptedTerms = "You must accept Terms & Conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        username: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      const data = await registerUser(payload);

      if (data.error) {
        setErrors({ api: data.error });
      } else {
        navigate("/signin");
      }
    } catch {
      setErrors({ api: "Sign-up failed. Please try again." });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <LuBrain className="text-4xl bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg p-1" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
              Promptly AI
            </h1>
          </div>
          <p className="text-gray-400">Create your account</p>
        </div>

        <div className="bg-neutral-950 border border-gray-800 rounded-xl p-8 pt-14 shadow-xl relative">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-3 left-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md p-2 text-sm"
          >
            ← Back
          </button>

          {/* Auth Switch */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={() => navigate("/signin")}
              className="px-3 py-1 rounded-md text-sm bg-transparent border border-gray-700 text-white hover:bg-gray-800"
            >
              Sign In
            </button>

            <button className="px-3 py-1 rounded-md text-sm bg-white text-gray-900 font-semibold">
              Sign Up
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

          {/* GLOBAL ERRORS */}
          {errors.api && (
            <div className="bg-red-600/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {errors.api}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <InputField
              label="Full Name"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              error={errors.fullName}
            />

            {/* Email */}
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
            />

            {/* Password */}
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
            />

            {/* Confirm Password */}
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
            />

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2 text-gray-400 text-sm">
              <input
                type="checkbox"
                checked={formData.acceptedTerms}
                onChange={(e) =>
                  setFormData({ ...formData, acceptedTerms: e.target.checked })
                }
                className="w-4 h-4 mt-1"
              />
              <span>
                I accept the{" "}
                <a className="text-blue-400">Terms of Service</a> &{" "}
                <a className="text-blue-400">Privacy Policy</a>
              </span>
            </label>

            {errors.acceptedTerms && (
              <p className="text-red-400 text-sm -mt-2">
                {errors.acceptedTerms}
              </p>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 mt-6"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <div id="google-signup-btn" className="w-full flex justify-center"></div>
        </div>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;

/* ------------------ REUSABLE INPUT COMPONENT ------------------ */
const InputField = ({ label, error, ...props }) => (
  <div>
    <label className="block text-white font-semibold mb-2 text-sm">{label}</label>

    <input
      {...props}
      className={`w-full bg-gray-800 border px-4 py-3 rounded-lg text-white focus:ring-1 ${
        error
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-700 focus:ring-blue-500"
      }`}
    />

    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
);

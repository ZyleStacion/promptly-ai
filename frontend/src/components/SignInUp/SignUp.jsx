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
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
        if (!data.token) return;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setSuccess(true);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signup-btn"),
      { theme: "outline", size: "large", width: "350", text: "signup_with" }
    );
  }, []);

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the Terms & Privacy Policy");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      const data = await registerUser(payload);

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // ⭐ SUCCESS
      setSuccess(true);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storage"));

      setTimeout(() => {
        if (data.user?.isAdmin) navigate("/admin");
        else navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setError("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <LuBrain className="text-4xl bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg p-1" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
              Promptly AI
            </h1>
          </div>
          <p className="text-gray-400">Join us today</p>
        </div>

        {/* FORM CARD */}
        <div className="bg-neutral-950 border border-gray-800 rounded-xl p-8 pt-14 relative">

          {/* SUCCESS ANIMATION */}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center rounded-xl z-50"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150 }}
                className="bg-green-600 rounded-full p-6"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-4xl font-bold"
                >
                  ✓
                </motion.span>
              </motion.div>
            </motion.div>
          )}

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-3 left-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-3 py-1 text-sm"
          >
            ← Back
          </button>

          {/* SWITCH BUTTONS */}
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

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* FULL NAME */}
            <div>
              <label className="block text-white mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-white mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-white mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg"
                />
                <span
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                >
                  {showConfirmPass ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            {/* TERMS */}
            <label className="flex items-start gap-2 text-gray-400 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 mt-1"
              />
              <span>
                I agree to the{" "}
                <a className="text-blue-500">Terms</a> and{" "}
                <a className="text-blue-500">Privacy Policy</a>.
              </span>
            </label>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50 mt-6"
            >
              {loading ? "Creating..." : "Sign Up"}
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
          <Link to="/signin" className="text-blue-500">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;

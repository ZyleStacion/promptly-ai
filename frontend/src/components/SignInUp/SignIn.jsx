import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LuBrain } from "react-icons/lu";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------- GOOGLE LOGIN ----------------
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
          localStorage.setItem("user", JSON.stringify(data.user));

          window.dispatchEvent(new Event("storage"));

          if (data.user?.isAdmin) navigate("/admin");
          else navigate("/dashboard");
        }
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-login-btn"),
      {
        theme: "outline",
        size: "large",
        width: "350",
      }
    );
  }, []);
  // ----------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (!data.token) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storage"));

      if (data.user?.isAdmin) navigate("/admin");
      else navigate("/dashboard");

    } catch (err) {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <LuBrain className="text-4xl bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg p-1" />
            <h1 className="text-4xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent font-bold">
              Promptly AI
            </h1>
          </div>
          <p className="text-gray-400">Welcome back!</p>
        </div>

        {/* Card */}
        <div className="bg-neutral-950 border border-gray-800 rounded-xl p-8 pt-14 shadow-xl relative">

          <button
            onClick={() => navigate("/")}
            className="absolute top-3 left-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md p-2 text-sm"
          >
            ← Back
          </button>

          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button className="px-3 py-1 rounded-md bg-white text-gray-900 text-sm font-semibold">
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-3 py-1 rounded-md bg-transparent border border-gray-700 text-white text-sm hover:bg-gray-800"
            >
              Sign Up
            </button>
          </div>

          <h2 className="text-2xl text-white font-bold mb-6">Sign In</h2>

          {/* Error */}
          {error && (
            <div className="bg-red-600/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-white text-sm font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full mt-2 bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-white text-sm font-semibold">Password</label>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-2 bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-11 text-gray-400 hover:text-white"
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm mt-2">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" className="w-4 h-4" />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-500 hover:text-blue-400 font-semibold"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <div id="google-login-btn" className="w-full flex justify-center"></div>
        </div>

        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-semibold">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;

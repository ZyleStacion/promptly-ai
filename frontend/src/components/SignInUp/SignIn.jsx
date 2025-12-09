import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LuBrain } from "react-icons/lu";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

        if (!data.token) return;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setSuccess(true);

        setTimeout(() => {
          if (data.user?.isAdmin) navigate("/admin");
          else navigate("/dashboard");
        }, 1200);
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-login-btn"),
      { theme: "outline", size: "large", width: "350" }
    );
  }, []);

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter email & password");
      setLoading(false);
      return;
    }

    try {
      const data = await loginUser({ email, password });

      if (!data.token) {
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storage"));

      setSuccess(true);

      setTimeout(() => {
        if (data.user?.isAdmin) navigate("/admin");
        else navigate("/dashboard");
      }, 1200);
    } catch {
      setError("Sign in failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
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

          <p className="text-gray-400">Welcome back</p>
        </div>

        {/* CARD */}
        <div className="bg-neutral-950 border border-gray-800 rounded-xl p-8 pt-14 relative">

          {/* SUCCESS OVERLAY */}
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

          {/* SWITCH */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button className="px-3 py-1 bg-white text-gray-900 rounded-md text-sm font-semibold">
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-3 py-1 bg-transparent border border-gray-700 text-white rounded-md text-sm hover:bg-gray-800"
            >
              Sign Up
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

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

            {/* EMAIL */}
            <div>
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-white mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg"
                />
                <span
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                >
                  {showPass ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" className="w-4 h-4" />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-500 hover:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50 mt-6"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-gray-700"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="h-px flex-1 bg-gray-700"></div>
          </div>

          {/* GOOGLE BUTTON */}
          <div id="google-login-btn" className="w-full flex justify-center"></div>
        </div>

        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign Up
          </Link>
        </p>

      </motion.div>
    </div>
  );
};

export default SignIn;

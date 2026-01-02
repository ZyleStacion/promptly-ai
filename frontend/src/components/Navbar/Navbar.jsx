import React from "react";
import { NavbarMenu } from "../../mockData/data";
import { LuBrain } from "react-icons/lu";
import { MdMenu } from "react-icons/md";
import { HiSun, HiMoon } from "react-icons/hi";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ResponsiveMenu from "./ResponsiveMenu";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleNavClick = (e, link) => {
    if (!link) return;
    if (link.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(link);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setIsOpen(false);
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/");
  };

  return (
    <>
      <nav className="flex-nowrap top-0 w-full fixed z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="containers flex justify-between items-center py-3 px-10 bg-neutral-900 dark:bg-neutral-100 transition-colors duration-300"
        >
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick}>
            <div className="text-2xl flex items-center gap-2 font-bold cursor-pointer">
              <LuBrain className="text-3xl text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg p-0.5" />
              <p className="text-white dark:text-gray-900">Promptly AI</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {NavbarMenu.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.link}
                    onClick={(e) => handleNavClick(e, item.link)}
                    className="inline-block text-white dark:text-black text-sm xl:text-base py-1 px-2 xl:px-3 hover:text-secondary dark:hover:text-blue-600 transition-all duration-300 font-semibold"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* AUTH Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-800 dark:bg-gray-200 text-yellow-400 dark:text-gray-700 hover:scale-110 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <HiSun className="text-2xl" />
              ) : (
                <HiMoon className="text-2xl" />
              )}
            </button>

            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/signin")}
                  className="font-semibold text-white dark:text-gray-900 hover:text-secondary dark:hover:text-blue-600 transition-all duration-300"
                >
                  Sign In
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="text-white dark:text-white bg-secondary font-semibold rounded-full px-6 py-2 hover:scale-110 duration-300"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                {/* Admin Panel button (only for admins) */}
                {user?.isAdmin && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="text-white dark:text-white bg-blue-600 font-semibold rounded-full px-6 py-2 hover:scale-110 duration-300"
                  >
                    Admin Panel
                  </button>
                )}

                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-white dark:text-white bg-secondary font-semibold rounded-full px-6 py-2 hover:scale-110 duration-300"
                >
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="font-semibold text-white dark:text-gray-900 hover:text-secondary dark:hover:text-blue-600 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            {/* Theme Toggle Button for Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-800 dark:bg-gray-200 text-yellow-400 dark:text-gray-700 hover:scale-110 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <HiSun className="text-2xl" />
              ) : (
                <HiMoon className="text-2xl" />
              )}
            </button>

            <div onClick={() => setIsOpen(!isOpen)}>
              <MdMenu className="text-4xl text-white dark:text-gray-900" />
            </div>
          </div>
        </motion.div>
      </nav>

      <ResponsiveMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Navbar;

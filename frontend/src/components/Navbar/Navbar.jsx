import React from "react";
import { NavbarMenu } from "../../mockData/data";
import { LuBrain } from "react-icons/lu";
import { MdMenu } from "react-icons/md";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ResponsiveMenu from "./ResponsiveMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

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

  return (
    <>
      <nav className="flex-nowrap top-0 w-full fixed z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="containers flex justify-between items-center py-3 px-10 bg-neutral-900"
        >
          {/* Logo */}
          <Link to="/">
            <div className="text-2xl flex items-center gap-2 font-bold">
              <LuBrain className="text-3xl text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg p-0.5" />
              <p className="text-white">Promptly AI</p>
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
                    className="inline-block text-white text-sm xl:text-base py-1 px-2 xl:px-3 hover:text-secondary transition-all duration-300 font-semibold"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* AUTH Buttons */}
          <div className="hidden lg:flex space-x-6">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/signin")}
                  className="font-semibold text-white hover:text-secondary transition-all duration-300"
                >
                  Sign In
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="text-white bg-secondary font-semibold rounded-full px-6 py-2 hover:scale-110 duration-300"
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
                    className="text-white bg-blue-600 font-semibold rounded-full px-6 py-2 hover:scale-110 duration-300"
                  >
                    Admin Panel
                  </button>
                )}

                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-white bg-secondary font-semibold rounded-full px-6 py-2 hover:scale-110 duration-300"
                >
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="font-semibold text-white hover:text-secondary transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            <MdMenu className="text-4xl text-white" />
          </div>
        </motion.div>
      </nav>

      <ResponsiveMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Navbar;

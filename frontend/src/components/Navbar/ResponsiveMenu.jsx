import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import { NavbarMenu } from "../../mockData/data";

const ResponsiveMenu = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleMenuClick = (link) => {
    setIsOpen(false);
    if (link.startsWith("#")) {
      const el = document.querySelector(link);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    navigate("/");
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-16 left-0 w-full h-screen z-20 lg:hidden"
        >
          <div className="text-xl font-semibold uppercase bg-gradient-to-r from-blue-600 to-violet-600 text-white py-5 rounded-3xl text-center">
            {NavbarMenu.map((item) => (
              <li key={item.id}>
                <a
                  href={item.link}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(item.link);
                  }}
                  className="inline-block text-white py-3 hover:text-secondary transition-all duration-300 font-semibold"
                >
                  {item.title}
                </a>
              </li>
            ))}

            {/* Auth Buttons Mobile */}
            <div className="mt-4 bg-gray-800 rounded-xl p-4 inline-flex flex-col space-y-4">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/signin");
                    }}
                    className="font-semibold text-white"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/signup");
                    }}
                    className="text-white bg-secondary font-semibold rounded-full px-6 py-2 hover:scale-110 duration-300"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/dashboard");
                    }}
                    className="text-white bg-secondary font-semibold rounded-full px-6 py-2 hover:scale-110 duration-300"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="font-semibold text-white"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;

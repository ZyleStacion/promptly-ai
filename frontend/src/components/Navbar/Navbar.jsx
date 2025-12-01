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

  const handleNavClick = (e, link) => {
    if (!link) return;
    if (link.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(link);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // close mobile menu if open
      setIsOpen(false);
    }
  };
  return (
    <>
      <nav className=" flex-nowrap top-0 w-full fixed z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="containers flex justify-between items-center py-3 px-10 bg-neutral-900"
        >
          {/* logo section */}
          <a href="/">
            <div className=" text-2xl flex items-center gap-2 font-bold ">
              <LuBrain className="text-3xl text-white bg-gradient-to-r from-blue-600 to-violet-600 text-transparent rounded-lg p-0.5" />
              <p className="text-white ">Promptly AI</p>
            </div>
          </a>

          {/* menu section  */}
          <div className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {NavbarMenu.map((item) => {
                return (
                  <li key={item.id}>
                    <a
                      href={item.link}
                      onClick={(e) => handleNavClick(e, item.link)}
                      className="inline-block text-white text-sm xl:text-base py-1 px-2 xl:px-3
                             hover:text-secondary transition-all duration-300 font-semibold"
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* login/logout buttons section  */}
          <div className="hidden lg:block space-x-6">
            <button
              id="nav-signin-btn"
              onClick={() => navigate("/signin")}
              className="font-semibold text-white hover:text-secondary transition-all duration-300"
            >
              Sign In
            </button>
            <button
              id="nav-signup-btn"
              onClick={() => navigate("/signup")}
              className="text-white bg-secondary font-semibold rounded-full px-6 py-2 hover:scale-110 duration-300"
            >
              Sign Up
            </button>
          </div>

          {/* mobile list section  */}
          <div className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            <MdMenu className="text-4xl text-white hover:font-bold" />
          </div>
        </motion.div>
      </nav>

      {/* Mobile dropdown menu  */}
      <ResponsiveMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Navbar;

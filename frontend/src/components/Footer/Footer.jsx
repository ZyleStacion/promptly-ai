import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { LuBrain } from "react-icons/lu";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer
      id="contact-us"
      className="bg-neutral-950 dark:bg-gray-100 text-white dark:text-gray-900 pt-12 pb-8 transition-colors duration-300"
    >
      <div className="containers ">
        {/* Top Section */}
        <div className="md:flex  px-10 md:px-20 md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <LuBrain className="text-3xl bg-gradient-to-r from-blue-600 to-violet-600 rounded-md p-1" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
                Promptly AI
              </h2>
            </div>
            <p className="text-gray-400 dark:text-gray-600 max-w-md">
              Empower your business with custom AI models. Train locally, keep
              control, and unlock intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Column 1: Company */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-600">
                <li>
                  <a
                    href="/"
                    className="hover:text-secondary dark:hover:text-blue-600 transition-colors duration-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/documentation"
                    className="hover:text-secondary dark:hover:text-blue-600 transition-colors duration-300"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Column 2: Contact (shown on all screen sizes) */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-600">
                <li className="flex items-center gap-2">
                  <HiLocationMarker className="text-secondary" />
                  <span>2025 SEPM Street, RMIT City</span>
                </li>
                <li>
                  <a
                    href="mailto:hello@promptly.ai"
                    className="hover:text-secondary dark:hover:text-blue-600 transition-colors duration-300"
                  >
                    contact@promptlyai.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+1234567890"
                    className="hover:text-secondary dark:hover:text-blue-600 transition-colors duration-300"
                  >
                    +1 (234) 567-890
                  </a>
                </li>
              </ul>
              {/* Social icons placed under Contact */}
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 dark:text-gray-600 hover:text-secondary dark:hover:text-blue-600 transition-colors duration-300"
                >
                  <FaFacebook className="text-2xl" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 dark:text-gray-600 hover:text-secondary dark:hover:text-blue-600 transition-colors duration-300"
                >
                  <FaInstagram className="text-2xl" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Social & Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-700 dark:border-gray-300 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 dark:text-gray-600 text-sm">
              &copy; 2025 Promptly AI. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { motion } from "framer-motion";
import demoImg from "../../assets/demo.png";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { LiaIndustrySolid } from "react-icons/lia";
import { LuMousePointerClick } from "react-icons/lu";

const WhyChooseOurPlatformMenu = [
  {
    id: 1,
    title: "Privacy First",
    description:
      "Your data stays yours. Train locally and keep full control of your AI model.",
    icon: <IoShieldCheckmarkOutline className="text-6xl p-1" />,
    delay: 0.3,
  },
  {
    id: 2,
    title: "Industry Specific Models",
    description:
      "Models trained on your business data perform better for your specific use case.",
    icon: <LiaIndustrySolid className="text-6xl p-2" />,
    delay: 0.6,
  },
  {
    id: 3,
    title: "Easy to Use",
    description:
      "No technical expertise required. Simple chat interface and automated training.",
    icon: <LuMousePointerClick className="text-6xl p-2" />,
    delay: 0.9,
  },
];

const WhyChooseOurPlatform = () => {
  return (
    <div
      id="why-choose-our-platform"
      className="bg-gray-900 dark:bg-gradient-to-br dark:from-blue-50 dark:to-gray-50 containers grid grid-cols-1 md:grid-cols-2 min-h-[650px] md:px-5 relative transition-colors duration-300 pt-20 pb-10"
    >
      {/* brand infor */}
      <div className="flex flex-col justify-center px-8 md:pr-10 xl:pr-30">
        <div className=" text-center md:text-left space-y-6">
          <motion.h1
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="  text-5xl font-semibold  bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text"
          >
            Why Choose Our Platform ?
          </motion.h1>

          <div>
            {WhyChooseOurPlatformMenu.map((item) => {
              return (
                <motion.div
                  initial={{ opacity: 0, x: -200 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.delay }}
                  className="bg-neutral-950 dark:bg-white dark:border dark:border-gray-200 mx-3 text-white dark:text-gray-900 my-3 space-y-3 p-4 rounded-xl shadow-[0_0_22px_rgba(0,0,0,0.15)] dark:shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] dark:hover:shadow-xl dark:hover:border-blue-300 transition-all duration-300 text-center"
                >
                  {/* icon section */}
                  <div>
                    <div className="bg-gray-900 dark:bg-gray-100 w-10 h-10 rounded-lg flex items-center text-center">
                      {item.icon}
                    </div>
                  </div>
                  <p className="font-bold text-xl">{item.title}</p>
                  <p className="text-sm">{item.description}</p>
                </motion.div>
              );
            })}
            ;
          </div>
        </div>
      </div>

      {/* image */}

      <div className="flex justify-center items-center  ">
        <motion.img
          initial={{ opacity: 0, x: 200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          src={demoImg}
          alt="Ai Related Image"
          className=" px-2 w-[550px] md:w-[550px] xl:w-[700px]"
        />
      </div>
    </div>
  );
};

export default WhyChooseOurPlatform;

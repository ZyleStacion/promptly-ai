import React from "react";
import HeroImg from "../../assets/Hero.png";
import { LuBrain } from "react-icons/lu";
import { FiPlay, FiPause } from "react-icons/fi";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";
import HeroVideo from "../../assets/herovideo.mp4";

const Hero = () => {
  const navigate = useNavigate();
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const handleEnded = () => setIsPlaying(false);

  return (
    <div className=" bg-gray-900 containers grid grid-cols-1 md:grid-cols-2 min-h-[650px] md:px-5 relative">
      {/* brand infor */}
      <div className=" flex flex-col mt-5 xl:pt-24 md:pt-24 px-8 pb-10 md:pr-10 xl:pr-30 ">
        <div className=" text-center md:text-left space-y-6">
          <motion.p
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className=" text-blue-400 font-bold flex items-center "
          >
            <LuBrain />
            AI Model Training Platform
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className=" text-white text-5xl font-semibold"
          >
            Train Your Own{" "}
            <p className=" font-bold inline-block bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text">
              AI Model
            </p>{" "}
            for Your Business
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className=" text-white pr-5"
          >
            Chat with our AI, upload your business data, and get a customized AI
            model trained specifically for your needs. Download and deploy it
            locally.
          </motion.p>

          {/* button section */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className=" space-x-5"
          >
            <button
              onClick={() => {
                const isLoggedIn = !!localStorage.getItem("token");
                if (isLoggedIn) navigate("/dashboard");
                else navigate("/signin");
              }}
              className="primary-btn"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/documentation")}
              className="text-white underline"
            >
              Learn More
            </button>
          </motion.div>

          {/* yapping */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="   flex space-x-10 text-white justify-center md:justify-start xl:jus"
          >
            <div>
              <p className=" font-bold text-3xl">
                {" "}
                <CountUp
                  start={0}
                  end={500}
                  duration={2}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />{" "}
                <span className="  inline-flex">+</span>
              </p>
              <p>Businesses</p>
            </div>
            <div>
              <p className=" font-bold text-3xl">
                <CountUp
                  start={0}
                  end={10000}
                  duration={2}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />{" "}
                <span className="  inline-flex">+</span>
              </p>
              <p>Models Trained</p>
            </div>
            <div>
              <p className=" font-bold text-3xl">
                <CountUp
                  start={0}
                  end={99}
                  duration={2}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />{" "}
                <span className="  inline-flex">%</span>
              </p>
              <p>Satisfaction</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero video */}

      <div className="relative h-full w-full justify-center flex items-center mt-10 md:mt-5 ">
        <motion.video
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          ref={videoRef}
          className="h-full w-full md:h-[650px] md:w-full rounded-lg object-cover p-3"
          src={HeroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onEnded={handleEnded}
        />

        {/* Play/Pause button bottom-left */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className="absolute bottom-3 left-3 z-30 bg-black/50 hover:bg-black/60 text-white p-2 rounded-full flex items-center justify-center"
        >
          {isPlaying ? (
            <FiPause className="w-5 h-5" />
          ) : (
            <FiPlay className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Hero;

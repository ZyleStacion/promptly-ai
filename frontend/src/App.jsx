import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import WhyChooseOurPlatform from "./components/WhyChooseOurPlatform/WhyChooseOurPlatform";
import Footer from "./components/Footer/Footer";
import SignIn from "./components/SignIn,Up/SignIn";
import SignUp from "./components/SignIn,Up/SignUp";

const HomePage = () => (
  <main className="overflow-x-hidden bg-gray-900">
    <Hero />
    <HowItWorks />
    <WhyChooseOurPlatform />
    <Footer />
  </main>
);

export const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;

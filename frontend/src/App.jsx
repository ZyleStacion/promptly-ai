import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import WhyChooseOurPlatform from "./components/WhyChooseOurPlatform/WhyChooseOurPlatform";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import SignIn from "./components/SignIn,Up/SignIn";
import SignUp from "./components/SignIn,Up/SignUp";
import Dashboard from "./components/Dashboard/Dashboard"; 
import AccountSetting from "./components/Dashboard/AccountSettings";
import Documentation from "./components/Documentation/Documentation"; 

const HomePage = () => (
  <main className="overflow-x-hidden bg-gray-900">
    <Navbar />
    <Hero />
    <HowItWorks />
    <WhyChooseOurPlatform />
    <Footer />
  </main>
);

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/settings" element={<AccountSetting />} />
        <Route path="/documentation" element={<Documentation />} />
      </Routes>
    </Router>
  );
};

export default App;

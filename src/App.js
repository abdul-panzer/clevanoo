import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route } from "react-router-dom";

// Import page components
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Aboutus from "../src/components/About";
import WhatMakesUs from "../src/components/WhatMakesUs";
import OurApproach from "../src/components/OurApproach";
import OurMission from "../src/components/OurMission";
import WhatWeDo from "../src/components/WhatWeDo";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";

function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, anchorPlacement: "top-bottom" });
  }, []);

  return (
    <div>
      <Navbar />      
      <ScrollToTop />
      <AnimatePresence>
        <motion.main
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HomePage />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <Aboutus />
                  <WhatMakesUs />
                </>
              }
            />
            <Route
              path="/services"
              element={
                <>
                <OurApproach />
                <OurMission />
                <WhatWeDo />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <ContactPage />
                </>
              }
            />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Import page components
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import IndustriesPage from "./pages/IndustriesPage";
import Aboutus from "../src/components/About";
import WhatMakesUs from "../src/components/WhatMakesUs";
import OurApproach from "../src/components/OurApproach";
import OurMission from "../src/components/OurMission";
import WhatWeDo from "../src/components/WhatWeDo";
import ScrollToTop from "./components/ScrollToTop";
import ContactPage from "./pages/ContactPage";
import UnsubscribePage from "./pages/UnsubscribeEmailPage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from './pages/JobDetailPage';
import JobUploadPage from './pages/JobUploadPage';
import SpecialityPage from './pages/SpecialityPage';
import PortfolioPage from "./pages/PortfolioPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";

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
                  <ServicesPage />
                </>
              }
            />
            <Route
              path="/industries"
              element={
                <>
                  <IndustriesPage />
                </>
              }
            />
            <Route
              path="/zendesk"
              element={
                <>
                  <PortfolioPage />
                </>
              }
            />
            <Route
              path="/case-studies"
              element={
                <>
                  <CaseStudiesPage />
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
            <Route
              path="/unsubscribe-email"
              element={
                <>
                  <UnsubscribePage />
                </>
              }
            />
            <Route
              path="/jobs"
              element={
                <>
                  <JobsPage />
                </>
              }
            />
            <Route
              path="/job/:id"
              element={
                <>
                  <JobDetailPage />
                </>
              }
            />
            <Route
              path="/speciality"
              element={
                <>
                  <SpecialityPage />
                </>
              }
            />
            <Route
              path="/jobUpload"
              element={
                <>
                  <JobUploadPage />
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

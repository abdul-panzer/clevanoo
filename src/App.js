import React, { Suspense, lazy, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";

const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const IndustriesPage = lazy(() => import("./pages/IndustriesPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const UnsubscribePage = lazy(() => import("./pages/UnsubscribeEmailPage"));
const JobsPage = lazy(() => import("./pages/JobsPage"));
const JobDetailPage = lazy(() => import("./pages/JobDetailPage"));
const JobUploadPage = lazy(() => import("./pages/JobUploadPage"));
const SpecialityPage = lazy(() => import("./pages/SpecialityPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage"));
const Aboutus = lazy(() => import("./components/About"));
const WhatMakesUs = lazy(() => import("./components/WhatMakesUs"));

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
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/about"
                element={
                  <>
                    <Aboutus />
                    <WhatMakesUs />
                  </>
                }
              />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/industries" element={<IndustriesPage />} />
              <Route path="/zendesk" element={<PortfolioPage />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/unsubscribe-email" element={<UnsubscribePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/job/:id" element={<JobDetailPage />} />
              <Route path="/speciality" element={<SpecialityPage />} />
              <Route path="/jobUpload" element={<JobUploadPage />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;

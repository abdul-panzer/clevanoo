import React from "react";
import Hero from "../components/Hero";
import Aboutus from "../components/About";
import WhatMakesUs from "../components/WhatMakesUs";
import OurApproach from "../components/OurApproach";
import OurMission from "../components/OurMission";
import WhatWeDo from "../components/WhatWeDo";
import JobCategories from "../components/JobCategories";
import AICybersecurityServices from "../components/AICybersecurityServices";
import NewJobs from "../components/NewJobs";
import JobGallery from "../components/JobGallery";
import CareerTips from "../components/CareerTips";
import Testimonials from "../components/Testimonials";
import LetsBuildTogeather from "../components/LetsBuildTogeather";
// import Subscription from "../components/Subscription";
// import Contactus from "../components/Contact";

const HomePage = () => (
  <>
    <Hero />
    <Aboutus />
    <WhatMakesUs />
    <OurApproach />
    <OurMission />
    <WhatWeDo />
    <JobCategories />
    <AICybersecurityServices />
    <NewJobs />
    <JobGallery />
    <CareerTips />
    <Testimonials />
    {/* <Subscription /> */}
    {/* <Contactus /> */}
    <LetsBuildTogeather />
  </>
);

export default HomePage;

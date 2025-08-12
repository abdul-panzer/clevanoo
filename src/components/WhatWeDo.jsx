import React from "react";

import "./WhatWeDo.css";

const services = [
    {
        number: "01",
        title: "IT Staffing & Talent Solutions",
        description: "We provide contract, contract-to-hire, and direct placement services. Access pre-vetted candidates across software development, cloud, cybersecurity, DevOps, data science, and more.",
        image: "/assets/images/1.png"
    },
    {
        number: "02",
        title: "AI-Powered Talent Matching",
        description: "Our intelligent platform matches roles with precision, reducing time-to-hire and increasing retention. Enhanced candidate profiling ensures technical and cultural fit.",
        image: "/assets/images/2.png"
    },
    {
        number: "03",
        title: "Workforce Consulting",
        description: "Strategic staffing guidance to help scale your team effectively and efficiently. Market insights, salary benchmarks, and hiring strategies tailored to your business.",
        image: "/assets/images/3.png"
    },
    {
        number: "04",
        title: "Support for Candidates",
        description: "Resume reviews, interview prep, and coaching for tech professionals at every level. Exclusive access to top employers and exciting projects.",
        image: "/assets/images/4.png"
    }
];

const WhatWeDo = () => {
    return (
        <section className="what-we-do py-5">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="display-6 fw-bold text-dark mb-3">What We Do</h2>
                </div>
                <div className="row g-0">
                    {services.map((service, index) => (
                        <div className="col-lg-3 col-md-6" key={index}>
                            <div
                                className="service-card"
                                style={{ backgroundImage: `url(${service.image})` }}
                            >
                                <div className="overlay" />
                                <div className={`content text-white p-4 text-center d-flex ${index % 2 === 0 ? "flex-column" : "flex-column-reverse"} h-100 justify-content-between`}>
                                    <div className="service-number display-6 fw-light">
                                        {service.number}
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-2">{service.title}</h5>
                                        <p className="small">{service.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhatWeDo;

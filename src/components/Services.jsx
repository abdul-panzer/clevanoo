import React from "react";
import content from "../content";

const Services = () => {
  return (
    <section id="services" className="py-5 bg-light mt-4">
      <div className="container mt-4">
        <h2 className="text-center mb-4" data-aos="fade-up">
          What We Do
        </h2>
        <div className="row">
          {content.services.map((s, idx) => (
            <div
              key={idx}
              className="col-md-4"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <div className="p-4 h-100 shadow-sm rounded bg-white">
                <h5>{s.title}</h5>
                <p className="small">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

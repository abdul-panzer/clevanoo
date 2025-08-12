import React from "react";
import content from "../content";

const About = () => {
  return (
    <section id="about" className="py-5 mt-5">
      <div className="container">
        <div className="text-center mb-5">
          <button className="btn border-button-design-black px-4 py-2 mb-3 text-black">
            About us
          </button>
          <h2 className="display-6 fw-bold text-dark mb-3">Clevanoo LLC</h2>
          <h1 className="lead text-muted">
            At Clevanoo LLC, we are a results-driven IT staffing and recruitment firm dedicated to connecting top-tier technology <br />talent with forward-thinking companies across industries.<br />
            Our mission is simple yet powerful: deliver the right talent, at the right time, with the right fit.
          </h1>
        </div>
        <div className="row align-items-center">
          <div className="col-lg-6" data-aos="fade-right">
          </div>
          <div className="col-lg-6" data-aos="fade-left">
            <h3 className="fw-bold text-dark mb-3">Our Story</h3>
            <p className="lead text-muted">
              {content.ourStory.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

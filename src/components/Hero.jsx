import React from "react";

const Hero = () => {
  return (
    <section
      id="hero"
      className="hero d-flex align-items-center text-white position-relative"
      style={{
        backgroundImage: 'url("./assets/images/hero-bg.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        paddingTop: '80px'
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-6" data-aos="fade-right">
            <div className="hero-content">
              <div className="job-count mb-3">
                <span className="border-button-design px-3 py-2 fs-6">
                  WE HAVE 500+ LIVE JOBS
                </span>
              </div>
              <h1 className="display-4 fw-bold mb-4">
                We find the talent, <br /><span className="text-border-white">you lead</span> the innovation
              </h1>
              <p className="lead mb-4">
                We bridge the gap between top tier IT professionals and forward thinking companies, 
                creating partnerships that fuel digital transformation and lasting competitive advantage.
              </p>
              <button className="btn btn-lg px-4 py-3 text-white pill-button-design">
                <span className="rounded-pill"></span>
                <a href="/about" className="btn-text text-decoration-none text-white">Find Out More</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

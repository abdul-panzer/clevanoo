import React from "react";

const AICybersecurityServices = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          {/* <div className="d-inline-flex align-items-center gap-3 mb-4">
            <div className="bg-primary bg-opacity-10 rounded-circle p-3">
              <i className="fas fa-microchip fa-2x text-primary"></i>
            </div>
            <div className="bg-success bg-opacity-10 rounded-circle p-3">
              <i className="fas fa-shield-alt fa-2x text-success"></i>
            </div>
          </div> */}
          <h2 className="display-6 fw-bold text-dark mb-4">AI & Cybersecurity Staffing</h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <p className="lead text-muted mb-0">
                Elite talent solutions for artificial intelligence and cybersecurity professionals
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="row g-4 mb-5">
          {/* AI Staffing */}
          <div className="col-lg-6">
            <div className="rounded border-0 shadow-lg h-100">
              <div className="card-body p-0">
                <div className="text-black p-4 rounded-top">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-white bg-opacity-20 rounded-circle p-3 me-3 shadow">
                      <i className="fas fa-microchip fa-2x text-primary"></i>
                    </div>
                    <div>
                      <h3 className="h4 mb-1">AI Staffing Services</h3>
                      <p className="mb-0 opacity-75">Artificial Intelligence Talent Solutions</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="h5 fw-bold text-dark mb-3">Drive Innovation with Top AI Talent</h4>
                  <p className="text-muted mb-4">
                    Connect with elite AI professionals who transform your business through cutting-edge machine learning, deep learning, and automation technologies.
                  </p>

                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <h6 className="primary-color fw-bold mb-3">Core Expertise Areas</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {[
                          "Machine Learning", "Data Science", "NLP", "Computer Vision", 
                          "Deep Learning", "AI Research", "Automation", "Model Deployment"
                        ].map((skill, index) => (
                          <span key={index} className="badge bg-light text-dark px-3 py-2">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-light rounded-3 p-3 mb-4">
                    <h6 className="fw-bold text-dark mb-3">Why Partner With Us</h6>
                    <div className="row g-2">
                      {[
                        "Pre-vetted AI experts",
                        "Rapid deployment",
                        "Flexible hiring models", 
                        "Startup to enterprise scale",
                        "Cutting-edge tech focus"
                      ].map((benefit, index) => (
                        <div key={index} className="col-6">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-check-circle text-success me-2"></i>
                            <small className="text-muted">{benefit}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="d-grid">
                    <button className="btn btn-primary btn-lg">
                      Hire AI Talent Today
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cybersecurity Staffing */}
          <div className="col-lg-6">
            <div className="shadow-lg h-100 rounded">
              <div className="card-body p-0">
                <div className="text-black p-4 rounded-top">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-white bg-opacity-20 rounded-circle p-3 me-3 shadow">
                      <i className="fas fa-shield-alt fa-2x text-success"></i>
                    </div>
                    <div>
                      <h3 className="h4 mb-1">Cybersecurity Staffing</h3>
                      <p className="mb-0 opacity-75">Security & Protection Talent Solutions</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="h5 fw-bold text-dark mb-3">Protect Your Business with Security Experts</h4>
                  <p className="text-muted mb-4">
                    Build your security fortress with certified cybersecurity professionals who defend against evolving threats and ensure compliance.
                  </p>

                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <h6 className="primary-color fw-bold mb-3">Security Specializations</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {[
                          "Network Security", "Cloud Security", "Threat Detection", "Incident Response",
                          "Risk Management", "Compliance", "IAM", "Security Architecture"
                        ].map((skill, index) => (
                          <span key={index} className="badge bg-light text-dark px-3 py-2">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-light rounded-3 p-3 mb-4">
                    <h6 className="fw-bold text-dark mb-3">Why Choose Our Security Experts</h6>
                    <div className="row g-2">
                      {[
                        "Certified professionals",
                        "Urgent response capability",
                        "Compliance expertise",
                        "Proactive threat prevention",
                        "24/7 security support"
                      ].map((benefit, index) => (
                        <div key={index} className="col-6">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-check-circle text-success me-2"></i>
                            <small className="text-muted">{benefit}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="d-grid">
                    <button className="btn btn-primary btn-lg">
                      Hire Security Experts Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {/* <div className="bg-white rounded-4 shadow-sm p-5">
          <div className="row text-center">
            <div className="col-md-4 mb-3">
              <div className="bg-primary bg-opacity-10 rounded-3 p-4">
                <div className="h2 text-primary fw-bold mb-2">500+</div>
                <p className="text-muted mb-0">AI Professionals Placed</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="bg-success bg-opacity-10 rounded-3 p-4">
                <div className="h2 text-success fw-bold mb-2">300+</div>
                <p className="text-muted mb-0">Security Experts Deployed</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="bg-info bg-opacity-10 rounded-3 p-4">
                <div className="h2 text-info fw-bold mb-2">48h</div>
                <p className="text-muted mb-0">Average Response Time</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default AICybersecurityServices;

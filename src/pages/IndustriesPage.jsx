import React from "react";
import { Link } from "react-router-dom";

const IndustriesPage = () => {
  const industries = [
    {
      title: "Technology & Engineering",
      icon: "fas fa-microchip",
      description: "Cutting-edge technology and engineering solutions for the digital age",
      subIndustries: [
        "Information Technology & Services",
        "Telecommunications",
        "Semiconductors",
        "Industrial Automation",
        "Electrical & Electronic Manufacturing",
        "Mechanical Engineering",
        "Program Development"
      ]
    },
    {
      title: "Healthcare & Life Sciences",
      icon: "fas fa-heartbeat",
      description: "Healthcare innovation and life sciences breakthrough talent",
      subIndustries: [
        "Hospital & Health Care",
        "Biotechnology",
        "Medical Device",
        "Pharmaceuticals"
      ]
    },
    {
      title: "Finance & Business Services",
      icon: "fas fa-chart-line",
      description: "Financial expertise and business services excellence",
      subIndustries: [
        "Financial Services",
        "Banking",
        "Accounting",
        "Real Estate"
      ]
    },
    {
      title: "Manufacturing & Industrial",
      icon: "fas fa-industry",
      description: "Industrial manufacturing and production expertise",
      subIndustries: [
        "Automobile",
        "Chemicals",
        "Plastics",
        "Machinery",
        "Mining & Metals",
        "Shipbuilding"
      ]
    },
    {
      title: "Energy & Infrastructure",
      icon: "fas fa-bolt",
      description: "Energy solutions and infrastructure development talent",
      subIndustries: [
        "Oil & Energy",
        "Utilities",
        "Renewables & Environment",
        "Construction",
        "Civil Engineering"
      ]
    },
    {
      title: "Aviation & Defense",
      icon: "fas fa-plane",
      description: "Aerospace innovation and defense sector expertise",
      subIndustries: [
        "Aviation & Aerospace",
        "Defense & Space",
        "Airlines/Aviation"
      ]
    },
    {
      title: "Logistics & Supply Chain",
      icon: "fas fa-truck",
      description: "Logistics excellence and supply chain optimization",
      subIndustries: [
        "Logistics & Supply Chain",
        "Transportation/Trucking/Railroad",
        "Warehousing",
        "Maritime"
      ]
    },
    {
      title: "Creative & Innovation",
      icon: "fas fa-palette",
      description: "Creative talent and innovation-driven professionals",
      subIndustries: [
        "Textiles",
        "Food & Beverages",
        "Food Production",
        "Design",
        "Research",
        "Animation",
        "Nanotechnology",
        "Wireless",
        "Architecture & Planning"
      ]
    }
  ];

  return (
    <div className="container py-5 mt-5">
      {/* Header */}
      <div className="text-center mb-5">
        <button className="btn border-button-design-black px-4 py-2 mb-3 text-black">
          Industries We Serve
        </button>
        <h1 className="display-5 fw-bold text-dark mb-4">Industries</h1>
        <p className="lead text-muted">
          Specialized staffing solutions across diverse industries and sectors
        </p>
        <p className="lead text-muted">
          Clevanoo LLC provides industry-focused recruitment expertise, connecting top talent with leading organizations across multiple sectors. Our deep understanding of industry-specific challenges and requirements ensures perfect matches that drive business success.
        </p>
      </div>

      {/* Industries Grid */}
      <div className="row g-4 mb-5">
        {industries.map((industry, index) => (
          <div key={index} className="col-lg-6 col-xl-4 mb-4" data-aos="fade-up" data-aos-delay={index * 100}>
            <div className="card h-100 border-0 shadow-sm hover-lift">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="icon-box bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                    <i className={`${industry.icon} fa-2x primary-color`}></i>
                  </div>
                  <h4 className="card-title fw-bold mb-3">{industry.title}</h4>
                  <p className="text-muted small mb-4">{industry.description}</p>
                </div>

                <div className="industry-list">
                  <h6 className="primary-color mb-3">Key Sectors:</h6>
                  <ul className="list-unstyled small">
                    {industry.subIndustries.map((subIndustry, subIndex) => (
                      <li key={subIndex} className="mb-2">
                        <i className="fas fa-chevron-right primary-color me-2"></i>
                        {subIndustry}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Why Choose Industry Expertise */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-5">
              <div className="row align-items-center">
                <div className="col-lg-6 mb-4 mb-lg-0">
                  <h3 className="h4 fw-bold text-dark mb-4">Industry-Focused Recruitment Excellence</h3>
                  <p className="lead text-muted mb-4">
                    Our industry-specific expertise ensures we understand the unique challenges, requirements, and talent needs of each sector we serve.
                  </p>
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <i className="fas fa-check-circle text-success me-3"></i>
                      <strong>Deep Industry Knowledge:</strong> We understand sector-specific trends and requirements
                    </li>
                    <li className="mb-3">
                      <i className="fas fa-check-circle text-success me-3"></i>
                      <strong>Specialized Talent Pools:</strong> Access to industry-specific professional networks
                    </li>
                    <li className="mb-3">
                      <i className="fas fa-check-circle text-success me-3"></i>
                      <strong>Regulatory Compliance:</strong> Expertise in industry regulations and compliance requirements
                    </li>
                    <li className="mb-3">
                      <i className="fas fa-check-circle text-success me-3"></i>
                      <strong>Scalable Solutions:</strong> Flexible staffing models tailored to industry needs
                    </li>
                  </ul>
                </div>
                <div className="col-lg-6">
                  <div className="text-center">
                    <div className="bg-white rounded-3 p-4 shadow-sm">
                      <h5 className="mb-3">Ready to Find Industry-Specific Talent?</h5>
                      <p className="text-muted mb-4">
                        Connect with our industry experts to discover how we can help you find the perfect talent match for your specific sector.
                      </p>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        <Link to="/contact" className="btn pill-button-design btn-lg text-decoration-none">
                          <span className="rounded-pill"></span>
                          <span className="btn-text text-black">Speak with an Expert</span>
                        </Link>
                        {/* <button className="btn border-button-design-black text-black">
                          Download Industry Guide
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {/* <div className="row mb-5">
        <div className="col-12">
          <div className="text-center">
            <h3 className="mb-5">Our Industry Impact</h3>
            <div className="row g-4">
              <div className="col-md-3">
                <div className="stat-item">
                  <h2 className="display-4 fw-bold primary-color mb-2">50+</h2>
                  <p className="text-muted">Industries Served</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-item">
                  <h2 className="display-4 fw-bold primary-color mb-2">10,000+</h2>
                  <p className="text-muted">Industry Professionals Placed</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-item">
                  <h2 className="display-4 fw-bold primary-color mb-2">95%</h2>
                  <p className="text-muted">Client Satisfaction</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-item">
                  <h2 className="display-4 fw-bold primary-color mb-2">24-48h</h2>
                  <p className="text-muted">Average Placement Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="text-center mt-5">
        <h3 className="mb-4">Find Your Industry-Specific Talent Solution</h3>
        <p className="lead text-muted mb-4">
          Whether you're in technology, healthcare, finance, or any other industry, we have the expertise to find the perfect talent match for your organization.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button className="btn pill-button-design btn-lg">
            <span className="rounded-pill"></span>
            <span className="btn-text text-black">Explore Industry Solutions</span>
          </button>
          {/* <button className="btn border-button-design-black text-black">
            Schedule Consultation
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default IndustriesPage;

import React from "react";
import { Link } from "react-router-dom";

const DirectHireContractServices = () => {
  const directHireIndustries = [
    "Technology & Engineering: Information Technology & Services, Telecommunications, Semiconductors, Industrial Automation, Electrical & Electronic Manufacturing, Mechanical Engineering, Program Development",
    "Healthcare & Life Sciences: Hospital & Health Care, Biotechnology, Medical Device, Pharmaceuticals",
    "Finance & Business Services: Financial Services, Banking, Accounting, Real Estate",
    "Manufacturing & Industrial: Automobile, Chemicals, Plastics, Machinery, Mining & Metals, Shipbuilding",
    "Energy & Infrastructure: Oil & Energy, Utilities, Renewables & Environment, Construction, Civil Engineering",
    "Aviation & Defense: Aviation & Aerospace, Defense & Space, Airlines/Aviation",
    "Logistics & Others: Logistics & Supply Chain, Transportation/Trucking/Railroad, Warehousing, Maritime, Textiles, Food & Beverages, Food Production, Design, Research, Animation, Nanotechnology, Wireless, Architecture & Planning"
  ];

  const contractIndustries = [
    "Information Technology & Services", "Food Production", "Construction", "Aviation & Aerospace",
    "Financial Services", "Biotechnology", "Accounting", "Chemicals", "Industrial Automation",
    "Utilities", "Medical Device", "Airlines/Aviation", "Oil & Energy", "Semiconductors",
    "Mechanical Engineering", "Telecommunications", "Electrical & Electronic Manufacturing",
    "Program Development", "Food & Beverages", "Defense & Space", "Civil Engineering",
    "Nanotechnology", "Design", "Pharmaceuticals", "Research", "Animation", "Machinery", "Wireless"
  ];

  return (
    <section className="py-5 mt-5">
      <div className="container">

        {/* Our Staffing Services */}
        <section className="pb-5 text-white position-relative" style={{ backgroundColor: '#2c3e50', margin: '0 calc(-50vw + 50%)', left: '0', right: '0', width: '100vw' }}>
          <div
            className="position-absolute w-100 h-100"
            style={{
              backgroundImage: 'url("/assets/images/ourmission.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0
            }}
          ></div>

          <div className="container position-relative pt-5" style={{ zIndex: 1 }}>
            <div className="row">
              <div className="col-lg-12">
                <div className="col-lg-12 mb-5 text-center" data-aos="fade-right">
                  <button className="btn border-button-design-black px-4 py-2 mb-3 text-black">
                    Our Staffing Services
                  </button>
                  <p className="lead mb-4 text-center text-black">
                    We offer flexible and scalable staffing solutions tailored to your business needs:
                  </p>
                  <div className="row justify-content-center">
                    <div className="col-md-5 mb-3">
                      <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                          <h4 className="h5 fw-bold text-dark mb-2">Direct Hire Staffing</h4>
                          <p className="text-muted mb-0">Permanent talent for long-term success</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5 mb-3">
                      <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                          <h4 className="h5 fw-bold text-dark mb-2">Contract Hire Staffing</h4>
                          <p className="text-muted mb-0">Flexible workforce for project-based needs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Direct Hire & Contract Staffing Cards */}
        <div className="row mb-5 mt-4">
          <div className="col-lg-6 mb-4">
            <div className="card h-100 border-0 shadow-sm hover-lift d-flex flex-column">
              <div className="card-body p-4 d-flex flex-column">
                <div className="mb-3">
                  <h4 className="border-button-design py-2 text-black">
                    Direct Hire Staffing
                  </h4>
                </div>

                <h4 className="h5 mb-3">Find the Right Permanent Talent for Your Organization</h4>
                <p className="text-muted mb-4">
                  Hiring the right full-time employee is critical in today's competitive market. Our Direct Hire Staffing Services help organizations streamline hiring by identifying professionals who not only meet technical requirements but also align with company culture and long-term goals.
                </p>
                <p className="text-muted mb-4">
                  At Clevanoo LLC, we take a strategic approach to permanent recruitment, ensuring you hire candidates who contribute to innovation, productivity, and business growth.
                </p>

                <h5 className="h6 mb-3">Why Choose Our Direct Hire Staffing Solutions?</h5>
                <ul className="list-unstyled mb-4">
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Access to pre-vetted, highly skilled professionals
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Thorough Screening
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Industry-specific recruitment expertise
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Reduced hiring time and cost
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Strong focus on cultural and organizational fit
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Quality Submissions
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    End-to-end recruitment support
                  </li>
                </ul>

                <div className="mt-auto">
                  <button className="btn pill-button-design btn-lg">
                    <span className="rounded-pill"></span>
                    <span className="btn-text text-black">Hire Permanent Talent Today</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card h-100 border-0 shadow-sm hover-lift d-flex flex-column">
              <div className="card-body p-4 d-flex flex-column">
                <div className="mb-3">
                  <h4 className="border-button-design py-2 text-black">
                    Contract Hire Staffing
                  </h4>
                </div>

                <h4 className="h5 mb-3">Flexible Staffing Solutions for Dynamic Business Needs</h4>
                <p className="text-muted mb-4">
                  Our Contract Hire Staffing Services provide businesses with the agility to scale teams quickly. Whether you need professionals for short-term projects, long-term assignments, or specialized roles, we deliver high-quality contract talent with speed and efficiency.
                </p>

                <p className="text-muted mb-4">
                  Clevanoo LLC ensures that your business remains productive without the burden of long-term hiring commitments.
                </p>

                <h5 className="h6 mb-3">Why Choose Our Contract Staffing Services?</h5>
                <ul className="list-unstyled mb-4">
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Rapid access to skilled contract professionals
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Flexible hiring models (short-term, long-term, part-time)
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Cost-effective staffing solutions
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Quick turnaround time for urgent requirements
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Access to niche and specialized talent
                  </li>
                </ul>

                <div className="mt-auto">
                  <button className="btn pill-button-design btn-lg">
                    <span className="rounded-pill"></span>
                    <span className="btn-text text-black">Hire Contract Talent Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Industries We Serve */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="border-0">
              <div className="card-body p-4">
                <div className="text-center mb-5">
                  <button className="btn border-button-design-black px-4 py-2 mb-3 text-black">
                    Industries We Serve
                  </button>
                  <h3 className="h4 fw-bold text-dark mb-3">Comprehensive Industry Coverage</h3>
                  <p className="lead text-muted">
                    We provide specialized staffing solutions across diverse sectors, matching top talent with industry-leading organizations.
                  </p>
                </div>

                {/* Direct Hire Industries */}
                <div className="mb-5">
                  <div className="border-0 shadow-sm rounded-3 p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-light rounded-circle p-3 me-3">
                        <i className="fas fa-briefcase fa-lg primary-color"></i>
                      </div>
                      <div>
                        <h4 className="h5 fw-bold text-dark mb-1">Industries</h4>
                      </div>
                    </div>

                    <div className="row g-3">
                      {[
                        { icon: "fa-microchip", title: "Technology & Engineering", items: ["Information Technology & Services", "Telecommunications", "Semiconductors", "Industrial Automation", "Electrical & Electronic Manufacturing", "Mechanical Engineering", "Program Development"] },
                        { icon: "fa-heartbeat", title: "Healthcare & Life Sciences", items: ["Hospital & Health Care", "Biotechnology", "Medical Device", "Pharmaceuticals"] },
                        { icon: "fa-chart-line", title: "Finance & Business Services", items: ["Financial Services", "Banking", "Accounting", "Real Estate"] },
                        { icon: "fa-industry", title: "Manufacturing & Industrial", items: ["Automobile", "Chemicals", "Plastics", "Machinery", "Mining & Metals", "Shipbuilding"] },
                        { icon: "fa-bolt", title: "Energy & Infrastructure", items: ["Oil & Energy", "Utilities", "Renewables & Environment", "Construction", "Civil Engineering"] },
                        { icon: "fa-plane", title: "Aviation & Defense", items: ["Aviation & Aerospace", "Defense & Space", "Airlines/Aviation"] },
                        { icon: "fa-truck", title: "Logistics & Others", items: ["Logistics & Supply Chain", "Transportation/Trucking/Railroad", "Warehousing", "Maritime", "Textiles", "Food & Beverages", "Food Production", "Design", "Research", "Animation", "Nanotechnology", "Wireless", "Architecture & Planning"] }
                      ].map((category, index) => (
                        <div key={index} className="col-12">
                          <div className="bg-white border-0 shadow-sm rounded-2 p-3">
                            <div className="d-flex align-items-start">
                              <i className={`fas ${category.icon} primary-color me-3 mt-1`}></i>
                              <div className="flex-grow-1">
                                <h6 className="fw-bold text-dark mb-2">{category.title}</h6>
                                <div className="small text-muted" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                                  {category.items.map((item, itemIndex) => (
                                    <span key={itemIndex} className="d-inline-block me-2 mb-1">
                                      {itemIndex > 0 && <span className="mx-1">•</span>}
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* <div className="text-center mt-4">
                  <div className="bg-light rounded-3 p-3">
                    <p className="text-muted mb-0">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>50+ Industries Served</strong> • <strong>10,000+ Professionals Placed</strong> • <strong>95% Client Satisfaction</strong>
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="pb-5 text-white position-relative" style={{ backgroundColor: '#2c3e50' }}>
        <div
          className="position-absolute w-100 h-100"
          style={{
            backgroundImage: 'url("/assets/images/ourmission.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        ></div>
        <div className="container position-relative pt-5" style={{ zIndex: 1 }}>
          <div className="text-center mt-5">
            <h3 className="mb-4 text-black">Partner with Clevanoo LLC Today</h3>
            <p className="lead text-muted mb-4">
              Whether you're looking for permanent employees or contract professionals, Clevanoo LLC is your trusted partner for IT staffing and recruitment services.
            </p>
            <p className="lead text-muted mb-4">
              Contact us today to build your high-performing team.
            </p>
            <div className="mt-auto">
              <Link to="/contact" className="btn pill-button-design btn-lg text-decoration-none">
                <span className="rounded-pill"></span>
                <span className="btn-text text-black">Contact Us Today</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </section >
  );
};

export default DirectHireContractServices;

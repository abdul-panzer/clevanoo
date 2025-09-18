import React from "react";

const JobCategories = () => {
  const categories = [
    {
      icon: "/assets/images/af.png",
      title: "Accounting / Finance",
      description: "Find your dream job in accounting and finance sector with top companies.",
      image: "/assets/images/accounting-finance.png"
    },
    {
      icon: "/assets/images/t.png",
      title: "Technology",
      description: "Explore exciting opportunities in the ever-evolving tech industry.",
      image: "/assets/images/technology.png"
    },
    {
      icon: "/assets/images/tc.png",
      title: "Tele-communications",
      description: "Connect with leading telecom companies and advance your career.",
      image: "/assets/images/tele-communications.png"
    },
    {
      icon: "/assets/images/h.png",
      title: "Healthcare",
      description: "Make a difference in healthcare with rewarding career opportunities.",
      image: "/assets/images/healthcare.png"
    }
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <button className="btn border-button-design-black px-4 py-2 mb-3 text-black">
            Find Best Jobs
          </button>
          <h2 className="display-6 fw-bold text-dark mb-3">Browse Jobs Categories</h2>
          <p className="lead text-muted">
            Find your dream jobs. Carefully crafted after analyzing the needs of different industries.
          </p>
        </div>

        <div className="row g-4">
          {categories.map((category, index) => (
            <div key={index} className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="card h-100 border-system-gray job-card">
                <div className="card-body text-center p-4">
                  <div className="mb-3 d-flex flex-row align-items-center justify-content-start">
                    {/* <i className={`${category.icon} fa-2x text-primary`}></i> */}
                    <img
                      src={category.icon}
                      className="rounded-circle"
                      width="50"
                      height="50" alt=""
                    />
                  </div>
                  <div className="mb-3 d-flex flex-row align-items-center justify-content-between">
                    <hr style={{ height: '1px', width: '65%' }} />
                    <img
                      src={category.image}
                      alt={category.title}
                      className="rounded-circle"
                      width="60"
                      height="60"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h5 className="card-title fw-bold mb-3">{category.title}</h5>
                  <p className="card-text text-muted mb-4">{category.description}</p>
                  {/* <button className="btn readmore-button border-system-gray">READ MORE 
                  <svg width="9" height="8" viewBox="0 0 9 8" fill="none">
                    <path d="M0.586777 7.50722L8.08242 1.69826M8.08242 1.69826L2.98946 0.931903M8.08242 1.69826L7.55364 6.82134" stroke="black" strokeWidth="0.677362" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  </button> */}
                  <a href="/jobs" className="btn readmore-button border-system-gray">More Jobs <svg width="9" height="8" viewBox="0 0 9 8" fill="none">
                      <path d="M0.586777 7.50722L8.08242 1.69826M8.08242 1.69826L2.98946 0.931903M8.08242 1.69826L7.55364 6.82134" stroke="black" strokeWidth="0.677362" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="text-center mt-5">
          <div className="d-flex justify-content-center gap-2">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div
                key={dot}
                className="rounded-circle"
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: dot === 1 ? '#007bff' : '#dee2e6',
                  cursor: 'pointer'
                }}
              ></div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default JobCategories;

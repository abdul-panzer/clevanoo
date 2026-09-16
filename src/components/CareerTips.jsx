import React from "react";

const CareerTips = () => {
  const tips = [
    {
      title: "Networking Strategies",
      description: "Build meaningful professional relationships that can open doors to new opportunities and career growth.",
      image: "/assets/images/qt1.webp"
    },
    {
      title: "Resume Optimization",
      description: "Learn how to craft a compelling resume that stands out to recruiters and hiring managers.",
      image: "/assets/images/qt2.webp"
    },
    {
      title: "Interview Preparation",
      description: "Master the art of interviewing with proven techniques and confidence-building strategies.",
      image: "/assets/images/qt3.webp"
    },
    {
      title: "Skill Development",
      description: "Stay competitive by continuously upgrading your skills and staying current with industry trends.",
      image: "/assets/images/qt4.webp"
    }
  ];

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="text-center mb-5">
          <button className="btn border-button-design-black text-black px-4 py-2 mb-3">
            Find Best Jobs
          </button>
          <h2 className="display-6 fw-bold text-dark mb-3">Quick Career Tips</h2>
          <p className="lead text-muted">
            Find your dream jobs. Carefully crafted after analyzing the needs of different industries.
          </p>
        </div>

        <div className="row g-4">
          {tips.map((tip, index) => (
            <div key={index} className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-0">
                  <div className="position-relative">
                    <img
                      src={tip.image}
                      alt={tip.title}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                      width="462"
                      height="303"
                      loading="lazy"
                      decoding="async"
                    />
                    <button className="position-absolute career-tips-readmore">Read More</button>
                  </div>
                  <div className="p-4">
                    <h5 className="card-title fw-bold mb-3">{tip.title}</h5>
                    <p className="card-text text-muted">{tip.description}</p>
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

export default CareerTips;

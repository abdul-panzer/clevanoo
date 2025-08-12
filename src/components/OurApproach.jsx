import React from "react";

const OurApproach = () => {
    const tips = [
        {
            title: "Personalized Staffing Solutions",
            description: "Tailored to your specific technical needs and growth plans.",
            image: "/assets/images/qt1.png"
        },
        {
            title: "Access to Top Tech Talent",
            description: "From software engineers and cloud architects to data scientists and cybersecurity experts. ",
            image: "/assets/images/qt2.png"
        },
        {
            title: "Fast, Efficient Recruitment",
            description: "Leveraging AI-driven sourcing and an extensive professional network.",
            image: "/assets/images/qt3.png"
        },
        {
            title: "Relationship-Focused Partnerships",
            description: "We value relationships over transactions, ensuring trust, transparency, and long-term success.",
            image: "/assets/images/qt4.png"
        }
    ];

    return (
        <section className="py-5 bg-white mt-5">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="display-6 fw-bold text-dark mb-3">Our Approach</h2>
                </div>

                <div className="row g-4">
                    {tips.map((tip, index) => (
                        <div key={index} className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
                            <div className="card h-100 border-0 shadow">
                                <div className="card-body p-0">
                                    <div className="position-relative">
                                        <img
                                            src={tip.image}
                                            alt={tip.title}
                                            className="card-img-top ourapproach-card shadow-lg"
                                        />
                                    </div>
                                    <div className="p-4 d-flex flex-column justify-content-between">
                                        <h6 className="card-title fw-bold mb-3">{tip.title}</h6>
                                        <p className="card-text text-muted">{tip.description}</p>
                                    </div>
                                </div>
                                <div className="card-footer border-0 bg-white pt-0">
                                    <a href="/about" className="text-decoration-none primary-color">Read More</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurApproach;

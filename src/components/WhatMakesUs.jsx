import React from "react";

const WhatMakesUs = () => {

    return (
        <section className="pb-5 text-white position-relative" style={{ backgroundColor: '#2c3e50' }}>
            <div
                className="position-absolute w-100 h-100"
                style={{
                    backgroundImage: 'url("/assets/images/latest-job-lisiting.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(3px)',
                    zIndex: 0
                }}
            ></div>

            <div className="container position-relative pt-5" style={{ zIndex: 1 }}>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="col-lg-12 mb-5" data-aos="fade-right">
                            <h2 className="display-5 fw-bold mb-4 text-center">What Makes Us Different</h2>
                            <p className="lead mb-4 text-center">
                                Clevanoo was created with a clear vision: to revolutionize IT recruitment through a unique blend of human insight and artificial intelligence.
                            </p>
                            <p className="lead mb-4 text-center">
                                By combining deep industry experience with smart sourcing technology, we streamline the hiring process—helping businesses hire the right people faster, without compromising on quality.
                            </p>
                            <p className="lead mb-4 text-center">
                                We go beyond the resume. Our process involves understanding your company culture, technical requirements, and long-term business goals to ensure every candidate not only fits the role but also thrives in your environment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatMakesUs;

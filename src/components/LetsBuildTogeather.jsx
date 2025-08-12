import React from "react";

const LetsBuildTogeather = () => {

    return (
        <section className="pb-3 text-white position-relative" style={{ backgroundColor: '#2c3e50' }}>
            <div
                className="position-absolute w-100 h-100"
                style={{
                    backgroundImage: 'url("/assets/images/latest-job-lisiting.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0
                }}
            ></div>

            <div className="container position-relative pt-5" style={{ zIndex: 1 }}>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="col-lg-12 mb-5 text-center text-white" data-aos="fade-right">
                            <h3 className="fw-bold mb-3">Let’s Build the Future, Together</h3>
                            <p className="lead mb-4 text-center">
                                Your team deserves the best — and so does your business. Partner with Clevanoo and experience<br /> the difference of a people-first, performance-driven staffing firm.
                            </p>
                            <h3 className="fw-bold">Start smart. Start strong. Start with Clevanoo</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LetsBuildTogeather;

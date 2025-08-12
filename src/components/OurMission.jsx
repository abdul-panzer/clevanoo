import React from "react";

const OutMission = () => {

    return (
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
                <div className="row">
                    <div className="col-lg-12">
                        <div className="col-lg-12 mb-5" data-aos="fade-right">
                            <h2 className="display-5 fw-bold mb-4 text-center text-dark">Our Mission</h2>
                            <p className="lead mb-4 text-center text-dark">
                                To empower businesses with exceptional IT staffing solutions that combine speed, precision, and cultural alignment- <br />
                                helping companies innovate, scale, and succeed in today’s competitive digital landscape.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OutMission;

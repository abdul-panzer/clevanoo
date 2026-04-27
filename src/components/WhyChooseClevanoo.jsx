import React from "react";

const WhyChooseClevanoo = () => {

  return (
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
        <div className="row mb-5">
          <div className="col-12">
            <div className="col-lg-12 mb-5 text-center" data-aos="fade-right">
              <button className="btn border-button-design-black px-4 py-2 mb-3 text-black text-center">
                Why Choose Clevanoo LLC
              </button>
            </div>
            <div className="card border-0 shadow-sm mt-4" data-aos="fade-left">
              <div className="card-body p-4">
                <div className="row text-center">
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="p-3">
                      <i className="fas fa-industry fa-2x primary-color mb-2"></i>
                      <h6>Industry-focused recruitment expertise</h6>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="p-3">
                      <i className="fas fa-brain fa-2x primary-color mb-2"></i>
                      <h6>Dual-perspective approach (technical + human insight)</h6>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="p-3">
                      <i className="fas fa-bolt fa-2x primary-color mb-2"></i>
                      <h6>Fast turnaround and quality hiring</h6>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="p-3">
                      <i className="fas fa-network-wired fa-2x primary-color mb-2"></i>
                      <h6>Strong talent network across multiple industries</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseClevanoo;

import React from "react";

const Contact = () => {
  return (
    <section id="contact" className="py-5">
      <div className="container">
        <h2 className="text-center mb-4" data-aos="fade-up">
          Get in Touch
        </h2>
        <div className="row justify-content-center">
          <div className="col-md-6" data-aos="fade-left">
            <form>
              <div className="mb-3">
                <label className="form-label">Your Name</label>
                <input className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea className="form-control" rows={4} />
              </div>
              <button className="btn btn-primary w-100" type="submit">
                Send Message
              </button>
            </form>
          </div>
          <div className="col-md-4" data-aos="fade-right">
            <div className="p-4 bg-white rounded shadow-sm">
              <h6>Contact Info</h6>
              <p className="mb-1">
                <i className="fa fa-phone me-2"></i> +1 (555) 555-5555
              </p>
              <p className="mb-1">
                <i className="fa fa-envelope me-2"></i> info@clevanoo.com
              </p>
              <p className="mb-0">
                <i className="fa fa-map-marker-alt me-2"></i> Remote / Global
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

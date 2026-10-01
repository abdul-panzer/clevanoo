import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-dark py-5">
      <div className="container">
        <div className="row g-4">
          {/* LOGO Column */}
          <div className="col-lg-3 col-md-6">
            <div className="mb-4">
              <img className="img-fluid rounded m-auto d-table" alt="Clevanoo" src="logo.webp" width="125" height="53" loading="lazy" decoding="async" />
            </div>
          </div>

          {/* Address Column */}
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Address</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                Clevanoo LLC<br />
                Suite 262<br />
                12800 Westridge Blvd<br />
                Frisco, TX 75035
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Contact</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <strong>Email:</strong> <a className="text-dark" href="mailto:info@clevanoo.com">info@clevanoo.com</a>
              </li>
              <li className="mb-2">
                <strong>Call:</strong> (949) 570-4008
              </li>
            </ul>
          </div>

          {/* For Employers Column */}
          {/* <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">For Employers</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/employers-list" className="text-dark text-decoration-none">Employers List</Link>
              </li>
              <li className="mb-2">
                <Link to="/employers-grid" className="text-dark text-decoration-none">Employers Grid</Link>
              </li>
              <li className="mb-2">
                <Link to="/employer-detail" className="text-dark text-decoration-none">Employer Detail</Link>
              </li>
              <li className="mb-2">
                <Link to="/blog-list" className="text-dark text-decoration-none">Blog List</Link>
              </li>
              <li className="mb-2">
                <Link to="/blog-grid" className="text-dark text-decoration-none">Blog Grid</Link>
              </li>
            </ul>
          </div> */}

          {/* Helpful Resources Column */}
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Helpful Resources</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-dark underline">About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-dark underline">FAQ</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-dark underline">Contact Us</Link>
              </li>
              {/* <li className="mb-2">
                <Link to="/zendesk" className="text-dark underline">Zendesk</Link>
              </li> */}
              <li className="mb-2">
                <Link to="/jobs" className="text-dark underline">Jobs</Link>
              </li>
              <li className="mb-2">
                <Link to="/unsubscribe-email" className="text-dark underline">Unsubscribe</Link>
              </li>
              {/* <li className="mb-2">
                <Link to="/coming-soon" className="text-dark underline">Coming Soon</Link>
              </li>
              <li className="mb-2">
                <Link to="/maintenance" className="text-dark underline">Under Maintenance</Link>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-top border-light pt-4 mt-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0">Copyright © {new Date().getFullYear()} All rights reserved</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="social-icons">
                <a href="https://www.facebook.com/profile.php?id=61578889364876" target="_blank" rel="noopener noreferrer" className="text-dark me-3 fs-5">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://x.com/clevanoo44085" target="_blank" rel="noopener noreferrer" className="text-dark me-3 fs-5">
                  <i className="fab fa-x"></i>
                </a>
                <a href="https://www.linkedin.com/company/108140372/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="text-dark me-3 fs-5">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://www.instagram.com/clevanoollc/" target="_blank" rel="noopener noreferrer" className="text-dark fs-5">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

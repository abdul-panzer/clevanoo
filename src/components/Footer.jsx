import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-5">
      <div className="container">
        <div className="row g-4">
          {/* LOGO Column */}
          <div className="col-lg-3 col-md-6">
            <div className="mb-4">
              <img className="img-fluid rounded m-auto d-table" alt="About Us" src="logo.png" />
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
                <strong>Email:</strong> <a className="text-white" href="mailto:info@clevanoollc.com">info@clevanoollc.com</a>
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
                <Link to="/employers-list" className="text-white text-decoration-none">Employers List</Link>
              </li>
              <li className="mb-2">
                <Link to="/employers-grid" className="text-white text-decoration-none">Employers Grid</Link>
              </li>
              <li className="mb-2">
                <Link to="/employer-detail" className="text-white text-decoration-none">Employer Detail</Link>
              </li>
              <li className="mb-2">
                <Link to="/blog-list" className="text-white text-decoration-none">Blog List</Link>
              </li>
              <li className="mb-2">
                <Link to="/blog-grid" className="text-white text-decoration-none">Blog Grid</Link>
              </li>
            </ul>
          </div> */}

          {/* Helpful Resources Column */}
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Helpful Resources</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-white text-decoration-none">About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-white text-decoration-none">FAQ</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white text-decoration-none">Contact Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/jobs" className="text-white text-decoration-none">Jobs</Link>
              </li>
              <li className="mb-2">
                <Link to="/unsubscribe-email" className="text-white text-decoration-none">Unsubscribe</Link>
              </li>
              {/* <li className="mb-2">
                <Link to="/coming-soon" className="text-white text-decoration-none">Coming Soon</Link>
              </li>
              <li className="mb-2">
                <Link to="/maintenance" className="text-white text-decoration-none">Under Maintenance</Link>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-top border-light pt-4 mt-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0">Copyright © 2025 All rights reserved</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="social-icons">
                <a href="https://www.facebook.com/profile.php?id=61578889364876" target="_blank" rel="noopener noreferrer" className="text-white me-3 fs-5">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://x.com/clevanoo44085" target="_blank" rel="noopener noreferrer" className="text-white me-3 fs-5">
                  <i className="fab fa-x"></i>
                </a>
                <a href="https://www.linkedin.com/company/108140372/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="text-white me-3 fs-5">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://www.instagram.com/clevanoollc/" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
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

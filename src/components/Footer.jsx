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
              <h3 className="fw-bold mb-3">LOGO</h3>
              <p className="mb-3">Share your resume, We'll quickly match you</p>
              {/* <div className="mb-2">
                <strong>Address:</strong> about
              </div> */}
              <div className="mb-2">
                <strong>Email:</strong> <a href="mailto:info@clevanoollc.com">info@clevanoollc.com</a>
              </div>
              <div className="mb-2">
                <strong>Call:</strong> 555-555-1234
              </div>
            </div>
          </div>

          {/* For Candidate Column */}
          {/* <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">For Candidate</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/candidates-list" className="text-white text-decoration-none">Candidates List</Link>
              </li>
              <li className="mb-2">
                <Link to="/candidates-grid" className="text-white text-decoration-none">Candidates Grid</Link>
              </li>
              <li className="mb-2">
                <Link to="/candidate-detail" className="text-white text-decoration-none">Candidate Detail</Link>
              </li>
              <li className="mb-2">
                <Link to="/blog" className="text-white text-decoration-none">Blog</Link>
              </li>
              <li className="mb-2">
                <Link to="/blog-grid-2" className="text-white text-decoration-none">Blog Grid-2</Link>
              </li>
            </ul>
          </div> */}

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

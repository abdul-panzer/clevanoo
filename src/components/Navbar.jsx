import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleServicesDropdown = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsServicesOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const getActiveClass = (path) => {
    return isActiveLink(path) ? 'active-nav-link' : '';
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top border-bottom`}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/" onClick={closeMenu}>
          <img className="img-fluid rounded m-auto d-table" alt="About Us" src="logo.png" width='125px' />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navMenu">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center ${getActiveClass('/')}`} to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center ${getActiveClass('/about')}`} to="/about" onClick={closeMenu}>
                About
              </Link>
            </li>
            <li className={`nav-item dropdown services-dropdown ${isServicesOpen ? 'show' : ''}`}>
              <button
                className={`nav-link dropdown-toggle d-flex align-items-center ${isActiveLink('/services') || isActiveLink('/zendesk') ? 'active-nav-link' : ''}`}
                type="button"
                id="servicesDropdown"
                onClick={toggleServicesDropdown}
                aria-expanded={isServicesOpen}
              >
                Services
              </button>
              <ul className={`dropdown-menu ${isServicesOpen ? 'show' : ''}`} aria-labelledby="servicesDropdown">
                <li>
                  <Link className={`dropdown-item ${getActiveClass('/services')}`} to="/services" onClick={closeMenu}>
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link className={`dropdown-item ${getActiveClass('/zendesk')}`} to="/zendesk" onClick={closeMenu}>
                    Zendesk
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center ${getActiveClass('/industries')}`} to="/industries" onClick={closeMenu}>
                Industries
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center ${getActiveClass('/speciality')}`} to="/speciality" onClick={closeMenu}>
                Specialities
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center ${getActiveClass('/jobs')}`} to="/jobs" onClick={closeMenu}>
                Jobs
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center ${getActiveClass('/contact')}`} to="/contact" onClick={closeMenu}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

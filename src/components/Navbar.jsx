import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navbarClass, setNavbarClass] = useState("navbar-dark");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);

      // Get current scroll position
      const scrollY = window.scrollY;
      
      // Define sections and their background types
      const sections = [
        { start: 0, end: 1000, type: 'dark' },      // Hero section (dark background)
        { start: 1000, end: 2000, type: 'light' },  // Job Categories (light background)
        { start: 2000, end: 3000, type: 'dark' },   // New Jobs (dark background)
        { start: 3000, end: 4000, type: 'light' },  // Job Gallery (light background)
        { start: 4000, end: 5000, type: 'light' },  // Career Tips (light background)
        { start: 5000, end: 6000, type: 'light' },  // Testimonials (light background)
        { start: 6000, end: 7000, type: 'dark' },   // Subscription (dark background)
      ];

      // Find current section
      let currentType = 'dark'; // Default to dark
      for (const section of sections) {
        if (scrollY >= section.start && scrollY < section.end) {
          currentType = section.type;
          break;
        }
      }

      // Set navbar class based on background type
      if (currentType === 'light') {
        setNavbarClass("navbar-light");
      } else {
        setNavbarClass("navbar-dark");
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top border-bottom`}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          LOGO
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navMenu">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/services">
                Services
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/career">
                Career
              </Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/contact">
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

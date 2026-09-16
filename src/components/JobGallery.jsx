import React from "react";

const JobGallery = () => {
  const galleryImagesTop = [
    "/assets/images/1.webp",
    "/assets/images/2.webp",
    "/assets/images/3.webp",
    "/assets/images/4.webp",
    "/assets/images/5.webp",
  ];

  const galleryImagesBottom = [
    "/assets/images/6.webp",
    "/assets/images/7.webp",
    "/assets/images/8.webp",
    "/assets/images/9.webp",
    "/assets/images/10.webp",
  ];

  const Track = ({ images }) => (
    <div className="marquee-track">
      {[...images, ...images].map((image, index) => (
        <div className="marquee-item" key={index}>
          <img src={image} alt={`Professional ${index + 1}`} className="marquee-image" loading="lazy" decoding="async" />
          <div className="marquee-overlay">
            <div className="overlay-content">
              <h6 className="mb-2 fw-bold">Open Positions</h6>
              <button className="btn btn-sm">View Job</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold text-dark">Our Latest Jobs</h2>
        </div>

        <div className="position-relative">
          {/* Top row - scroll right with top images */}
          <div className="gallery-marquee marquee-right mb-4">
            <div className="marquee-viewport">
              <Track images={galleryImagesTop} />
            </div>
          </div>

          {/* Bottom row - scroll left with bottom images */}
          <div className="gallery-marquee marquee-left mt-4">
            <div className="marquee-viewport">
              <Track images={galleryImagesBottom} />
            </div>
          </div>

          {/* Center Overlay */}
          <div className="position-absolute top-50 start-50 translate-middle text-center d-none d-md-block">
            <div className="bg-white rounded-circle p-4 shadow-lg" style={{ width: '200px', height: '200px' }}>
              <div className="d-flex flex-column justify-content-center align-items-center h-100">
                <h3 className="fw-bold text-primary mb-2">500+</h3>
                <p className="mb-0 text-muted small">Our Latest Jobs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobGallery;

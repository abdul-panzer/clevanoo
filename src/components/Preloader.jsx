import React from 'react';

const Preloader = ({ message = "Loading..." }) => {
  return (
    <div className="preloader-container">
      <div className="preloader-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="preloader-text">{message}</p>
      
      <style jsx>{`
        .preloader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          min-height: 300px;
        }
        
        .preloader-spinner {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 20px;
        }
        
        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-radius: 50%;
          animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }
        
        .spinner-ring:nth-child(1) {
          border-top-color: var(--primary-color, #80E1FC);
          animation-delay: -0.45s;
        }
        
        .spinner-ring:nth-child(2) {
          border-right-color: var(--primary-color, #80E1FC);
          animation-delay: -0.3s;
        }
        
        .spinner-ring:nth-child(3) {
          border-bottom-color: var(--primary-color, #80E1FC);
          animation-delay: -0.15s;
        }
        
        .spinner-ring:nth-child(4) {
          border-left-color: var(--primary-color, #80E1FC);
        }
        
        .preloader-text {
          font-family: 'Jost', sans-serif;
          font-size: 1.1rem;
          font-weight: 500;
          color: #666;
          margin: 0;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        /* Alternative simpler spinner for fallback */
        @media (prefers-reduced-motion: reduce) {
          .spinner-ring {
            animation: none;
            border: 4px solid var(--primary-color, #80E1FC);
            opacity: 0.3;
          }
          
          .spinner-ring:nth-child(1) {
            border-top-color: var(--primary-color, #80E1FC);
            opacity: 1;
          }
          
          .preloader-text {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Preloader;

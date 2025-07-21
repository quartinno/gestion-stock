import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <a href="/" className="logo-container">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#0D2551"/>
              <circle cx="30" cy="10" r="10" fill="#14B8A6"/>
            </svg>
          </div>
          <span className="logo-text">Quantixa</span>
        </a>
        <div className="footer-text">
          <p className="tagline">Smart Subscription. Premium Shopping.</p>
          <p className="description">Join a trusted platform where subscriptions unlock exclusive shopping experiences.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
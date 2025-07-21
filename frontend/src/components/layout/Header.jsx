import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <a href="/" className="logo-container">
        <div className="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#0D2551"/>
            <circle cx="30" cy="10" r="10" fill="#14B8A6"/>
          </svg>
        </div>
        <span className="logo-text">Quantixa</span>
      </a>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        &#9776;
      </button>
      <nav className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/pricing" className="nav-link">Plans & Pricing</Link>
        <a href="#" className="nav-link">Shop</a>
        <a href="#" className="nav-link">Contact</a>
        <div className="header-actions-mobile">
          <Link to="/pricing"><button className="subscribe-button">Subscribe</button></Link>
          <button className="signin-button">Sign In</button>
        </div>
      </nav>
      <div className="header-actions-desktop">
        <Link to="/pricing"><button className="subscribe-button">Subscribe</button></Link>
        <button className="signin-button">Sign In</button>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import './Hero.css';
import heroImage from '../../assets/images/g2113.png';
import carrotIcon from '../../assets/images/Carrot Icon.svg';
import meatIcon from '../../assets/images/meat.svg';
import milkIcon from '../../assets/images/Milk Icon.svg';
import cannedFoodIcon from '../../assets/images/Vector.svg';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Subscribe First.<br />Shop Smarter.</h1>
        <p>Choose a plan, pay securely, and unlock access to premium products — simple, fast, and hassle-free.</p>
        <div className="hero-actions">
          <button className="shop-now-btn">Shop Now</button>
          <a href="#" className="learn-more-link">Learn More</a>
        </div>
        <div className="hero-categories">
          <div className="category-item">
            <img src={carrotIcon} alt="" className="category-icon" />
            <span>Fresh Vegetables</span>
          </div>
          <div className="category-item">
            <img src={meatIcon} alt="" className="category-icon" />
            <span>Raw Meats</span>
          </div>
          <div className="category-item">
            <img src={milkIcon} alt="" className="category-icon" />
            <span>Milk & Dairies</span>
          </div>
          <div className="category-item">
            <img src={cannedFoodIcon} alt="" className="category-icon" />
            <span>Canned & Frozen Food</span>
          </div>
        </div>
      </div>
      <div className="hero-image-container">
        <img src={heroImage} alt="Person shopping online" className="hero-image" />
      </div>
    </section>
  );
};

export default Hero;

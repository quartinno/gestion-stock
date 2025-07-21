import React from 'react';
import './WhyTrustUs.css';

// Import icons
import subscriptionIcon from '../../assets/images/Coins.svg';
import paymentsIcon from '../../assets/images/Coins 2.svg';
import plansIcon from '../../assets/images/Send.svg';

// Import images
import marketplaceImage from '../../assets/images/Women Shop.svg';
import secureImage from '../../assets/images/Credit Card.svg';
import flexibleImage from '../../assets/images/Shop 2.svg';

const WhyTrustUs = () => {
  const features = [
    {
      icon: subscriptionIcon,
      title: 'Subscription-Only Marketplace',
      description: 'Exclusive access for serious buyers',
      image: marketplaceImage,
    },
    {
      icon: paymentsIcon,
      title: 'Trusted & Secure Payments',
      description: 'Fully encrypted and fraud-protected',
      image: secureImage,
    },
    {
      icon: plansIcon,
      title: 'Flexible Plans',
      description: 'Choose the package that fits your needs',
      image: flexibleImage,
    },
  ];

  return (
    <section className="why-trust-us-section">
      <h1 className="section-title">Why Our Clients Trust Quantixa</h1>
      <div className="features-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="card-header">
              <img src={feature.icon} alt="" className="feature-icon" />
              <div className="card-title-group">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
            <img src={feature.image} alt={feature.title} className="feature-image" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyTrustUs;

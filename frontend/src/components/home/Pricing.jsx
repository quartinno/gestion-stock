import React from 'react';
import { Link } from 'react-router-dom';
import { plans } from '../../data/plans';
import './Pricing.css';

const pricingPlans = [plans.starter, plans.pro];

const Pricing = () => {
  const exchangeRate = 9.05;

  return (
    <section className="pricing-section">
      <div className="pricing-header">
        <h1>Pricing Plans</h1>
        <p>Simple, Transparent Pricing</p>
        <div className="pricing-toggle">
          <button className="toggle-btn active">Monthly</button>
        </div>
      </div>
      <div className="pricing-cards-container">
        {pricingPlans.map((plan) => {
          const isPro = plan.id === 'pro';
          let featuresStartIndex = -1;

          return (
            <div key={plan.id} className={`pricing-card ${isPro ? 'pro-plan' : ''}`}>
              <h3>{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>
              <div className="price-container">
                <span className="price">{`${(plan.price * exchangeRate).toFixed(2)} د.م.`}/month</span>
                <span className="billing-cycle">{`User will be billed ${isPro ? 'annually' : 'Monthly'}`}</span>
              </div>
              <Link to={`/select-plan/${plan.id}`} className={`btn ${isPro ? 'btn-subscribe' : 'btn-join'}`}>
                {isPro ? 'Subscribe Now' : 'Join for Free'}
              </Link>
              <div className="features-list">
                <h4>What you get</h4>
                <ul>
                  {plan.features.map((feature, index) => {
                    if (feature === 'Features') {
                      featuresStartIndex = index + 1;
                      return <li key={index}><span className="feature-dot"></span>{feature}:</li>;
                    }
                    if (featuresStartIndex !== -1 && index >= featuresStartIndex) {
                      return null; // These will be rendered in the sub-list
                    }
                    return <li key={index}><span className="feature-dot"></span>{feature}</li>;
                  })}
                  {featuresStartIndex !== -1 && (
                    <ul className="sub-features">
                      {plan.features.slice(featuresStartIndex).map((subFeature, subIndex) => (
                        <li key={subIndex}>{subFeature}</li>
                      ))}
                    </ul>
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Pricing;
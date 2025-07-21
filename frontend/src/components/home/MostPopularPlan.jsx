import React from 'react';
import { Link } from 'react-router-dom';
import { plans } from '../../data/plans';
import './MostPopularPlan.css';

const MostPopularPlan = () => {
  const plan = plans.plus;
  const exchangeRate = 9.05;
  let featuresStartIndex = -1;

  return (
    <section className="most-popular-plan-section">
      <div className="most-popular-plan-header">
        <h1>Most Popular Plan</h1>
      </div>
      <div className="most-popular-plan-card-container">
        <div className="pricing-card popular-plan">
          <div className="most-popular-badge">Most Popular</div>
          <h3>{plan.name}</h3>
          <p className="plan-description">{plan.description}</p>
          <div className="price-container">
            <span className="price">{`${(plan.price * exchangeRate).toFixed(2)} د.م.`}/month</span>
            <span className="billing-cycle">User will be billed Monthly</span>
          </div>
          <Link to={`/select-plan/${plan.id}`} className="btn btn-subscribe">
            Subscribe Now
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
                  return null; // Rendered in sub-list
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
      </div>
    </section>
  );
};

export default MostPopularPlan;
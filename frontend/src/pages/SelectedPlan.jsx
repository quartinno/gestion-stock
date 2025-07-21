import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import BlueBlob from '../assets/images/Blob Ornament blue.svg';
import GreenBlob from '../assets/images/Blob Ornament green.svg';
import CallToAction from '../components/home/CallToAction';
import SubscriptionManagement from '../components/subscription/SubscriptionManagement';
import Footer from '../components/common/Footer';
import { plans } from '../data/plans';
import './SelectedPlan.css';

const SelectedPlan = () => {
  const { planId } = useParams();
  const plan = plans[planId];

  if (!plan) {
    return <div>Plan not found</div>;
  }

  return (
    <div className="relative w-full min-h-screen m-0 p-0 overflow-hidden">
      <Header />
      {/* Background Blobs */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: 'auto', zIndex: 0, transform: 'translateX(-20%)', overflow: 'hidden' }}>
        <img src={BlueBlob} alt="Blue Blob" style={{ display: 'block', width: '100%', height: 'auto' }} />
      </div>
      <div style={{ position: 'fixed', top: 0, right: 0, width: '100vw', height: 'auto', zIndex: 0, transform: 'translateX(20%)', overflow: 'hidden' }}>
        <img src={GreenBlob} alt="Green Blob" style={{ display: 'block', width: '100%', height: 'auto', marginLeft: 'auto' }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 pt-24">
        <CallToAction />
        <div className="selected-plan-section">
          <h1 className="selected-plan-title">Your Selected Plan</h1>
          <div className="selected-plan-card">
            <h3>{plan.name}</h3>
            <p className="plan-description">{plan.description}</p>
            <div className="price-container">
              <span className="price">{`${(plan.price * 9.05).toFixed(2)} د.م./month`}</span>
              <span className="billing-cycle">User will be billed Monthly</span>
            </div>
            <div className="features-list">
              <h4>What you get</h4>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}><span className="feature-dot"></span>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
          <SubscriptionManagement planId={planId} />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SelectedPlan;

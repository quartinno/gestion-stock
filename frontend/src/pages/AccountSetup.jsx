import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/common/Footer';
import { plans } from '../data/plans';
import BlueBlob from '../assets/images/Blob Ornament blue.svg';
import GreenBlob from '../assets/images/Blob Ornament green.svg';
import './AccountSetup.css';

const AccountSetup = () => {
  const { planId } = useParams();
  const plan = plans[planId];
  const [selectedRole, setSelectedRole] = useState('Business Admin');

  if (!plan) {
    return <div>Plan not found</div>;
  }

  return (
    <div className="account-setup-page">
      <Header />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: 'auto', zIndex: 0, transform: 'translateX(-20%)', overflow: 'hidden' }}>
        <img src={BlueBlob} alt="Blue Blob" style={{ display: 'block', width: '100%', height: 'auto' }} />
      </div>
      <div style={{ position: 'fixed', top: 0, right: 0, width: '100vw', height: 'auto', zIndex: 0, transform: 'translateX(20%)', overflow: 'hidden' }}>
        <img src={GreenBlob} alt="Green Blob" style={{ display: 'block', width: '100%', height: 'auto', marginLeft: 'auto' }} />
      </div>

      <main className="account-setup-main-content">
        <div className="account-setup-header">
          <h1>Setup Your Account Before Checkout</h1>
          <p>Just a few details to personalize your access and dashboard.</p>
        </div>

        <div className="account-setup-body">
          <div className="account-form-container">
            <h2>Complete Your Account Setup</h2>
            <p>Please fill out the form below. Enter your information details.</p>
            <form>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="Enter Your Email" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Create Password</label>
                <input type="password" id="password" placeholder="Create Your Password" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" placeholder="+212-XXX-XXX-XXX" />
              </div>
              <div className="form-group">
                <label htmlFor="username">Enter Your Username</label>
                <input type="text" id="username" placeholder="Username" />
              </div>
              <div className="form-group">
                <label>Choose Your Role</label>
                <div className="role-options">
                  {['Business Admin', 'Cashier', 'Inventory Manager'].map(role => (
                    <div key={role} className="role-option" onClick={() => setSelectedRole(role)}>
                      <div className={`custom-radio ${selectedRole === role ? 'selected' : ''}`}>
                        {selectedRole === role && <span className="checkmark">&#10003;</span>}
                      </div>
                      <span>{role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <div className="plan-summary-container">
            <h3>Plan Selected</h3>
            <div className="selected-plan-card">
              <h4>{plan.name}</h4>
              <p className="plan-description">{plan.description}</p>
              <div className="price-container">
                <span className="price">{`${(plan.price * 9.05).toFixed(2)} د.م./month`}</span>
                <span className="billing-cycle">User will be billed Monthly</span>
              </div>
              <div className="features-list">
                <h5>What you get</h5>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}><span className="feature-dot"></span>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="account-setup-actions">
          <Link to={`/select-plan/${planId}`} className="btn btn-previous">Previous</Link>
          <Link to={`/checkout/${planId}`} className="btn btn-proceed">Proceed to Checkout</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountSetup;

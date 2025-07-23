import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/common/Footer';
import { plans } from '../data/plans';
import BlueBlob from '../assets/images/Blob Ornament blue.svg';
import GreenBlob from '../assets/images/Blob Ornament green.svg';
import './AccountSetup.css';

const AccountSetup = () => {
    const { planId } = useParams();
  const navigate = useNavigate();
  const plan = plans[planId];
    const [selectedRole, setSelectedRole] = useState('Business Admin');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    username: '',
  });

    const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form Data Submitted:', { ...formData, role: selectedRole });
    // For now, we'll just navigate to the checkout page
    navigate(`/checkout/${planId}`);
  };

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

        <form onSubmit={handleSubmit}>
          <div className="account-setup-body">
            <div className="account-form-container">
              <h2>Complete Your Account Setup</h2>
              <p>Please fill out the form below. Enter your information details.</p>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="Enter Your Email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Create Password</label>
                <input type="password" id="password" placeholder="Create Your Password" value={formData.password} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" placeholder="+212-XXX-XXX-XXX" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="username">Enter Your Username</label>
                <input type="text" id="username" placeholder="Username" value={formData.username} onChange={handleChange} />
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
            <button type="submit" className="btn btn-proceed">Proceed to Checkout</button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default AccountSetup;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SubscriptionManagement.css';

const SubscriptionManagement = ({ planId }) => {
  const [autoRenew, setAutoRenew] = useState(true);

  const handleToggle = () => {
    setAutoRenew(!autoRenew);
  };

  return (
    <div className="subscription-management">
      <div className="auto-renew-container">
        <div className="auto-renew-toggle">
          <span className="auto-renew-label">Auto-renew subscription</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={autoRenew} 
              onChange={handleToggle}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <p className="auto-renew-description">
          Your subscription will automatically renew on the same day each month. 
          You can turn off auto-renewal at any time before your next billing date.
        </p>
      </div>
      
      <h2 className="checkout-heading">Go To Checkout Process</h2>
      
      <div className="subscription-actions">
        <Link to="/pricing" className="btn btn-outline">
          Previous
        </Link>
        <Link to={`/account-setup/${planId}`} className="btn btn-primary">
          Next: Payment
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionManagement;

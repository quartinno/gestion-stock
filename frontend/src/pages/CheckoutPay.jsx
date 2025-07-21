import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import creditCardIcon from '../assets/images/Credit Card.svg';
import paypalIcon from '../assets/images/PYPL.png';
import Header from '../components/layout/Header';
import Footer from '../components/common/Footer';
import { plans } from '../data/plans';
import BlueBlob from '../assets/images/Blob Ornament blue.svg';
import GreenBlob from '../assets/images/Blob Ornament green.svg';
import './CheckoutPay.css';

const CheckoutPay = () => {
  const { planId } = useParams();
  const plan = plans[planId];
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'paypal'
  const [agreed, setAgreed] = useState(false);

  if (!plan) {
    return <div>Plan not found</div>;
  }

  return (
    <div className="checkout-page">
      <Header />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: 'auto', zIndex: 0, transform: 'translateX(-20%)', overflow: 'hidden' }}>
        <img src={BlueBlob} alt="Blue Blob" style={{ display: 'block', width: '100%', height: 'auto' }} />
      </div>
      <div style={{ position: 'fixed', top: 0, right: 0, width: '100vw', height: 'auto', zIndex: 0, transform: 'translateX(20%)', overflow: 'hidden' }}>
        <img src={GreenBlob} alt="Green Blob" style={{ display: 'block', width: '100%', height: 'auto', marginLeft: 'auto' }} />
      </div>

      <main className="checkout-main-content">
        <div className="checkout-header">
          <h1>Enter Your Payment Details</h1>
        </div>
        <div className="secure-payment-info">
          <p>Your payment is 100% secure and encrypted.</p>
          <img src={creditCardIcon} alt="Secure Payment" />
        </div>
        <div className="payment-method-selector">
          <button 
            className={`btn-payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
            Credit/Debit Card
          </button>
          <button 
            className={`btn-payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('paypal')}
          >
            <img src={paypalIcon} alt="PayPal" className="paypal-icon-btn" />
            PayPal
          </button>
        </div>


        <div className="checkout-body">
          <div className="payment-details-container">
            {paymentMethod === 'card' ? (
              <form>
                <h2>Payment Detail</h2>
                <p>Please fill out the form below. Enter your card account details.</p>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input type="text" id="cardNumber" placeholder="1243 - 2133 - 9832 - 3200" />
                </div>
                <div className="form-row">
                  <div className="form-group expire-date-group">
                    <label htmlFor="expMonth">Expire Date</label>
                    <div className="expire-date-inputs">
                      <select id="expMonth" defaultValue="">
                        <option value="" disabled>Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                        ))}
                      </select>
                      <select id="expYear" defaultValue="">
                        <option value="" disabled>Year</option>
                        {Array.from({ length: 11 }, (_, i) => (
                          <option key={i} value={new Date().getFullYear() + i}>{new Date().getFullYear() + i}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group cvc-group">
                    <label htmlFor="cvc">CVC/CVV</label>
                    <input type="text" id="cvc" placeholder="453" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input type="text" id="fullName" placeholder="Enter the name exactly as it appears on your payment card." />
                </div>
                <div className="form-group terms-agreement">
                  <div className={`custom-checkbox ${agreed ? 'selected' : ''}`} onClick={() => setAgreed(!agreed)}>
                    {agreed && <span className="checkmark">&#10003;</span>}
                  </div>
                  <label htmlFor="terms">I agree to the Terms and Privacy Policy</label>
                </div>
                <button type="submit" className="btn btn-confirm">Confirm</button>
              </form>
            ) : (
              <div className="paypal-info">
                <h2>Pay with PayPal</h2>
                <p>You will be redirected to PayPal to complete your purchase securely.</p>
                <button className="btn-paypal-main">
                  <img src={paypalIcon} alt="PayPal" className="paypal-icon-btn" />
                  Pay With PayPal
                </button>
              </div>
            )}
          </div>

          <div className="subscription-summary-container">
            <h3>Subscription Summary</h3>
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

        <div className="checkout-actions">
          <Link to={`/account-setup/${planId}`} className="btn btn-previous">Previous</Link>
          <Link to="#" className="btn btn-next">
            Next
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16L16 12L12 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPay;

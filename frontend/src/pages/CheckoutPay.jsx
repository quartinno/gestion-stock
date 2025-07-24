import React, { useState, useRef } from 'react';
import Header from '../components/layout/Header';
import BlueBlob from '../assets/images/Blob Ornament blue.svg';
import GreenBlob from '../assets/images/Blob Ornament green.svg'; 
import { FaCreditCard, FaPaypal, FaArrowLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/payment/StripePaymentForm';
import './CheckoutPage.css';

// IMPORTANT: Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY');

const plan = {
  id: 'plan_123',
  name: 'Plus Plan',
  description: 'Built for power users and professional resellers',
  price: 19.99,
  features: [
    'Max Users: 5',
    'Max Products: 200',
    'Full Dashboard & Order Tracking',
    'Smart Recommendations',
    'Priority Processing',
    'Live Chat Support',
  ],
};

const CheckoutPay = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [triggerStripeSubmit, setTriggerStripeSubmit] = useState(0);
  const [isCardComplete, setIsCardComplete] = useState(false);

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful!', paymentIntent);
    alert('Payment successful!');
    // Here you would typically redirect to a success page or update the UI
  };

  const handlePaymentError = (errorMsg) => {
    console.error('Payment failed:', errorMsg);
    setError(errorMsg);
  };

  const handleConfirmPayment = () => {
    if (agreedToTerms) {
      setError(null);
      setTriggerStripeSubmit(c => c + 1); // Trigger submission in child component
    }
  };

  return (
    <div className="relative w-full min-h-screen m-0 p-0 overflow-hidden bg-gray-100">
      <Header />
      {/* Blue Blob - Top Left */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: 'auto',
        margin: 0,
        padding: 0,
        zIndex: 0,
        transform: 'translateX(-20%)',
        overflow: 'hidden'
      }}>
        <img 
          src={BlueBlob} 
          alt="Blue Blob" 
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            margin: 0,
            padding: 0,
            lineHeight: 0,
            verticalAlign: 'top'
          }}
        />
      </div>
      
      {/* Green Blob - Top Right */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100vw',
        height: 'auto',
        margin: 0,
        padding: 0,
        zIndex: 0,
        transform: 'translateX(20%)',
        overflow: 'hidden'
      }}>
        <img 
          src={GreenBlob} 
          alt="Green Blob" 
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            margin: 0,
            padding: 0,
            marginLeft: 'auto',
            lineHeight: 0,
            verticalAlign: 'top'
          }}
        />
      </div>

      <div className="relative z-10 checkout-container">
        <div className="checkout-header">
          <h1>Enter Your Payment Details</h1>
          <p>Your payment is 100% secure and encrypted.</p>
        </div>

        <div className="payment-toggle">
          <button 
            className={`toggle-btn ${paymentMethod === 'card' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
            <FaCreditCard /> Credit/Debit Card
          </button>
          <button 
            className={`toggle-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('paypal')}
          >
            <FaPaypal /> PayPal
          </button>
        </div>

        <div className="checkout-body">
          <div className="payment-details">
            <h2>Payment Detail</h2>
            <p>Please fill out the form below. Enter your card account details.</p>
            
            {paymentMethod === 'card' && (
              <Elements stripe={stripePromise}>
                <StripePaymentForm
                  amount={plan.price * 100} // Stripe expects amount in cents
                  planId={plan.id}
                  setLoading={setLoading}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  triggerSubmit={triggerStripeSubmit}
                  onCardCompleteChange={setIsCardComplete}
                />
              </Elements>
            )}
            
            <div className="terms-agreement">
              <input type="checkbox" id="terms" checked={agreedToTerms} onChange={() => setAgreedToTerms(!agreedToTerms)} />
              <label htmlFor="terms">I agree to the Terms and Privacy Policy</label>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

            {paymentMethod === 'card' ? (
              <button className="confirm-btn" disabled={!agreedToTerms || !isCardComplete || loading} onClick={handleConfirmPayment}>
                {loading ? 'Processing...' : 'Confirm'}
              </button>
            ) : (
              <button className="toggle-btn active" style={{width: '100%', justifyContent: 'center'}}><FaPaypal /> Pay With PayPal</button>
            )}
          </div>

          <div className="subscription-summary">
            <h2>Subscription Summary</h2>
            <div className="plan-details">
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <div className="price">${plan.price}/month</div>
              <div className="billing-cycle">User will be billed Monthly</div>
            </div>
            <div className="features">
              <h4>What you get</h4>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}><FaCheckCircle color="#007AFF" /> {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="checkout-nav">
          <button className="nav-btn previous"><FaArrowLeft /> Previous</button>
          <button className="nav-btn next">Next <FaArrowRight /></button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPay;

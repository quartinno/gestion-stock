import React, { useState } from 'react';
import Header from '../components/layout/Header';
import BlueBlob from '../assets/images/Blob Ornament blue.svg';
import GreenBlob from '../assets/images/Blob Ornament green.svg';
import { FaCreditCard, FaPaypal, FaArrowLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import StripePaymentForm from '../components/payment/StripePaymentForm';
import { useAuth } from '../contexts/AuthContext';
import './CheckoutPage.css';

// IMPORTANT: Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_51RDunHPcLZDTNYIC8zPfVt4AZuoEbt16Jwk4WS07KNl8bwrWP9vjDpNMB7PFfJUtJ0dnF3cVocpJ3xSSZENSU8n800AuzNoTfy');
const PAYPAL_CLIENT_ID = 'AenM_J_XuNr8-5D_Uy9oWt1GoYtebKdFAwSJgvz5T6zdmY3drAs6sKoJMCXBIClOBSvv8OUWANXu2W7T'; // IMPORTANT: Replace with your actual PayPal Client ID

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
  const { axios } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [triggerStripeSubmit, setTriggerStripeSubmit] = useState(0);
  const [isCardComplete, setIsCardComplete] = useState(false);

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful!', paymentIntent);
    alert('Payment successful!');
  };

  const handlePaymentError = (errorMsg) => {
    console.error('Payment failed:', errorMsg);
    setError(errorMsg);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions.');
      return;
    }
    if (paymentMethod === 'card') {
      setError(null);
      setLoading(true);
      setTriggerStripeSubmit((c) => c + 1);
    }
  };

  const createPayPalOrder = async () => {
    try {
      const res = await axios.post('/payment/paypal/create-order', { plan_id: plan.id });
      return res.data.id;
    } catch (err) {
      console.error('Error creating PayPal order:', err);
      setError('Could not initiate PayPal payment. Please try again.');
      return null;
    }
  };

  const onPayPalApprove = async (data) => {
    try {
      const res = await axios.post('/payment/paypal/capture-order', {
        orderID: data.orderID,
        payerID: data.payerID,
        plan_id: plan.id,
      });
      if (res.data.success) {
        alert('Payment successful and subscription activated!');
      } else {
        setError(res.data.error || 'Payment capture failed.');
      }
    } catch (err) {
      console.error('Error capturing PayPal order:', err);
      setError('An error occurred while processing your payment.');
    }
  };

  return (
    <PayPalScriptProvider options={{ 'client-id': PAYPAL_CLIENT_ID }}>
      <div className="relative w-full min-h-screen m-0 p-0 overflow-hidden bg-gray-100">
        <Header />
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 0, overflow: 'hidden' }}>
          <img src={BlueBlob} alt="Blue Blob" style={{ display: 'block', width: '100%', height: 'auto' }} />
        </div>
        <div style={{ position: 'fixed', top: 0, right: 0, width: '100vw', zIndex: 0, overflow: 'hidden' }}>
          <img src={GreenBlob} alt="Green Blob" style={{ display: 'block', width: '100%', height: 'auto', marginLeft: 'auto' }} />
        </div>

        <div className="relative z-10 checkout-container">
          <div className="checkout-header">
            <h1>Enter Your Payment Details</h1>
            <p>Your payment is 100% secure and encrypted.</p>
          </div>

          <div className="payment-toggle">
            <button className={`toggle-btn ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
              <FaCreditCard /> Credit/Debit Card
            </button>
            <button className={`toggle-btn ${paymentMethod === 'paypal' ? 'active' : ''}`} onClick={() => setPaymentMethod('paypal')}>
              <FaPaypal /> PayPal
            </button>
          </div>

          <form className="checkout-body" onSubmit={handleSubmit}>
            <div className="payment-details">
              <h2>Payment Detail</h2>
              <p>Please fill out the form below. Enter your card account details.</p>

              {paymentMethod === 'card' && (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    amount={plan.price * 100}
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
                <button type="submit" className="confirm-btn" disabled={!agreedToTerms || !isCardComplete || loading}>
                  {loading ? 'Processing...' : 'Confirm'}
                </button>
              ) : (
                <div style={{ minHeight: '150px' }}>
                  <PayPalButtons
                    key={paymentMethod}
                    style={{ layout: 'vertical' }}
                    createOrder={createPayPalOrder}
                    onApprove={onPayPalApprove}
                    onError={(err) => {
                      console.error('PayPal Checkout onError', err);
                      setError('An error occurred with the PayPal payment.');
                    }}
                  />
                </div>
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
          </form>

          <div className="checkout-nav">
            <button className="nav-btn previous"><FaArrowLeft /> Previous</button>
            <button className="nav-btn next">Next <FaArrowRight /></button>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default CheckoutPay;

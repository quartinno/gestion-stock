import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaPaypal, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { PayPalButtons } from '@paypal/react-paypal-js';
import StripePaymentForm from '../components/payment/StripePaymentForm';
import axios from 'axios';
import Header from '../components/layout/Header';
import Footer from '../components/common/Footer';
import { plans } from '../data/plans';
import BlueBlob from '../assets/images/Blob Ornament blue.svg';
import GreenBlob from '../assets/images/Blob Ornament green.svg';
import './CheckoutPay.css';



const CheckoutPay = () => {
  const { planId } = useParams();
  const plan = plans[planId];
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!plan) {
    return <div className="error-message">Plan not found</div>;
  }

  const handlePaymentSuccess = (paymentData) => {
    setPaymentStatus('success');
    setLoading(false);
    // Redirect to success page or show success message
    setTimeout(() => {
      navigate(`/payment/success?payment_id=${paymentData.payment_intent_id || paymentData.paymentId}`);
    }, 2000);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setError(error.message || 'An error occurred during payment processing');
    setPaymentStatus('error');
    setLoading(false);
  };

    const createPaypalOrder = (data, actions) => {
    setLoading(true);
    setError(null);
    return axios.post(`/api/payment/paypal`, { plan_id: planId })
      .then(response => {
        setLoading(false);
        return response.data.id;
      })
      .catch(error => {
        console.error('Error creating PayPal payment', error);
        setError('Could not initiate PayPal payment. Please try again.');
        setLoading(false);
        throw error;
      });
  };

  const onPaypalApprove = (data, actions) => {
    setLoading(true);
    return axios.post(`/api/payment/paypal/success`, {
      paymentId: data.orderID,
      PayerID: data.payerID,
      plan_id: planId,
    })
    .then(response => {
        setLoading(false);
        handlePaymentSuccess({ paymentId: data.orderID });
    })
    .catch(err => {
        setLoading(false);
        handlePaymentError(err);
    });
  };

  const handleStripePaymentSuccess = (paymentIntent) => {
    axios.post(`/api/payment/stripe/success`, {
      payment_intent_id: paymentIntent.id,
    })
    .then(response => {
      handlePaymentSuccess({ payment_intent_id: paymentIntent.id });
    })
    .catch(error => {
      handlePaymentError(error);
    });
  };

  if (paymentStatus === 'success') {
    return (
      <div className="checkout-page">
        <Header />
        <div className="success-container">
          <FaCheckCircle className="success-icon" />
          <h2>Payment Successful!</h2>
          <p>Thank you for your purchase. Your subscription is now active.</p>
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="checkout-page">
        <Header />
        <div className="error-container">
          <FaTimesCircle className="error-icon" />
          <h2>Payment Failed</h2>
          <p>{error || 'An error occurred during payment processing.'}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setPaymentStatus(null);
              setError(null);
            }}
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
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
        <div className="payment-method-selector">
          <div className="payment-method">
            <input
              type="radio"
              id="stripe"
              name="paymentMethod"
              value="stripe"
              checked={paymentMethod === 'stripe'}
              onChange={() => setPaymentMethod('stripe')}
              disabled={loading}
            />
            <label htmlFor="stripe">
              <FaCreditCard /> Credit/Debit Card (Stripe)
            </label>
          </div>
          <button 
            className={`btn-payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('paypal')}
          >
            <FaPaypal /> PayPal
          </button>
        </div>

        <div className="checkout-body">
          <div className="payment-details-container">
            {paymentMethod === 'stripe' ? (
              <div>
                <h2>Payment Detail</h2>
                <p>Please fill out the form below. Enter your card account details.</p>
                {loading && (
                  <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>Processing your payment...</p>
                  </div>
                )}
                                <StripePaymentForm 
                  amount={plan.price * 100} // Convert to cents for Stripe
                  planId={planId}
                  onSuccess={handleStripePaymentSuccess}
                  onError={handlePaymentError}
                  setLoading={setLoading}
                />
              </div>
            ) : (
              <div>
                <h2>Pay with PayPal</h2>
                <p>Click the button below to proceed with PayPal.</p>
                <PayPalButtons 
                  style={{ layout: 'vertical' }}
                  createOrder={createPaypalOrder}
                  onApprove={onPaypalApprove}
                  onError={(err) => {
                    console.error('PayPal Button Error:', err);
                    alert('An error occurred with the PayPal button. Please try again.');
                  }}
                />
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
          {/* The Next button might need to be handled differently now, e.g., disabled until payment is complete */}
          <Link to="#" className="btn btn-next">Next</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPay;

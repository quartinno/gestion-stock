import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const StripePaymentForm = ({ amount, planId, onSuccess, onError, setLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  


  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setError(event.error ? event.error.message : '');
    setDisabled(event.empty);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      setError('Stripe.js has not loaded yet. Please try again.');
      setLoading(false);
      return;
    }

    try {
      // 1. Create a Payment Intent on the server
            const { data } = await axios.post(`/api/payment/stripe/create-payment-intent`, {
        amount: amount, // Amount is already in cents
        plan_id: planId,
      });

      // 2. Confirm the card payment
      const cardElement = elements.getElement(CardElement);
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        // Show error to your customer
        setError(stripeError.message);
        setLoading(false);
        if (onError) onError(stripeError);
      } else if (paymentIntent.status === 'succeeded') {
        // Payment succeeded, call the success handler from parent
        if (onSuccess) onSuccess(paymentIntent);
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      const errorMessage = err.response?.data?.error || 'An error occurred while processing the payment. Please try again.';
      setError(errorMessage);
      setLoading(false);
      if (onError) onError(new Error(errorMessage));
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
        backgroundColor: '#fff',
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="card-element-container">
        <CardElement 
          options={cardElementOptions} 
          onChange={handleChange}
          className="stripe-card-element"
        />
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary btn-block"
        disabled={!stripe || disabled}
      >
        Pay ${(amount / 100).toFixed(2)}
      </button>
      
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
      
      <style jsx>{`
        .stripe-payment-form {
          max-width: 500px;
          margin: 0 auto;
        }
        .card-element-container {
          border: 1px solid #ced4da;
          border-radius: 4px;
          padding: 12px;
          margin-bottom: 20px;
          background: white;
        }
        .stripe-card-element {
          width: 100%;
        }
        .btn-block {
          display: block;
          width: 100%;
          padding: 12px;
          font-size: 16px;
          font-weight: 600;
        }
      `}</style>
    </form>
  );
};

export default StripePaymentForm;

import React, { useState, useEffect, useCallback } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axiosInstance from '../../api/axios';

const StripePaymentForm = ({ amount, planId, onSuccess, onError, setLoading, triggerSubmit, onCardCompleteChange }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const handleChange = useCallback((event) => {
    setError(event.error ? event.error.message : null);
    if (onCardCompleteChange) {
      onCardCompleteChange(event.complete);
    }
  }, [onCardCompleteChange]);

  const handleSubmit = useCallback(async () => {
    if (!stripe || !elements) {
      onError('Stripe.js has not loaded yet.');
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { data: intentData } = await axiosInstance.post('/payment/stripe/create-payment-intent', {
        amount: amount,
        plan_id: planId,
      });

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        throw stripeError;
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      } else {
        throw new Error(`Payment failed with status: ${paymentIntent.status}`);
      }
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [stripe, elements, amount, planId, setLoading, onSuccess, onError]);

  useEffect(() => {
    if (triggerSubmit > 0) { // Ensures it doesn't run on initial render
      handleSubmit();
    }
  }, [triggerSubmit, handleSubmit]);

  const cardElementOptions = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'inherit',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div>
      <div className="form-group">
        <label>Card Details</label>
        <div className="form-input">
            <CardElement options={cardElementOptions} onChange={handleChange} />
        </div>
      </div>
      {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
    </div>
  );
};

export default StripePaymentForm;

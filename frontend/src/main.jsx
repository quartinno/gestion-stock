import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import App from './App.jsx';
import './index.css';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

// PayPal options
const paypalOptions = {
  'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: 'USD',
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PayPalScriptProvider options={paypalOptions}>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </PayPalScriptProvider>
    </BrowserRouter>
  </React.StrictMode>
);
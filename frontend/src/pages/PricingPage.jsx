import React from 'react';
import Header from '../components/layout/Header';
import BlueBlob from '../assets/images/Blob Ornament blue.svg';
import GreenBlob from '../assets/images/Blob Ornament green.svg';
import WaveSeparator from '../components/common/WaveSeparator';
import Pricing from '../components/home/Pricing';
import MostPopularPlan from '../components/home/MostPopularPlan';
import CallToAction from '../components/home/CallToAction';
import Footer from '../components/common/Footer';
import './HomePage.css'; // Reusing homepage styles for consistency

const PricingPage = () => {
  return (
    <div className="relative w-full min-h-screen m-0 p-0 overflow-hidden">
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
      
      {/* Content Container */}
      <div className="relative z-10 pt-24"> {/* Add padding to avoid header overlap */}
        <WaveSeparator />
        <Pricing />
        <MostPopularPlan />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
};

export default PricingPage;

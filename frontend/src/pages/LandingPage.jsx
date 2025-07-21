import React from 'react';
import BlueBlob from '../assets/images/Blob Ornament blue.svg';
import GreenBlob from '../assets/images/Blob Ornament green.svg';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Blue Blob - Top Right */}
      <img 
        src={BlueBlob} 
        alt="Blue Blob" 
        className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] opacity-70"
      />
      
      {/* Green Blob - Top Left */}
      <img 
        src={GreenBlob} 
        alt="Green Blob" 
        className="absolute top-0 left-0 -ml-32 -mt-32 w-[500px] h-[500px] opacity-70"
      />
      
      {/* Content will go here */}
      <div className="relative z-10">
        {/* Your header and other content will go here */}
      </div>
    </div>
  );
};

export default LandingPage;
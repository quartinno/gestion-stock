import React from 'react';
import './WaveSeparator.css';
import waveSvg from '../../assets/images/Vector 28.svg';

const WaveSeparator = () => {
  return (
    <div className="wave-separator-container">
      <img src={waveSvg} alt="Wave separator" className="wave-svg" />
    </div>
  );
};

export default WaveSeparator;

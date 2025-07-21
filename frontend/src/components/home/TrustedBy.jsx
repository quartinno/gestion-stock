import React from 'react';
import './TrustedBy.css';

import glovoLogo from '../../assets/images/glovo-seeklogo.svg';
import jumiaLogo from '../../assets/images/jumia-seeklogo.svg';
import ocpLogo from '../../assets/images/pngfind.com-blank-flag-png-6911535.png'; // Assuming this is the OCP logo
import tangerMedLogo from '../../assets/images/Logo-TMSA-Bleu.png.crdownload.png'; // Assuming this is the Tanger Med logo

const TrustedBy = () => {
  const logos = [
    { src: glovoLogo, alt: 'Glovo' },
    { src: jumiaLogo, alt: 'Jumia' },
    { src: ocpLogo, alt: 'OCP' },
    { src: tangerMedLogo, alt: 'Tanger Med' },
  ];

  return (
    <section className="trusted-by-section">
      <h2 className="trusted-by-title">Trusted by customers</h2>
      <div className="logos-container">
        {logos.map((logo, index) => (
          <img key={index} src={logo.src} alt={logo.alt} className="partner-logo" />
        ))}
      </div>
    </section>
  );
};

export default TrustedBy;

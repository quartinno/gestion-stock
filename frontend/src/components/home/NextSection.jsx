import React from 'react';
import UnionWave from '../../assets/images/Union.svg';
import './NextSection.css';

const NextSection = () => {
  return (
    <section className="next-section">
      <div className="next-section-content">
        {/* Content will be added here later */}
      </div>
      <div className="union-wave">
        <img src={UnionWave} alt="Union wave" />
      </div>
    </section>
  );
};

export default NextSection;

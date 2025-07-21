import React, { useState, useEffect, useRef } from 'react';
import UnionWave from '../../assets/images/Union.svg';
import Stars from '../../assets/images/stars.svg';
import Avatar1 from '../../assets/images/Review avatar 1.svg';
import Avatar2 from '../../assets/images/Review avatar 2.svg';
import Avatar3 from '../../assets/images/Review avatar 3.svg';
import Avatar4 from '../../assets/images/Review avatar 4.svg';
// Inline SVG arrows to avoid external dependencies
import './Reviews.css';

const Reviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const slideInterval = useRef();
  const totalSlides = 4; // Total number of review cards

  const goToSlide = (index) => {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.children[0]?.offsetWidth || 0;
      const gap = 30; // Same as gap in CSS
      const scrollPosition = index * (cardWidth + gap);
      
      sliderRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      
      setCurrentSlide(index);
    }
  };

  const nextSlide = () => {
    goToSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    goToSlide(currentSlide - 1);
  };

  // Auto slide effect
  useEffect(() => {
    const autoSlide = () => {
      slideInterval.current = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    };

    autoSlide();

    // Pause auto-slide on hover
    const slider = sliderRef.current;
    const pauseAutoSlide = () => clearInterval(slideInterval.current);
    const resumeAutoSlide = () => {
      clearInterval(slideInterval.current);
      autoSlide();
    };

    if (slider) {
      slider.addEventListener('mouseenter', pauseAutoSlide);
      slider.addEventListener('mouseleave', resumeAutoSlide);
    }

    return () => {
      clearInterval(slideInterval.current);
      if (slider) {
        slider.removeEventListener('mouseenter', pauseAutoSlide);
        slider.removeEventListener('mouseleave', resumeAutoSlide);
      }
    };
  }, [currentSlide]);

  // Update current slide when user scrolls manually
  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        const scrollPosition = sliderRef.current.scrollLeft;
        const cardWidth = sliderRef.current.children[0]?.offsetWidth || 0;
        const gap = 30;
        const slideIndex = Math.round(scrollPosition / (cardWidth + gap));
        
        if (slideIndex !== currentSlide) {
          setCurrentSlide(slideIndex);
        }
      }
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', handleScroll);
      return () => slider.removeEventListener('scroll', handleScroll);
    }
  }, [currentSlide]);
  const reviews = [
    {
      id: 1,
      avatar: Avatar1,
      name: 'Alex Johnson',
      role: 'CEO at TechCorp',
      review: 'Quantixa transformed our business operations completely. Their innovative solutions helped us increase efficiency by 200%.',
      rating: 5
    },
    {
      id: 2,
      avatar: Avatar2,
      name: 'Sarah Williams',
      role: 'Marketing Director',
      review: 'The team at Quantixa is exceptional. They delivered our project on time and exceeded our expectations.',
      rating: 5
    },
    {
      id: 3,
      avatar: Avatar3,
      name: 'Michael Chen',
      role: 'Product Manager',
      review: 'Working with Quantixa was a game-changer for our product development cycle. Highly recommended!',
      rating: 5
    },
    {
      id: 4,
      avatar: Avatar4,
      name: 'Emily Rodriguez',
      role: 'CTO at StartUp',
      review: 'Their technical expertise and professionalism are unmatched. We\'ve seen incredible results since partnering with them.',
      rating: 5
    }
  ];

  return (
    <section className="reviews-section">
      <div className="reviews-content">
        <div className="reviews-header">
          <h2>What Our Clients Say</h2>
          <p>Hear from businesses that have transformed their operations with our solutions</p>
        </div>
        
        <div className="reviews-slider">
          <button 
            className="slider-arrow left-arrow" 
            aria-label="Previous review"
            onClick={prevSlide}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="reviews-cards" ref={sliderRef}>
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-rating">
                  <img src={Stars} alt={`${review.rating} stars`} />
                </div>
                <p className="review-text">"{review.review}"</p>
                <div className="reviewer-info">
                  <img src={review.avatar} alt={review.name} className="reviewer-avatar" />
                  <div className="reviewer-details">
                    <h4>{review.name}</h4>
                    <span>{review.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="slider-arrow right-arrow" 
            aria-label="Next review"
            onClick={nextSlide}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="slider-dots">
          {reviews.map((_, index) => (
            <button 
              key={index} 
              className={`slider-dot ${index === currentSlide % totalSlides ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to review ${index + 1}`}
              aria-current={index === currentSlide % totalSlides ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
      
      <div className="union-wave">
        <img src={UnionWave} alt="" />
      </div>
    </section>
  );
};

export default Reviews;

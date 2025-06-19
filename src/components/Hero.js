import React from 'react';
import './Hero.css';

const Hero = ({ onBookNow }) => (
  <section className="hero">
    <div className="hero-content">
      <h1>FreshFold Dry Cleaners</h1>
      <p>Your clothes, our care. Experience freshness like never before!</p>
      <a href="#book" className="cta-btn" onClick={e => { e.preventDefault(); onBookNow && onBookNow(); }}>Book Now</a>
    </div>
  </section>
);

export default Hero; 
import React from 'react';
import './Testimonials.css';

const testimonials = [
  {
    name: 'Amit S.',
    review: 'Excellent service! My clothes always come back spotless and fresh. Highly recommend FreshFold!',
  },
  {
    name: 'Priya K.',
    review: 'Quick turnaround and friendly staff. The express service saved my day!'
  },
  {
    name: 'Rahul M.',
    review: 'Best dry cleaners in town. Eco-friendly and professional.'
  }
];

const Testimonials = () => (
  <section className="testimonials" id="testimonials">
    <h2>Customer Testimonials</h2>
    <div className="testimonials-list">
      {testimonials.map((t, i) => (
        <div className="testimonial-card" key={i} style={{ animationDelay: `${i * 0.2 + 0.2}s` }}>
          <p className="review">“{t.review}”</p>
          <span className="customer">- {t.name}</span>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials; 
import React from 'react';
import './Services.css';

const services = [
  { icon: '🧥', title: 'Garment Dry Cleaning', desc: 'Expert cleaning for all types of garments.' },
  { icon: '👔', title: 'Laundry & Ironing', desc: 'Crisp, clean, and perfectly pressed clothes.' },
  { icon: '🧸', title: 'Household Items', desc: 'Curtains, bedsheets, and more—fresh as new.' },
  { icon: '⚡', title: 'Express Service', desc: 'Same-day and next-day delivery available.' },
];

const Services = () => (
  <section className="services" id="services">
    <h2>Services We Offer</h2>
    <div className="services-list">
      {services.map((s, i) => (
        <div className="service-card" key={i} style={{ animationDelay: `${i * 0.2 + 0.2}s` }}>
          <span className="service-icon">{s.icon}</span>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Services; 
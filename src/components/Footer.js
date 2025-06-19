import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer" id="contact">
    <div className="footer-content">
      <div>
        <strong>Developer:</strong> Amol Jadhav &nbsp;|&nbsp; <strong>Email:</strong> <a href="mailto:amolj9238@gmail.com" style={{color:'#90caf9'}}>amolj9238@gmail.com</a> &nbsp;|&nbsp; <strong>Contact:</strong> <a href="tel:+919552678123" style={{color:'#90caf9'}}>9552678123</a>
      </div>
      <div className="footer-social">
        <a href="https://www.instagram.com/mr_amol9552?igsh=M2dwemxqcjUxaXJ1" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
        </a>
        <a href="https://www.linkedin.com/in/amol-jadhav-818a232a6" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><circle cx="8" cy="8" r="2"/><rect x="6" y="14" width="4" height="7"/></svg>
        </a>
      </div>
      <div>
        &copy; {new Date().getFullYear()} FreshFold Dry Cleaners. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer; 
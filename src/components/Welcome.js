import React from 'react';

const welcomeStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #e0e7ff 0%, #fff 100%)',
  textAlign: 'center',
  animation: 'fadeIn 1.2s',
};

const logoStyle = {
  width: 90,
  height: 90,
  marginBottom: 24,
  borderRadius: 18,
  boxShadow: '0 4px 24px rgba(26,35,126,0.13)',
};

const titleStyle = {
  fontSize: '2.3rem',
  fontWeight: 'bold',
  color: '#1a237e',
  marginBottom: 12,
  letterSpacing: 1.2,
};

const taglineStyle = {
  fontSize: '1.15rem',
  color: '#3949ab',
  marginBottom: 24,
  fontWeight: 500,
};

const buttonStyle = {
  background: 'linear-gradient(90deg, #3949ab 60%, #1a237e 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '0.85rem 2.2rem',
  fontSize: '1.15rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: 18,
  boxShadow: '0 2px 8px rgba(26,35,126,0.08)',
  letterSpacing: '0.2px',
  transition: 'background 0.2s, transform 0.2s',
};

const fadeInKeyframes = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;

const Welcome = ({ onExplore }) => (
  <div style={welcomeStyle}>
    <style>{fadeInKeyframes}</style>
    <img src={require('../logo.svg').default} alt="App Logo" style={logoStyle} />
    <div style={titleStyle}>Welcome to FreshFold</div>
    <div style={taglineStyle}>Your clothes, our care. Experience freshness like never before!</div>
    <button style={buttonStyle} onClick={onExplore}>Explore Now</button>
  </div>
);

export default Welcome; 
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

const Login = ({ onSwitch, onAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    document.body.classList.add('auth-bg');
    return () => document.body.classList.remove('auth-bg');
  }, []);

  // Email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Phone/OTP login
  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
          size: 'invisible',
        }, auth);
      }
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmation(confirmationResult);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await confirmation.confirm(otp);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="animated-bg-shapes">
        <span className="shape1"></span>
        <span className="shape2"></span>
        <span className="shape3"></span>
        <span className="shape4"></span>
      </div>
      <div className="auth-container">
        <h2>Login</h2>
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => setShowPhone(false)} style={{ marginRight: 8, fontWeight: !showPhone ? 'bold' : 'normal' }}>Email/Password</button>
          <button onClick={() => setShowPhone(true)} style={{ fontWeight: showPhone ? 'bold' : 'normal' }}>Phone/OTP</button>
        </div>
        {!showPhone ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            {error && <div className="auth-error">{error}</div>}
          </form>
        ) : (
          <form onSubmit={confirmation ? handleVerifyOtp : handlePhoneLogin}>
            <input
              type="tel"
              placeholder="Phone (+91...)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              disabled={!!confirmation}
            />
            {confirmation && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            )}
            <div id="recaptcha-container" style={{ margin: '0.5rem 0' }}></div>
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : confirmation ? 'Verify OTP' : 'Send OTP'}
            </button>
            {error && <div className="auth-error">{error}</div>}
          </form>
        )}
        <p>Don't have an account? <button onClick={onSwitch}>Sign up</button></p>
        <p style={{marginTop:'1rem'}}>
          <button type="button" style={{background:'none',color:'#3949ab',border:'none',textDecoration:'underline',cursor:'pointer'}} onClick={onAdminLogin}>
            Admin Login
          </button>
        </p>
      </div>
    </>
  );
};

export default Login; 
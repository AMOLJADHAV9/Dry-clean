import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const AdminLogin = ({ onAdminRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Admin login successful!');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    document.body.classList.add('auth-bg');
    return () => document.body.classList.remove('auth-bg');
  }, []);

  return (
    <>
      <div className="animated-bg-shapes">
        <span className="shape1"></span>
        <span className="shape2"></span>
        <span className="shape3"></span>
        <span className="shape4"></span>
      </div>
      <div className="auth-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleAdminLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login as Admin'}</button>
          {error && <div className="auth-error">{error}</div>}
          {success && <div style={{color:'#388e3c',marginTop:'1rem',fontWeight:'bold'}}>{success}</div>}
        </form>
        <p style={{marginTop:'1rem'}}>
          <button type="button" style={{background:'none',color:'#3949ab',border:'none',textDecoration:'underline',cursor:'pointer'}} onClick={onAdminRegister}>
            Admin Register
          </button>
        </p>
      </div>
    </>
  );
};

export default AdminLogin; 
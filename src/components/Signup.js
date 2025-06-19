import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Signup = ({ onSwitch }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      // Add user to Firestore 'users' collection
      const db = getFirestore();
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        name,
        email,
        createdAt: serverTimestamp(),
      });
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
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
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
          <button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
          {error && <div className="auth-error">{error}</div>}
        </form>
        <p>Already have an account? <button onClick={onSwitch}>Login</button></p>
      </div>
    </>
  );
};

export default Signup; 
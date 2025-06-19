import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AdminRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      // Add admin to Firestore 'admins' collection
      const db = getFirestore();
      await addDoc(collection(db, 'admins'), {
        uid: userCredential.user.uid,
        name,
        email,
        createdAt: serverTimestamp(),
      });
      setSuccess('Admin registered successfully!');
      setName('');
      setEmail('');
      setPassword('');
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
        <h2>Admin Register</h2>
        <form onSubmit={handleAdminRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={loading}
          />
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
          <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register as Admin'}</button>
          {error && <div className="auth-error">{error}</div>}
          {success && <div style={{color:'#388e3c',marginTop:'1rem',fontWeight:'bold'}}>{success}</div>}
        </form>
      </div>
    </>
  );
};

export default AdminRegister; 
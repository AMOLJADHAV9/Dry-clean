import React, { useState } from 'react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';

const UserProfile = () => {
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || '');
  const [email] = useState(user?.email || '');
  const [uid] = useState(user?.uid || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateProfile(user, { displayName: name });
      setSuccess('Profile updated!');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container" style={{marginTop:'2rem'}}>
      <h2>User Profile</h2>
      <form onSubmit={handleSave}>
        <label style={{fontWeight:'bold',marginBottom:4}}>Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <label style={{fontWeight:'bold',marginBottom:4}}>Email</label>
        <input type="email" value={email} disabled />
        <label style={{fontWeight:'bold',marginBottom:4}}>User ID</label>
        <input type="text" value={uid} disabled />
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        {success && <div style={{color:'#388e3c',marginTop:'0.5rem'}}>{success}</div>}
        {error && <div className="auth-error">{error}</div>}
      </form>
    </div>
  );
};

export default UserProfile; 
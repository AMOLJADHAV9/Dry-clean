import React from 'react';
import { auth } from '../firebase';

const RoleErrorPage = ({ message, onGoHome }) => {
  const handleLogout = async () => {
    await auth.signOut();
    window.location.reload();
  };

  return (
    <div style={{minHeight:'60vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f5f7fa'}}>
      <div style={{background:'#fff',padding:'2.5rem 2rem',borderRadius:16,boxShadow:'0 2px 16px rgba(57,73,171,0.10)',textAlign:'center'}}>
        <h2 style={{color:'#d32f2f',marginBottom:'1rem'}}>Access Denied</h2>
        <div style={{color:'#3949ab',fontSize:'1.1rem',marginBottom:'2rem'}}>{message || 'You are not authorized to view this page.'}</div>
        <button onClick={onGoHome} style={{marginRight:12,background:'#3949ab',color:'#fff',border:'none',borderRadius:'8px',padding:'0.7rem 2rem',fontWeight:'bold',fontSize:'1rem',cursor:'pointer'}}>Go Home</button>
        <button onClick={handleLogout} style={{background:'#d32f2f',color:'#fff',border:'none',borderRadius:'8px',padding:'0.7rem 2rem',fontWeight:'bold',fontSize:'1rem',cursor:'pointer'}}>Logout</button>
      </div>
    </div>
  );
};

export default RoleErrorPage; 
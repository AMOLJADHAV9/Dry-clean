import React, { useState, useEffect } from 'react';
import './App.css';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import './components/Auth.css';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import UserProfile from './components/UserProfile';
import ServiceSelection from './components/ServiceSelection';
import UserDashboard from './components/UserDashboard';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import AdminDashboard from './components/AdminDashboard';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import RoleErrorPage from './components/RoleErrorPage';

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminRegister, setShowAdminRegister] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState(null);
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      setRole(null);
      setRoleError('');
      if (currentUser) {
        const db = getFirestore();
        const adminSnap = await getDocs(query(collection(db, 'admins'), where('uid', '==', currentUser.uid)));
        if (!adminSnap.empty) {
          setRole('admin');
          setIsAdmin(true);
          setShowAdminLogin(false);
          setShowAdminRegister(false);
          return;
        }
        const userSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', currentUser.uid)));
        if (!userSnap.empty) {
          setRole('user');
          setIsAdmin(false);
          return;
        }
        setRoleError('No valid role found for this account.');
      }
    });
    return () => unsubscribe();
  }, [showAdminLogin, showAdminRegister]);

  if (loading) return <div style={{textAlign:'center',marginTop:'3rem'}}>Loading...</div>;
  if (roleError) return <RoleErrorPage message={roleError} onGoHome={async () => { await signOut(auth); window.location.reload(); }} />;

  if (!user) {
    if (showAdminRegister) {
      return (
        <div className="auth-container">
          <button onClick={() => setShowAdminRegister(false)} style={{marginBottom:'1rem',background:'#fff',color:'#1a237e',border:'1px solid #1a237e',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer'}}>Back to Admin Login</button>
          <AdminRegister />
        </div>
      );
    }
    if (showAdminLogin) {
      return (
        <div className="auth-container">
          <button onClick={() => setShowAdminLogin(false)} style={{marginBottom:'1rem',background:'#fff',color:'#1a237e',border:'1px solid #1a237e',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer'}}>Back to User Login</button>
          <AdminLogin onAdminRegister={() => { setShowAdminRegister(true); setShowAdminLogin(false); }} />
        </div>
      );
    }
    return showSignup ? (
      <Signup onSwitch={() => setShowSignup(false)} />
    ) : (
      <Login onSwitch={() => setShowSignup(true)} onAdminLogin={() => setShowAdminLogin(true)} />
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (showProfile) {
    return (
      <div className="App">
        <button onClick={() => setShowProfile(false)} style={{position:'fixed',top:20,right:240,zIndex:1000,background:'#fff',color:'#1a237e',border:'1px solid #1a237e',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Back to Home</button>
        <button onClick={handleLogout} style={{position:'fixed',top:20,right:20,zIndex:1000,background:'#1a237e',color:'#fff',border:'none',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Logout</button>
        <UserProfile />
      </div>
    );
  }

  if (showServices) {
    return (
      <div className="App">
        <button onClick={() => setShowServices(false)} style={{position:'fixed',top:20,right:240,zIndex:1000,background:'#fff',color:'#1a237e',border:'1px solid #1a237e',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Back to Home</button>
        <button onClick={handleLogout} style={{position:'fixed',top:20,right:20,zIndex:1000,background:'#1a237e',color:'#fff',border:'none',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Logout</button>
        <ServiceSelection />
      </div>
    );
  }

  if (showDashboard) {
    return (
      <div className="App">
        <button onClick={() => setShowDashboard(false)} style={{position:'fixed',top:20,right:340,zIndex:1000,background:'#fff',color:'#1a237e',border:'1px solid #1a237e',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Back to Home</button>
        <button onClick={handleLogout} style={{position:'fixed',top:20,right:20,zIndex:1000,background:'#1a237e',color:'#fff',border:'none',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Logout</button>
        <UserDashboard onBookNow={() => { setShowDashboard(false); setShowServices(true); }} />
      </div>
    );
  }

  if (role === 'admin' && user) {
    return <AdminDashboard onLogout={async () => { await signOut(auth); setIsAdmin(false); setUser(null); setRole(null); }} />;
  }
  if (role === 'user' && user) {
    return (
      <div className="App">
        <button onClick={() => setShowDashboard(true)} style={{position:'fixed',top:20,right:340,zIndex:1000,background:'#fff',color:'#1a237e',border:'1px solid #1a237e',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Dashboard</button>
        <button onClick={() => setShowServices(true)} style={{position:'fixed',top:20,right:240,zIndex:1000,background:'#fff',color:'#1a237e',border:'1px solid #1a237e',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Services</button>
        <button onClick={() => setShowProfile(true)} style={{position:'fixed',top:20,right:140,zIndex:1000,background:'#fff',color:'#1a237e',border:'1px solid #1a237e',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Profile</button>
        <button onClick={handleLogout} style={{position:'fixed',top:20,right:20,zIndex:1000,background:'#1a237e',color:'#fff',border:'none',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Logout</button>
        <Hero onBookNow={() => setShowServices(true)} />
        <AboutUs />
        <Services />
        <Testimonials />
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <button onClick={() => setShowDashboard(true)} style={{position:'fixed',top:20,right:340,zIndex:1000,background:'#fff',color:'#1a237e',border:'1px solid #1a237e',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Dashboard</button>
      <button onClick={() => setShowServices(true)} style={{position:'fixed',top:20,right:240,zIndex:1000,background:'#fff',color:'#1a237e',border:'1px solid #1a237e',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Services</button>
      <button onClick={() => setShowProfile(true)} style={{position:'fixed',top:20,right:140,zIndex:1000,background:'#fff',color:'#1a237e',border:'1px solid #1a237e',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Profile</button>
      <button onClick={handleLogout} style={{position:'fixed',top:20,right:20,zIndex:1000,background:'#1a237e',color:'#fff',border:'none',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',cursor:'pointer',boxShadow:'0 2px 8px rgba(26,35,126,0.12)'}}>Logout</button>
      <Hero onBookNow={() => setShowServices(true)} />
      <AboutUs />
      <Services />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;

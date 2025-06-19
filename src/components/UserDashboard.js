import React, { useState, useRef } from 'react';
import { auth } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const TABS = [
  'Profile Info',
  'Current Bookings',
  'Booking History',
  'Payment History',
  'Service Status',
  'Download Invoices',
];

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=3949ab&color=fff&size=128';

const mobileHeader = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: '#3949ab',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 2rem',
  boxShadow: '0 2px 8px rgba(57,73,171,0.10)',
  marginBottom: '2rem',
  borderRadius: '0 0 12px 12px',
  flexWrap: 'wrap',
};

const UserDashboard = ({ onBookNow }) => {
  const user = auth.currentUser;
  const [tab, setTab] = useState(TABS[0]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef();

  // Booking state
  const [currentBookings, setCurrentBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Booking history state
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');

  // Service status state
  const [serviceStatus, setServiceStatus] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [statusError, setStatusError] = useState('');

  // Fetch current bookings when tab or user changes
  React.useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoadingBookings(true);
      setBookingError('');
      try {
        const db = getFirestore();
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        // Current bookings: not delivered or cancelled
        const bookings = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(order => (order.status || 'Pending') !== 'Delivered' && (order.status || 'Pending') !== 'Cancelled');
        setCurrentBookings(bookings);
      } catch (err) {
        setBookingError('Failed to load bookings.');
      }
      setLoadingBookings(false);
    };
    if (tab === 'Current Bookings') fetchBookings();
  }, [tab, user]);

  // Fetch booking history when tab or user changes
  React.useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoadingHistory(true);
      setHistoryError('');
      try {
        const db = getFirestore();
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        // Booking history: delivered or cancelled
        const history = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(order => (order.status === 'Delivered' || order.status === 'Cancelled'));
        setBookingHistory(history);
      } catch (err) {
        setHistoryError('Failed to load booking history.');
      }
      setLoadingHistory(false);
    };
    if (tab === 'Booking History') fetchHistory();
  }, [tab, user]);

  // Fetch all bookings for service status when tab or user changes
  React.useEffect(() => {
    const fetchStatus = async () => {
      if (!user) return;
      setLoadingStatus(true);
      setStatusError('');
      try {
        const db = getFirestore();
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServiceStatus(allOrders);
      } catch (err) {
        setStatusError('Failed to load service status.');
      }
      setLoadingStatus(false);
    };
    if (tab === 'Service Status') fetchStatus();
  }, [tab, user]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: url });
      window.location.reload(); // Refresh to show new photo
    } catch (err) {
      setUploadError('Failed to upload photo.');
    }
    setUploading(false);
  };

  return (
    <div style={{marginTop: window.innerWidth < 600 ? '3.5rem' : '6rem', maxWidth: 900, marginLeft:'auto', marginRight:'auto', padding:'0 1rem'}}>
      {/* Header Navbar */}
      <div style={mobileHeader}>
        <div style={{fontWeight:'bold',fontSize:'1.2rem',letterSpacing:'1px',marginBottom:window.innerWidth<600?'0.7rem':0}}>FreshFold User Dashboard</div>
        <div style={{display:'flex',alignItems:'center',gap:'1.2rem',flexWrap:'wrap'}}>
          <button
            onClick={onBookNow}
            style={{background:'#fff',color:'#3949ab',border:'none',borderRadius:'8px',padding:'0.6rem 1.5rem',fontWeight:'bold',fontSize:'1rem',cursor:'pointer',boxShadow:'0 2px 8px rgba(57,73,171,0.10)',width:window.innerWidth<600?'100%':'auto'}}
          >
            Book Now
          </button>
          <div style={{position:'relative'}}>
            <img
              src={user?.photoURL || DEFAULT_AVATAR}
              alt="Profile"
              style={{width:48,height:48,borderRadius:'50%',objectFit:'cover',border:'2px solid #fff',boxShadow:'0 2px 8px rgba(57,73,171,0.10)'}}
            />
            <button
              style={{position:'absolute',bottom:0,right:0,background:'#fff',color:'#3949ab',border:'none',borderRadius:'50%',width:22,height:22,fontSize:14,cursor:'pointer',boxShadow:'0 1px 4px rgba(57,73,171,0.10)'}}
              onClick={() => fileInputRef.current.click()}
              title="Edit profile picture"
              disabled={uploading}
            >
              ✎
            </button>
            <input
              type="file"
              accept="image/*"
              style={{display:'none'}}
              ref={fileInputRef}
              onChange={handlePhotoChange}
              disabled={uploading}
            />
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontWeight:'bold',fontSize:window.innerWidth<600?'1rem':undefined}}>{user?.displayName || '-'}</div>
            <div style={{fontSize:'0.95rem',opacity:0.85}}>{user?.email || '-'}</div>
            {uploadError && <div style={{color:'#ffb300',fontSize:'0.95rem'}}>{uploadError}</div>}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="auth-container" style={{marginTop: window.innerWidth < 600 ? '2.2rem' : '3.5rem', maxWidth: 900, boxShadow:'0 2px 16px rgba(57,73,171,0.08)', borderRadius:12, background:'#fff', padding:window.innerWidth<600?'1rem 0.5rem':'2rem'}}>
        <h2 style={{color:'#3949ab',marginBottom:'1.5rem',fontSize:window.innerWidth<600?'1.2rem':'2rem'}}>User Dashboard</h2>
        <div style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap',flexDirection:window.innerWidth<600?'column':'row'}}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? '#3949ab' : '#fff',
                color: tab === t ? '#fff' : '#3949ab',
                border: '1.5px solid #3949ab',
                borderRadius: 8,
                padding: window.innerWidth<600?'0.7rem 0':'0.5rem 1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: tab === t ? '0 2px 8px rgba(57,73,171,0.12)' : 'none',
                transition: 'all 0.2s',
                width: window.innerWidth<600?'100%':'auto',
                fontSize: window.innerWidth<600?'1.05rem':'1rem',
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{padding:'1rem 0'}}>
        {tab === 'Profile Info' && (
          <div>
            <h3 style={{color:'#3949ab'}}>Profile Information</h3>
            <div><strong>Name:</strong> {user?.displayName || '-'}</div>
            <div><strong>Email:</strong> {user?.email || '-'}</div>
            <div style={{marginTop:'1rem'}}>
              <button style={{marginRight:8}}>Edit Email</button>
              <button>Edit Password</button>
            </div>
          </div>
        )}
        {tab === 'Current Bookings' && (
          <div>
            <h3 style={{color:'#3949ab'}}>Current Bookings</h3>
            {loadingBookings ? (
              <div>Loading your bookings...</div>
            ) : bookingError ? (
              <div style={{color:'red'}}>{bookingError}</div>
            ) : currentBookings.length === 0 ? (
              <div>No current bookings found.</div>
            ) : (
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',marginTop:'1rem'}}>
                  <thead>
                    <tr style={{background:'#f5f7fa'}}>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Order ID</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Services</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Total</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Status</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Booked On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBookings.map(order => (
                      <tr key={order.id}>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{order.id}</td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>
                          <ul style={{margin:0,paddingLeft:'1.2rem'}}>
                            {order.cart && order.cart.map((item, idx) => (
                              <li key={idx}>{item.name} x {item.quantity}</li>
                            ))}
                          </ul>
                        </td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>₹{order.total}</td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{order.status || 'Pending'}</td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{order.created && order.created.seconds ? new Date(order.created.seconds * 1000).toLocaleString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab === 'Booking History' && (
          <div>
            <h3 style={{color:'#3949ab'}}>Booking History</h3>
            {loadingHistory ? (
              <div>Loading your booking history...</div>
            ) : historyError ? (
              <div style={{color:'red'}}>{historyError}</div>
            ) : bookingHistory.length === 0 ? (
              <div>No past bookings found.</div>
            ) : (
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',marginTop:'1rem'}}>
                  <thead>
                    <tr style={{background:'#f5f7fa'}}>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Order ID</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Services</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Total</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Status</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Booked On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingHistory.map(order => (
                      <tr key={order.id}>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{order.id}</td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>
                          <ul style={{margin:0,paddingLeft:'1.2rem'}}>
                            {order.cart && order.cart.map((item, idx) => (
                              <li key={idx}>{item.name} x {item.quantity}</li>
                            ))}
                          </ul>
                        </td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>₹{order.total}</td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{order.status}</td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{order.created && order.created.seconds ? new Date(order.created.seconds * 1000).toLocaleString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab === 'Payment History' && (
          <div>
            <h3 style={{color:'#3949ab'}}>Payment History</h3>
            <div>(List of payments will appear here.)</div>
          </div>
        )}
        {tab === 'Service Status' && (
          <div>
            <h3 style={{color:'#3949ab'}}>Service Status</h3>
            {loadingStatus ? (
              <div>Loading your service status...</div>
            ) : statusError ? (
              <div style={{color:'red'}}>{statusError}</div>
            ) : serviceStatus.length === 0 ? (
              <div>No bookings found.</div>
            ) : (
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',marginTop:'1rem'}}>
                  <thead>
                    <tr style={{background:'#f5f7fa'}}>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Order ID</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Services</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Status</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceStatus.map(order => (
                      <tr key={order.id}>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{order.id}</td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>
                          <ul style={{margin:0,paddingLeft:'1.2rem'}}>
                            {order.cart && order.cart.map((item, idx) => (
                              <li key={idx}>{item.name} x {item.quantity}</li>
                            ))}
                          </ul>
                        </td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{order.status || 'Pending'}</td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{order.updatedAt && order.updatedAt.seconds ? new Date(order.updatedAt.seconds * 1000).toLocaleString() : (order.created && order.created.seconds ? new Date(order.created.seconds * 1000).toLocaleString() : '-')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab === 'Download Invoices' && (
          <div>
            <h3 style={{color:'#3949ab'}}>Download Invoices</h3>
            <div>(Download links for invoices will appear here.)</div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 
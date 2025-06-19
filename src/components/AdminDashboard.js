import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';

const TABS = [
  'Manage Services',
  'Users',
  'Bookings',
  'Payments',
  'Coupons',
  'Notifications',
];
const STATUS_OPTIONS = ['Picked Up', 'Cleaning', 'Ready', 'Delivered'];

const AdminDashboard = ({ onLogout }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();
  const [tab, setTab] = useState(TABS[0]);

  // Manage Services
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({ name: '', price: '', desc: '', img: '', badges: '' });
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceError, setServiceError] = useState('');
  const [serviceSuccess, setServiceSuccess] = useState('');
  const [editServiceId, setEditServiceId] = useState(null);

  // Users
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Bookings
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState('');
  const [bookingFilter, setBookingFilter] = useState('All');

  useEffect(() => {
    if (tab === 'Manage Services') fetchServices();
    if (tab === 'Users') fetchUsers();
    if (tab === 'Bookings') fetchOrders();
    // eslint-disable-next-line
  }, [tab]);

  // --- Manage Services ---
  const fetchServices = async () => {
    setServiceLoading(true);
    setServiceError('');
    try {
      const snapshot = await getDocs(collection(db, 'services'));
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setServiceError('Failed to fetch services.');
    }
    setServiceLoading(false);
  };

  const handleServiceFormChange = e => {
    setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });
  };

  const handleAddOrEditService = async e => {
    e.preventDefault();
    setServiceLoading(true);
    setServiceError('');
    setServiceSuccess('');
    try {
      const data = {
        name: serviceForm.name,
        price: Number(serviceForm.price),
        desc: serviceForm.desc,
        img: serviceForm.img,
        badges: serviceForm.badges.split(',').map(b => b.trim()).filter(Boolean),
      };
      if (editServiceId) {
        await updateDoc(doc(db, 'services', editServiceId), data);
        setServiceSuccess('Service updated!');
      } else {
        await addDoc(collection(db, 'services'), data);
        setServiceSuccess('Service added!');
      }
      setServiceForm({ name: '', price: '', desc: '', img: '', badges: '' });
      setEditServiceId(null);
      fetchServices();
    } catch (err) {
      setServiceError('Failed to save service.');
    }
    setServiceLoading(false);
  };

  const handleEditService = service => {
    setEditServiceId(service.id);
    setServiceForm({
      name: service.name,
      price: service.price,
      desc: service.desc,
      img: service.img,
      badges: (service.badges || []).join(', '),
    });
  };

  const handleDeleteService = async id => {
    if (!window.confirm('Delete this service?')) return;
    setServiceLoading(true);
    try {
      await deleteDoc(doc(db, 'services', id));
      fetchServices();
    } catch (err) {
      setServiceError('Failed to delete service.');
    }
    setServiceLoading(false);
  };

  // --- Users ---
  const fetchUsers = async () => {
    setLoadingUsers(true);
    // Placeholder: In real app, use Firebase Admin SDK or store user info in Firestore
    setUsers([]);
    setLoadingUsers(false);
  };

  // --- Bookings ---
  const fetchOrders = async () => {
    setLoadingOrders(true);
    setOrderError('');
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      let orderList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (bookingFilter !== 'All') {
        orderList = orderList.filter(o => (o.status || 'Pending') === bookingFilter);
      }
      setOrders(orderList);
    } catch (err) {
      setOrderError('Failed to fetch orders.');
    }
    setLoadingOrders(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status.');
    }
    setStatusUpdating('');
  };

  return (
    <div style={{marginTop:'0', maxWidth: 1200, marginLeft:'auto', marginRight:'auto'}}>
      {/* Header Navbar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#1a237e',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        boxShadow: '0 2px 8px rgba(26,35,126,0.10)',
        marginBottom: '2rem',
      }}>
        <div style={{fontWeight:'bold',fontSize:'1.3rem',letterSpacing:'1px'}}>FreshFold Admin</div>
        <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontWeight:'bold'}}>{user?.displayName || '-'}</div>
            <div style={{fontSize:'0.95rem',opacity:0.85}}>{user?.email || '-'}</div>
          </div>
          <button onClick={onLogout} style={{background:'#d32f2f',color:'#fff',border:'none',borderRadius:'8px',padding:'0.5rem 1.2rem',fontWeight:'bold',fontSize:'1rem',cursor:'pointer'}}>Logout</button>
        </div>
      </div>
      {/* Main Content */}
      <div className="auth-container" style={{marginTop:'2rem', maxWidth: 1200}}>
        <h2>Admin Dashboard</h2>
        <div style={{marginBottom:'1.5rem'}}>
          <strong>Name:</strong> {user?.displayName || '-'}<br/>
          <strong>Email:</strong> {user?.email || '-'}
        </div>
        <div style={{display:'flex',gap:'1rem',marginBottom:'2rem',flexWrap:'wrap'}}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? '#1a237e' : '#fff',
                color: tab === t ? '#fff' : '#1a237e',
                border: '1px solid #1a237e',
                borderRadius: 8,
                padding: '0.5rem 1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: tab === t ? '0 2px 8px rgba(26,35,126,0.12)' : 'none',
              }}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === 'Manage Services' && (
          <div>
            <h3>Manage Services</h3>
            <form onSubmit={handleAddOrEditService} style={{marginBottom:'2rem',display:'flex',gap:'1rem',flexWrap:'wrap',alignItems:'center'}}>
              <input name="name" placeholder="Service Name" value={serviceForm.name} onChange={handleServiceFormChange} required style={{minWidth:150}} />
              <input name="price" type="number" placeholder="Price" value={serviceForm.price} onChange={handleServiceFormChange} required style={{minWidth:100}} />
              <input name="desc" placeholder="Description" value={serviceForm.desc} onChange={handleServiceFormChange} required style={{minWidth:200}} />
              <input name="img" placeholder="Image URL" value={serviceForm.img} onChange={handleServiceFormChange} required style={{minWidth:200}} />
              <input name="badges" placeholder="Badges (comma separated)" value={serviceForm.badges} onChange={handleServiceFormChange} style={{minWidth:150}} />
              <button type="submit" disabled={serviceLoading}>{editServiceId ? 'Update' : 'Add'} Service</button>
              {editServiceId && <button type="button" onClick={() => { setEditServiceId(null); setServiceForm({ name: '', price: '', desc: '', img: '', badges: '' }); }}>Cancel</button>}
            </form>
            {serviceError && <div style={{color:'red'}}>{serviceError}</div>}
            {serviceSuccess && <div style={{color:'#388e3c',fontWeight:'bold'}}>{serviceSuccess}</div>}
            {serviceLoading ? <div>Loading...</div> : (
              <table style={{width:'100%',borderCollapse:'collapse',marginTop:'1rem'}}>
                <thead>
                  <tr style={{background:'#f5f7fa'}}>
                    <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Name</th>
                    <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Price</th>
                    <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Description</th>
                    <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Image</th>
                    <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Badges</th>
                    <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(service => (
                    <tr key={service.id}>
                      <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{service.name}</td>
                      <td style={{padding:'0.5rem',border:'1px solid #eee'}}>₹{service.price}</td>
                      <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{service.desc}</td>
                      <td style={{padding:'0.5rem',border:'1px solid #eee'}}><img src={service.img} alt={service.name} style={{width:60,height:40,objectFit:'cover',borderRadius:6}} /></td>
                      <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{(service.badges || []).join(', ')}</td>
                      <td style={{padding:'0.5rem',border:'1px solid #eee'}}>
                        <button onClick={() => handleEditService(service)} style={{marginRight:8}}>Edit</button>
                        <button onClick={() => handleDeleteService(service.id)} style={{color:'#d32f2f'}}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {tab === 'Users' && (
          <div>
            <h3>All Users (Coming Soon)</h3>
            <div>List and manage users here.</div>
          </div>
        )}
        {tab === 'Bookings' && (
          <div>
            <h3>All Bookings</h3>
            <div style={{marginBottom:'1rem'}}>
              <label>Filter by Status: </label>
              <select value={bookingFilter} onChange={e => { setBookingFilter(e.target.value); fetchOrders(); }}>
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            {loadingOrders ? <div>Loading bookings...</div> : orderError ? <div style={{color:'red'}}>{orderError}</div> : (
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',marginTop:'1rem'}}>
                  <thead>
                    <tr style={{background:'#f5f7fa'}}>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Order ID</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>User Email</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Services</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Total</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Status</th>
                      <th style={{padding:'0.5rem',border:'1px solid #eee'}}>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{order.id}</td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{order.userEmail}</td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>
                          <ul style={{margin:0,paddingLeft:'1.2rem'}}>
                            {order.cart && order.cart.map((item, idx) => (
                              <li key={idx}>{item.name} x {item.quantity}</li>
                            ))}
                          </ul>
                        </td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>₹{order.total}</td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>{order.status || 'Pending'}</td>
                        <td style={{padding:'0.5rem',border:'1px solid #eee'}}>
                          <select
                            value={order.status || 'Pending'}
                            onChange={e => handleStatusChange(order.id, e.target.value)}
                            disabled={statusUpdating === order.id}
                          >
                            <option value="Pending">Pending</option>
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab === 'Payments' && (
          <div>
            <h3>Payment Reports (Coming Soon)</h3>
            <div>View payment history and reports here.</div>
          </div>
        )}
        {tab === 'Coupons' && (
          <div>
            <h3>Discount Coupons (Coming Soon)</h3>
            <div>Add, edit, and delete discount coupons here.</div>
          </div>
        )}
        {tab === 'Notifications' && (
          <div>
            <h3>Send Notifications (Coming Soon)</h3>
            <div>Send notifications to users here.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 
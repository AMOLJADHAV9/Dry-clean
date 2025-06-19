import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { getFirestore, collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import './ServiceSelection.css';

const db = getFirestore();

const ServiceSelection = () => {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState('');
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showBooking, setShowBooking] = useState(false);
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [bookingCart, setBookingCart] = useState([]); // for Book Now on single card
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod] = useState("Cash on Delivery");

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      setServicesError('');
      try {
        const snapshot = await getDocs(collection(db, 'services'));
        setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setServicesError('Failed to load services.');
      }
      setLoadingServices(false);
    };
    fetchServices();
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: Math.max(1, Number(value)) });
  };

  const addToCart = (service) => {
    const qty = quantities[service.id] || 1;
    if (!cart.find(item => item.id === service.id)) {
      setCart([...cart, { ...service, quantity: qty }]);
    }
  };

  const removeFromCart = (serviceId) => {
    setCart(cart.filter(item => item.id !== serviceId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const bookingTotal = bookingCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async (e, useBookingCart = false) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const user = auth.currentUser;
      const usedCart = useBookingCart ? bookingCart : cart;
      const usedTotal = useBookingCart ? bookingTotal : total;
      await addDoc(collection(db, 'orders'), {
        userId: user ? user.uid : null,
        userEmail: user ? user.email : '',
        cart: usedCart,
        total: usedTotal,
        pickupAddress,
        deliveryAddress,
        paymentMethod,
        instructions,
        created: Timestamp.now(),
      });
      setSuccess('Order placed successfully!');
      setCart([]);
      setQuantities({});
      setShowBooking(false);
      setBookingCart([]);
      setPickupAddress("");
      setDeliveryAddress("");
      setInstructions("");
    } catch (err) {
      setError('Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  const handleBookNowCard = (service) => {
    const qty = quantities[service.id] || 1;
    setBookingCart([{ ...service, quantity: qty }]);
    setShowBooking('card');
    setAddress('');
    setInstructions('');
    setSuccess('');
    setError('');
  };

  return (
    <div className="auth-container" style={{marginTop:'2rem', maxWidth: 900}}>
      <h2>Select Services</h2>
      {loadingServices ? (
        <div>Loading services...</div>
      ) : servicesError ? (
        <div style={{color:'red'}}>{servicesError}</div>
      ) : (
        <div className="services-grid">
          {services.map(service => (
            <div className="service-card-grid" key={service.id}>
              <img src={service.img} alt={service.name} className="service-img" />
              <div className="service-title">{service.name}</div>
              <div className="service-desc">{service.desc}</div>
              <div className="service-badges">
                {(service.badges || []).map(badge => (
                  <span className={`badge badge-${badge.toLowerCase()}`} key={badge}>{badge}</span>
                ))}
              </div>
              <div className="service-price">₹{service.price}</div>
              <div className="service-qty-row">
                <label htmlFor={`qty-${service.id}`}>Qty:</label>
                <input
                  id={`qty-${service.id}`}
                  type="number"
                  min="1"
                  value={quantities[service.id] || 1}
                  onChange={e => handleQuantityChange(service.id, e.target.value)}
                  className="service-qty-input"
                  disabled={!!cart.find(item => item.id === service.id)}
                />
              </div>
              <div style={{display:'flex',gap:'0.5rem',marginTop:'0.5rem'}}>
                <button
                  onClick={() => addToCart(service)}
                  disabled={!!cart.find(item => item.id === service.id)}
                  className="add-cart-btn"
                >
                  {cart.find(item => item.id === service.id) ? 'Added' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => handleBookNowCard(service)}
                  className="add-cart-btn"
                  style={{background:'#3949ab'}}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <h3>Cart</h3>
      {cart.length === 0 ? <div>No services selected.</div> : (
        <>
          <ul style={{listStyle:'none',padding:0}}>
            {cart.map(item => (
              <li key={item.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.5rem'}}>
                <span>{item.name} <span style={{color:'#3949ab'}}>₹{item.price}</span> x {item.quantity}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{background:'#d32f2f',color:'#fff',border:'none',borderRadius:'6px',padding:'0.2rem 0.7rem',fontWeight:'bold',cursor:'pointer'}}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div style={{fontWeight:'bold',margin:'1rem 0'}}>Total: <span style={{color:'#1a237e'}}>₹{total}</span></div>
          <button
            onClick={() => { setShowBooking('cart'); setBookingCart([]); }}
            style={{background:'#1a237e',color:'#fff',border:'none',borderRadius:'8px',padding:'0.9rem 2.5rem',fontWeight:'bold',fontSize:'1.15rem',cursor:'pointer',marginTop:'0.5rem'}}
          >
            Book Now
          </button>
        </>
      )}
      {showBooking && (
        <div style={{marginTop:'2rem',background:'#f5f7fa',padding:'2rem',borderRadius:12,boxShadow:'0 2px 16px rgba(26,35,126,0.08)'}}>
          <h3>Booking Details</h3>
          <ul style={{listStyle:'none',padding:0,marginBottom:'1rem'}}>
            {(showBooking === 'cart' ? cart : bookingCart).map(item => (
              <li key={item.id} style={{marginBottom:'0.3rem'}}>
                {item.name} <span style={{color:'#3949ab'}}>₹{item.price}</span> x {item.quantity}
              </li>
            ))}
          </ul>
          <div style={{fontWeight:'bold',marginBottom:'1rem'}}>Total: <span style={{color:'#1a237e'}}>₹{showBooking === 'cart' ? total : bookingTotal}</span></div>
          <form onSubmit={e => handleOrder(e, showBooking !== 'cart')} style={{marginTop:'1rem',textAlign:'left'}}>
            <label>Pickup Address</label>
            <input type="text" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} required style={{width:'100%'}} />
            <label>Delivery Address</label>
            <input type="text" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} required style={{width:'100%'}} />
            <label>Payment Method</label>
            <input type="text" value={paymentMethod} readOnly style={{width:'100%', background:'#e0e0e0', color:'#3949ab', fontWeight:'bold'}} />
            <label>Special Instructions</label>
            <textarea value={instructions} onChange={e => setInstructions(e.target.value)} style={{width:'100%'}} />
            <button type="submit" disabled={loading} style={{marginTop:'1rem',background:'#1a237e',color:'#fff',border:'none',borderRadius:'8px',padding:'0.7rem 2rem',fontWeight:'bold',fontSize:'1.1rem',cursor:'pointer'}}>
              {loading ? 'Placing Order...' : 'Confirm Booking'}
            </button>
            <button type="button" onClick={() => { setShowBooking(false); setBookingCart([]); }} style={{marginLeft:'1rem',background:'#fff',color:'#3949ab',border:'1.5px solid #3949ab',borderRadius:'8px',padding:'0.7rem 2rem',fontWeight:'bold',fontSize:'1.1rem',cursor:'pointer'}}>Back to Services</button>
            {error && <div className="auth-error">{error}</div>}
          </form>
          {success && <div style={{color:'#388e3c',marginTop:'1rem',fontWeight:'bold'}}>{success}</div>}
        </div>
      )}
      {success && !showBooking && <div style={{color:'#388e3c',marginTop:'1rem',fontWeight:'bold'}}>{success}</div>}
    </div>
  );
};

export default ServiceSelection; 
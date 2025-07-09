import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const ORDER_URL = "http://localhost:60/api/order";
const CART_URL = "http://localhost:60/api/cart";
const PRODUCT_API_URL = "http://localhost:60/api/product";

const Checkout = () => {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [savedAddress, setSavedAddress] = useState(null);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(CART_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCart(data));
    fetch(PRODUCT_API_URL)
      .then(res => res.json())
      .then(data => setProducts(data));
    // Prefill address from localStorage
    const savedAddress = localStorage.getItem('checkoutAddress');
    if (savedAddress) {
      setSavedAddress(JSON.parse(savedAddress));
      setAddress(JSON.parse(savedAddress));
    }
  }, [token, navigate]);

  const getProductDetails = (productId) => products.find(p => p.id === productId);

  const totalItems = cart.length;
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const product = getProductDetails(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const shippingCharge = totalPrice < 500 && totalPrice > 0 ? 50 : 0;
  const grandTotal = totalPrice + shippingCharge;

  const validate = () => {
    const newErrors = {};
    if (!address.name) newErrors.name = 'Name is required';
    if (!address.street) newErrors.street = 'Street is required';
    if (!address.city) newErrors.city = 'City is required';
    if (!address.state) newErrors.state = 'State is required';
    if (!address.zip) newErrors.zip = 'ZIP is required';
    if (!address.phone) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressChange = e => {
    const newAddress = { ...address, [e.target.name]: e.target.value };
    setAddress(newAddress);
    localStorage.setItem('checkoutAddress', JSON.stringify(newAddress));
  };

  const handleSaveAddress = () => {
    localStorage.setItem('checkoutAddress', JSON.stringify(address));
    setSavedAddress(address);
    setSaveMsg('Address saved for future use!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  const handleUseSavedAddress = () => {
    if (savedAddress) {
      setAddress(savedAddress);
      setSaveMsg('Saved address loaded!');
      setTimeout(() => setSaveMsg(''), 1500);
    }
  };

  const handleCheckout = async () => {
    if (!validate()) return;
    // Save address to localStorage on checkout as well
    localStorage.setItem('checkoutAddress', JSON.stringify(address));
    const res = await fetch(ORDER_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ address, paymentMethod: 'COD' }) // Only send COD
    });
    if (res.ok) {
      setMessage("Order placed successfully!");
      setTimeout(() => navigate("/"), 2000);
    } else {
      setMessage("Checkout failed.");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32, color: '#1976d2', letterSpacing: 1 }}>Checkout</h2>
      {cart.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Your cart is empty.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 28, background: '#fafbfc', borderRadius: 8, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#1976d2', color: '#fff' }}>
                <th style={{ border: 'none', padding: 12, fontWeight: 600 }}>Image</th>
                <th style={{ border: 'none', padding: 12, fontWeight: 600 }}>Product</th>
                <th style={{ border: 'none', padding: 12, fontWeight: 600 }}>Quantity</th>
                <th style={{ border: 'none', padding: 12, fontWeight: 600 }}>Price</th>
                <th style={{ border: 'none', padding: 12, fontWeight: 600 }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => {
                const product = getProductDetails(item.productId);
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee', background: '#fff' }}>
                    <td style={{ padding: 10, textAlign: 'center' }}>
                      {product && (
                        <img src={product.imageUrl} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }} />
                      )}
                    </td>
                    <td style={{ padding: 10, fontWeight: 500, color: '#333' }}>{product ? product.name : 'Product not found'}</td>
                    <td style={{ padding: 10, textAlign: 'center', color: '#1976d2', fontWeight: 500 }}>{item.quantity}</td>
                    <td style={{ padding: 10, textAlign: 'center' }}>₹{product ? product.price : '-'}</td>
                    <td style={{ padding: 10, textAlign: 'center', fontWeight: 500 }}>₹{product ? (product.price * item.quantity).toFixed(2) : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ marginBottom: 28, background: '#f5f7fa', borderRadius: 8, padding: 20, fontSize: 18, color: '#222', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ marginBottom: 8 }}><strong>Total Items:</strong> {totalItems}</div>
            <div style={{ marginBottom: 8 }}><strong>Total Quantity:</strong> {totalQuantity}</div>
            <div style={{ marginBottom: 8 }}><strong>Subtotal:</strong> <span>₹{totalPrice.toFixed(2)}</span></div>
            {shippingCharge > 0 && (
              <div style={{ marginBottom: 8, color: '#d32f2f' }}><strong>Shipping Charge:</strong> ₹{shippingCharge}</div>
            )}
            <div><strong>Grand Total:</strong> <span style={{ color: '#1976d2', fontWeight: 600 }}>₹{grandTotal.toFixed(2)}</span></div>
          </div>
          {/* Address Form */}
          <div style={{ marginBottom: 32, background: '#f5f7fa', borderRadius: 8, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <h3 style={{ marginBottom: 16, color: '#1976d2' }}>Shipping Address</h3>
            {savedAddress && (
              <div style={{ marginBottom: 12, background: '#e8f5e9', borderRadius: 8, padding: 12, color: '#388e3c', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Saved Address: {savedAddress.name}, {savedAddress.street}, {savedAddress.city}, {savedAddress.state}, {savedAddress.zip}, {savedAddress.phone}</span>
                <button onClick={handleUseSavedAddress} style={{ marginLeft: 16, background: '#43b02a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Use Saved Address</button>
              </div>
            )}
            {saveMsg && <div style={{ color: '#388e3c', marginBottom: 10, fontWeight: 500 }}>{saveMsg}</div>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <input name="name" value={address.name} onChange={handleAddressChange} placeholder="Full Name" style={{ width: '100%', padding: 8, marginBottom: 4 }} />
                {errors.name && <div style={{ color: '#d32f2f', fontSize: 13 }}>{errors.name}</div>}
              </div>
              <div style={{ flex: 2, minWidth: 220 }}>
                <input name="street" value={address.street} onChange={handleAddressChange} placeholder="Street Address" style={{ width: '100%', padding: 8, marginBottom: 4 }} />
                {errors.street && <div style={{ color: '#d32f2f', fontSize: 13 }}>{errors.street}</div>}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 120 }}>
                <input name="city" value={address.city} onChange={handleAddressChange} placeholder="City" style={{ width: '100%', padding: 8, marginBottom: 4 }} />
                {errors.city && <div style={{ color: '#d32f2f', fontSize: 13 }}>{errors.city}</div>}
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <input name="state" value={address.state} onChange={handleAddressChange} placeholder="State" style={{ width: '100%', padding: 8, marginBottom: 4 }} />
                {errors.state && <div style={{ color: '#d32f2f', fontSize: 13 }}>{errors.state}</div>}
              </div>
              <div style={{ flex: 1, minWidth: 100 }}>
                <input name="zip" value={address.zip} onChange={handleAddressChange} placeholder="ZIP Code" style={{ width: '100%', padding: 8, marginBottom: 4 }} />
                {errors.zip && <div style={{ color: '#d32f2f', fontSize: 13 }}>{errors.zip}</div>}
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <input name="phone" value={address.phone} onChange={handleAddressChange} placeholder="Phone Number" style={{ width: '100%', padding: 8, marginBottom: 4 }} />
                {errors.phone && <div style={{ color: '#d32f2f', fontSize: 13 }}>{errors.phone}</div>}
              </div>
            </div>
            <button onClick={handleSaveAddress} style={{ marginTop: 12, background: '#43b02a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px rgba(67,176,42,0.08)' }}>
              Save Address
            </button>
          </div>
          {/* Payment Form */}
          <div style={{ marginBottom: 32, background: '#f5f7fa', borderRadius: 8, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <h3 style={{ marginBottom: 16, color: '#1976d2' }}>Payment Details</h3>
            <div style={{ fontSize: 18, color: '#1976d2', fontWeight: 500, padding: 12 }}>
              Pay on Delivery (Cash/Card/UPI accepted at your doorstep)
            </div>
          </div>
          <button onClick={handleCheckout} style={{ width: '100%', padding: '14px 0', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontSize: 18, fontWeight: 600, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.08)' }}>
            Place Order
          </button>
        </>
      )}
      {message && <p style={{ textAlign: 'center', marginTop: 24, color: message.includes('success') ? '#388e3c' : '#d32f2f', fontWeight: 500 }}>{message}</p>}
    </div>
  );
};

export default Checkout;
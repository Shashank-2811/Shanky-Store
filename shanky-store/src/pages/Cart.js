import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const CART_URL = "http://localhost:60/api/cart";
const PRODUCT_API_URL = "http://localhost:60/api/product";
const ZEPTO_GREEN = "#43b02a";

const Cart = () => {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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
  }, [token, navigate]);

  const removeFromCart = async (productId) => {
    await fetch(`${CART_URL}/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setCart(cart.filter(item => item.productId !== productId));
  };

  const getProductDetails = (productId) => products.find(p => p.id === productId);

  const totalPrice = cart.reduce((sum, item) => {
    const product = getProductDetails(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div style={{ fontFamily: "Poppins, Segoe UI, Arial, sans-serif", background: "#f6f6f6", minHeight: "100vh" }}>
      <div style={{ maxWidth: 700, margin: "60px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: 32 }}>
        <h2 style={{ textAlign: "center", color: ZEPTO_GREEN, marginBottom: 32, fontWeight: 700, letterSpacing: 1 }}>Your Cart</h2>
        {cart.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>Cart is empty.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cart.map(item => {
              const product = getProductDetails(item.productId);
              return (
                <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 24, background: '#fafbfc', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 16 }}>
                  {product && (
                    <img src={product.imageUrl} alt={product.name} style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 16, borderRadius: 8 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 18, color: ZEPTO_GREEN }}>{product ? product.name : 'Product not found'}</div>
                    <div style={{ color: '#555', marginBottom: 4 }}>Price: ₹{product ? product.price : '-'}</div>
                    <div style={{ color: '#555' }}>Quantity: {item.quantity}</div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    style={{ background: ZEPTO_GREEN, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {cart.length > 0 && (
          <div style={{ marginTop: 32, textAlign: 'center', fontSize: 20, fontWeight: 600, color: ZEPTO_GREEN }}>
            Total: ₹{totalPrice.toFixed(2)}
            <button
              onClick={() => navigate("/checkout")}
              style={{ display: 'block', margin: '32px auto 0', background: ZEPTO_GREEN, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 36px', fontWeight: 600, fontSize: 18, cursor: 'pointer' }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
      {/* Footer */}
      <div style={{ marginTop: 60, padding: '32px 0', background: '#f5f7fa', borderRadius: 12, textAlign: 'center', color: '#888', fontSize: 16 }}>
        <div style={{ marginBottom: 8 }}>
          &copy; {new Date().getFullYear()} Shanky Store &mdash; All rights reserved.
        </div>
        <div>
          <span style={{ margin: '0 12px', cursor: 'pointer', color: ZEPTO_GREEN, fontWeight: 600 }} onClick={() => navigate('/')}>Home</span>
          <span style={{ margin: '0 12px', cursor: 'pointer', color: ZEPTO_GREEN, fontWeight: 600 }} onClick={() => navigate('/cart')}>Cart</span>
          <span style={{ margin: '0 12px', cursor: 'pointer', color: ZEPTO_GREEN, fontWeight: 600 }} onClick={() => navigate('/about')}>About</span>
          <span style={{ margin: '0 12px', cursor: 'pointer', color: ZEPTO_GREEN, fontWeight: 600 }} onClick={() => navigate('/contact')}>Contact</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;
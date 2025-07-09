import React, { useEffect, useState, useContext } from "react";
import { Grid, Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const API_URL = "http://localhost:60/api/product";
const ZEPTO_GREEN = "#43b02a";
const CART_URL = "http://localhost:60/api/cart";

const CATEGORIES = [
  "All",
  "Grocery",
  "Munchies",
  "Vegetables",
  "Personal Care",
  "Home Decor",
  "Other"
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data));
    if (token) {
      fetch(CART_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setCart(data));
    }
  }, [token]);

  const getCartItem = (productId) => cart.find(item => item.productId === productId);

  const handleAddToCart = async (product) => {
    if (!token) {
      navigate("/login");
      return;
    }
    const res = await fetch(CART_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ ProductId: product.id, Quantity: 1 }),
    });
    if (res.ok) {
      // Refresh cart
      const updatedCart = await fetch(CART_URL, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
      setCart(updatedCart);
    }
  };

  const handleUpdateQuantity = async (product, newQuantity) => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (newQuantity <= 0) {
      // Remove from cart
      await fetch(`${CART_URL}/${product.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      // Update quantity
      await fetch(CART_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ ProductId: product.id, Quantity: newQuantity }),
      });
    }
    // Refresh cart
    const updatedCart = await fetch(CART_URL, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
    setCart(updatedCart);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = category === "All" || (product.category && product.category.toLowerCase() === category.toLowerCase());
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ fontFamily: "Poppins, Segoe UI, Arial, sans-serif", background: "#f6f6f6", minHeight: "100vh" }}>
      {/* Sticky Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", padding: "16px 0"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 28, color: ZEPTO_GREEN, cursor: 'pointer' }} onClick={() => navigate("/")}>Shanky Store</span>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: 400, padding: "10px 16px", borderRadius: 24, border: "1px solid #eee",
              fontSize: 16, outline: "none", boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
           
          </div>
        </div>
      </header>

      {/* Hero Section */}
     

      {/* Category Carousel */}
      <div style={{
        display: "flex", overflowX: "auto", gap: 24, padding: "24px 0", maxWidth: 1200, margin: "0 auto"
      }}>
        {CATEGORIES.slice(1).map(cat => (
          <div key={cat} style={{
            minWidth: 120, background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            textAlign: "center", padding: 20, fontWeight: 600, color: ZEPTO_GREEN, cursor: "pointer", transition: "transform 0.2s",
            border: category === cat ? `2px solid ${ZEPTO_GREEN}` : "2px solid #e0eafc",
            transform: category === cat ? "scale(1.08)" : "scale(1)",
          }}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <Grid container spacing={4} style={{ maxWidth: 1200, margin: "0 auto" }}>
        {filteredProducts.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary" sx={{ mt: 6 }}>
              No products found in this category.
            </Typography>
          </Grid>
        ) : (
          filteredProducts.map(product => {
            const cartItem = getCartItem(product.id);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card sx={{
                  borderRadius: 4, boxShadow: 2, transition: "0.2s", '&:hover': { boxShadow: 8, transform: 'scale(1.03)' }
                }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{product.description}</Typography>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: ZEPTO_GREEN }}>₹{product.price}</Typography>
                    {cartItem ? (
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        <Button variant="outlined" style={{ minWidth: 36, fontWeight: 700, color: ZEPTO_GREEN, borderColor: ZEPTO_GREEN }} onClick={() => handleUpdateQuantity(product, cartItem.quantity - 1)}>-</Button>
                        <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 600 }}>{cartItem.quantity}</span>
                        <Button variant="outlined" style={{ minWidth: 36, fontWeight: 700, color: ZEPTO_GREEN, borderColor: ZEPTO_GREEN }} onClick={() => handleUpdateQuantity(product, cartItem.quantity + 1)}>+</Button>
                      </Box>
                    ) : (
                      <Button variant="contained" style={{
                        background: ZEPTO_GREEN, color: "#fff", fontWeight: 600, borderRadius: 2
                      }} fullWidth onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Footer */}
      <div style={{ marginTop: 60, padding: '32px 0', background: '#f5f7fa', borderRadius: 12, textAlign: 'center', color: '#888', fontSize: 16 }}>
        <div style={{ marginBottom: 8 }}>
          &copy; {new Date().getFullYear()} Shanky Store (For Celebal Technologies project) &mdash; All rights reserved.
        </div>
        <div>
          <span style={{ margin: '0 12px', cursor: 'pointer', color: '#43b02a', fontWeight: 600 }} onClick={() => navigate('/')}>Home</span>
          <span style={{ margin: '0 12px', cursor: 'pointer', color: '#43b02a', fontWeight: 600 }} onClick={() => navigate('/cart')}>Cart</span>
          <span style={{ margin: '0 12px', cursor: 'pointer', color: '#43b02a', fontWeight: 600 }} onClick={() => navigate('/about')}>About</span>
          <span style={{ margin: '0 12px', cursor: 'pointer', color: '#43b02a', fontWeight: 600 }} onClick={() => navigate('/contact')}>Contact</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
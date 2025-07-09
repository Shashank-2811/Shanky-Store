import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "http://localhost:60/api/auth/login";
const ZEPTO_GREEN = "#43b02a";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        login(data.token, data.user);
        navigate("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Login failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f6f6f6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins, Segoe UI, Arial, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 4px 32px rgba(67,176,42,0.08)", padding: 36, maxWidth: 380, width: "100%", margin: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 32, color: ZEPTO_GREEN, letterSpacing: 1, marginBottom: 4 }}>Shanky Store</div>
          <div style={{ color: "#888", fontSize: 16, marginBottom: 8 }}>Welcome back! Please login to continue.</div>
        </div>
        {error && <div style={{ color: "#d32f2f", marginBottom: 14, textAlign: "center", fontWeight: 500 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ fontWeight: 600, color: ZEPTO_GREEN }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e0eafc", fontSize: 16, marginTop: 6, outline: "none", transition: "border 0.2s", boxSizing: "border-box" }}
              onFocus={e => e.target.style.border = `1.5px solid ${ZEPTO_GREEN}`}
              onBlur={e => e.target.style.border = "1.5px solid #e0eafc"}
            />
          </div>
          <div style={{ position: "relative" }}>
            <label style={{ fontWeight: 600, color: ZEPTO_GREEN }}>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e0eafc", fontSize: 16, marginTop: 6, outline: "none", transition: "border 0.2s", boxSizing: "border-box" }}
              onFocus={e => e.target.style.border = `1.5px solid ${ZEPTO_GREEN}`}
              onBlur={e => e.target.style.border = "1.5px solid #e0eafc"}
            />
            <span
              onClick={() => setShowPassword(s => !s)}
              style={{ position: "absolute", right: 16, top: 38, cursor: "pointer", color: ZEPTO_GREEN, fontWeight: 600, fontSize: 15, userSelect: "none" }}
              tabIndex={0}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "13px 0", borderRadius: 10, background: ZEPTO_GREEN, color: "#fff", fontWeight: 700, fontSize: 18, border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 2px 8px rgba(67,176,42,0.08)", transition: "background 0.2s, transform 0.1s", marginTop: 8, letterSpacing: 1, outline: "none"
            }}
            onMouseDown={e => e.target.style.transform = "scale(0.97)"}
            onMouseUp={e => e.target.style.transform = "scale(1)"}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div style={{ marginTop: 24, textAlign: "center", color: "#888", fontSize: 15 }}>
          <span>Don't have an account? <Link to="/register" style={{ color: ZEPTO_GREEN, fontWeight: 600, textDecoration: "none" }}>Register here</Link></span>
          <br />
          <span><Link to="/" style={{ color: ZEPTO_GREEN, fontWeight: 600, textDecoration: "none" }}>Back to Home</Link></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
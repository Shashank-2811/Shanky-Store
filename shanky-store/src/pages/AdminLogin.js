import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Replace this with your real admin login API call
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("adminToken", "mock-admin-token");
      navigate("/admin");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: 32 }}>
      <h2 style={{ textAlign: "center", color: "#1976d2", marginBottom: 24 }}>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ width: "100%", padding: 12, background: "#1976d2", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600, fontSize: 16 }}>
          Login
        </button>
      </form>
      {error && <div style={{ color: "#d32f2f", marginTop: 16, textAlign: "center" }}>{error}</div>}
    </div>
  );
};

export default AdminLogin; 
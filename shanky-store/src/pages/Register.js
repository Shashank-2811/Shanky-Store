import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "http://localhost:60/api/auth/register";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      if (res.ok) {
        setSuccess("Registration successful! You can now login.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = await res.text();
        }
        setError(errorData.message || errorData || "Registration failed");
      }
    } catch (error) {
      setError("Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2>Register for Shanky Store</h2>
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      {success && <div style={{ color: "green", marginBottom: "10px" }}>{success}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        
        <button 
          type="submit"
          style={{ 
            padding: "10px", 
            backgroundColor: "#28a745", 
            color: "white", 
            border: "none",
            cursor: "pointer"
          }}
        >
          Register
        </button>
      </form>
      
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
        <p><Link to="/">Back to Home</Link></p>
      </div>
    </div>
  );
};

export default Register;